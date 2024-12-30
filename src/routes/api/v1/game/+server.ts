import { ZodError } from 'zod';
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import bingoGameSettingsValidator from '$lib/validation/bingoGameSettingsValidator';
import { BingoGame } from '$lib/models/bingoGameModel';

export const POST: RequestHandler = async ({ request }) => {
    try {
        let body = await request.json();

        let validatedBody = bingoGameSettingsValidator.parse(body);

        let game = new BingoGame({...validatedBody, players: []});
        const result = await game.save();

        return json({ game: result.toObject() });
    } catch (e) {
        if (e instanceof ZodError) {
            return error(400, e.errors[0].message);
        } else throw e;
    }
};