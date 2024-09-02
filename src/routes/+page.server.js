import { fail } from '@sveltejs/kit'
export const actions = {
    generateImg: async ({ request, fetch }) => {
        console.log('reached the action.');
        const formData = await request.formData()
        const imagePrompt = formData.get('image-prompt');
        console.log('form action requested prompt:', imagePrompt)

        // reach local API
        const response = await fetch('/api/flux-schnell', {
            method: 'post',
            headers: {
                accept: 'application/json',
            },
            body: JSON.stringify({ imagePrompt: imagePrompt })
        });

        const data = await response.json();
        return { success: true, data }
    }
}