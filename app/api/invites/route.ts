import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Input validation schema
const InviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters long')
})

export async function POST(request: Request) {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized: Must be logged in.' }, 
                { status: 401 }
            )
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userError || userData.role !== 'artist') {
            return NextResponse.json(
                { error: 'Unauthorized: Must be an artist.' }, 
                { status: 403 }
            )
        }
        console.log("userData", userData)

        // Generate invite
        const inviteId = crypto.randomUUID()
        const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/questionnaire/${inviteId}`

        const { data: inviteData, error: inviteError } = await supabase
            .from('invites')
            .insert({
                id: inviteId,
                artist_id: user.id,
                invite_url: inviteUrl
            })
            .select()
            .single()

        if (inviteError) {
            throw inviteError
        }

        return NextResponse.json({
            inviteUrl,
            message: 'User created successfully'
        })

    } catch (error) {
        console.error('User creation error:', error)
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message }, 
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        )
    }
}