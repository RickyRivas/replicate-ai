import Replicate from "replicate";
import { json } from "@sveltejs/kit";

const replicate = new Replicate()

export async function POST({ request }) {
    const { imagePrompt } = await request.json()
    const msg = `from the API: ${ imagePrompt }`
    return json(msg)
}