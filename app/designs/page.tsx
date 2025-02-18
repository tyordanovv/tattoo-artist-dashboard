'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

// Define the Design DTO
interface Design {
    id: string;
    image_url: string;
}

export default function DesignsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const [designs, setDesigns] = useState<Design[]>([]); // Use the Design DTO
    const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDesigns = async () => {
            const ids = searchParams.get('ids');
            if (ids) {
                const decodedIds = decodeURIComponent(ids).split(',');

                // Fetch designs from the database using the IDs
                const { data, error } = await supabase
                    .from('designs')
                    .select('id, image_url')
                    .in('id', decodedIds);

                if (error) {
                    console.error('Error fetching designs:', error);
                } else if (data) {
                    setDesigns(data);
                }
            }
        };

        fetchDesigns();
    }, [searchParams, supabase]);

    const handleSelectDesign = async () => {
        if (!selectedDesign) return;

        setLoading(true);
        try {
            const { data: user, error } = await supabase.auth.getUser();
            if (error || !user) throw new Error('Unauthorized');

            const { error: updateError } = await supabase
                .from('designs')
                .update({ isSelected: true })
                .eq('id', selectedDesign);

            if (updateError) throw updateError;

            // Redirect user to profile or success page
            router.push('/dashboard');
        } catch (error) {
            console.error('Error saving design:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto p-4 md:p-6 max-w-7xl">
            <h1 className="text-3xl font-bold text-center mb-6 md:mb-8">Select Your Design</h1>
            
            {/* Cards Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:gap-6">
                {designs.map((design) => (
                    <Card
                        key={design.id}
                        className={`flex-shrink-0 w-[85vw] snap-center md:w-full cursor-pointer transition-all 
                            hover:shadow-lg hover:border-primary/30 border-2 ${
                                selectedDesign === design.id 
                                    ? 'border-primary shadow-xl' 
                                    : 'border-transparent'
                            }`}
                        onClick={() => setSelectedDesign(design.id)}
                    >
                        <CardContent className="p-2 aspect-square">
                            <img 
                                src={design.image_url} 
                                alt={`Design ${design.id}`} 
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedDesign && (
                <div className="sticky bottom-0 bg-background/95 py-4 mt-4 border-t md:static md:bg-transparent md:border-0">
                    <div className="flex justify-center">
                        <Button 
                            onClick={handleSelectDesign} 
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Saving...
                                </>
                            ) : (
                                'Confirm Selection'
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}