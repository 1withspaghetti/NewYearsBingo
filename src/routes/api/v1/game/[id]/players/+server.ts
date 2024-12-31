import { BingoPlayer } from '$lib/models/bingoPlayerModel';
import bingoGamePlayerSchema from '$lib/validation/bingoGamePlayerValidator';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ZodError } from 'zod';
import { BingoGame } from '$lib/models/bingoGameModel';
import { idValidator } from '$lib/validation/idValidator';

export const POST: RequestHandler = async ({ params, request }) => {
    try {
        let id = idValidator.parse(params.id);
        let body = await request.json();
        let validatedBody = bingoGamePlayerSchema.parse(body);

        let game = await BingoGame.findById(id);
        if (!game) return error(404, 'Game not found');

        let player = new BingoPlayer(validatedBody);
        if (!player.seed) player.seed = Math.random().toString(36).substring(2, 15);
        const playerResult = await player.save();

        game.players.push(playerResult._id);
        await game.save();

        return json({ game: playerResult.toObject() });
    } catch (e) {
        if (e instanceof ZodError) {
            return error(400, e.errors[0].message);
        } else throw e;
    }
};
