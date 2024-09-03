import { fail } from '@sveltejs/kit';
import Replicate from "replicate";
import { REPLICATE_API_TOKEN, PRIVATE_SUPABASE_ANON_KEY, PRIVATE_SUPABASE_URL } from "$env/static/private";
import { createClient } from '@supabase/supabase-js'

const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN
})
export const actions = {
    generateImg: async ({ request, fetch }) => {
        console.log('reached the action.');
        const formData = await request.formData()
        const imagePrompt = formData.get('image-prompt');
        const input = {
            prompt: imagePrompt,
            num_outputs: 1,
            disable_safety_checker: true
        }

        // SUPABASE
        // Initialize Supabase client
        const supabase = createClient(PRIVATE_SUPABASE_URL, PRIVATE_SUPABASE_ANON_KEY)

        try {
            const model = 'black-forest-labs/flux-dev'
            const output = await replicate.run(model, { input })

            // save output to db
            console.log('output:', output)
            // Store the URL in Supabase
            const { data, error: supabaseError } = await supabase
                .from('image_urls')
                .insert([
                    { prompt: imagePrompt, url: output[ 0 ], model }
                ]);

            if (supabaseError) return fail(401, { message: 'Error saving data to DB' });

            return { success: true, output }
        } catch (err) {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const statusCode = err.response.status;
                // const errorDetail = err.response.data.detail || 'Unknown error occurred';
                // const errorType = err.response.data.type || 'UnknownError';
                return fail(statusCode, { message: err.message })
            } else if (err.request) {
                // The request was made but no response was received
                return fail(500, { message: 'No response received from Replicate API' })
            } else {
                // Something happened in setting up the request that triggered an Error
                return fail(500, { message: err.message || 'An unexpected error occurred' })
            }
        }
    }
}