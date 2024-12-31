import { idValidator } from '$lib/validation/idValidator';
import { ZodError } from 'zod';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { BingoGame } from '$lib/models/bingoGameModel';

export const GET: RequestHandler = async ({ params }) => {
    try {
        let id = idValidator.parse(params.id);

        let game = await BingoGame.findById(id).populate('players');
        if (!game) return error(404, 'Game not found');

        return json({ game: game.toObject() });
    } catch (e) {
        if (e instanceof ZodError) {
            return error(400, e.errors[0].message);
        } else throw e;
    }
};