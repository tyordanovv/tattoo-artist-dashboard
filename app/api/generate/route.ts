import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { buildTattooPrompt } from '@/app/utils/promptBuilder';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );

    // Check if user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Must be logged in' },
        { status: 401 }
      );
    }

    const { answers, referenceImages, inviteId } = await request.json();
    const prompt = buildTattooPrompt(answers);
    
    const designs = [];

    const { data: data, error: clientCheckError } = await supabase
    .from('invites')
    .select('artist_id')
    .eq('id', inviteId)
    .single();

    const artist_id = data?.artist_id;

    for (let i = 0; i < 3; i++) {
      const form = new FormData();
      form.append("prompt", prompt);
      form.append("output_format", "webp");

      if (referenceImages && referenceImages.length > 0) {
        let base64Data = referenceImages[0];
        const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        let buffer: Buffer;
        if (matches) {
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          buffer = Buffer.from(base64Data, 'base64');
        }
        form.append("image", buffer, {
          filename: "reference.jpg",
          contentType: "image/jpeg",
        });
        form.append("strength", "0.5");
      }

      // Generate image using Stability AI
      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/ultra",
        form,
        {
          headers: {
            "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
            "Accept": "image/*",
            ...form.getHeaders(),
          },
          responseType: "arraybuffer",
        }
      );

      if (response.status !== 200) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      // Upload image buffer directly to Supabase
      const fileName = `design_${user.id}_${Date.now()}_${i + 1}.webp`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('designs')
        .upload(fileName, Buffer.from(response.data), {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image to Supabase:', uploadError);
        throw new Error('Failed to upload image');
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from('designs')
        .getPublicUrl(fileName);

      const { data: designData, error: insertError } = await supabase
        .from('designs')
        .insert({ 
          id: crypto.randomUUID(), 
          version: 1,
          image_url: publicUrl,
          isSelected: false,
          client_id: user.id,
          artist_id: artist_id
        })
        .select()
        .single();

      designs.push({ id: designData.id });
    }

    return NextResponse.json({ designs });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate designs' },
      { status: 500 }
    );
  }
}