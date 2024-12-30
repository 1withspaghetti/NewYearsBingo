import { BingoPlayer } from '$lib/models/bingoPlayerModel';
import bingoGamePlayerSchema from '$lib/validation/bingoGamePlayerValidator';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ZodError } from 'zod';
import { BingoGame } from '$lib/models/bingoGameModel';

export const POST: RequestHandler = async ({ params, request }) => {
    try {
        let body = await request.json();
        let validatedBody = bingoGamePlayerSchema.parse(body);

        let game = await BingoGame.findById(params.id);
        if (!game) return error(404, 'Game not found');

        let player = new BingoPlayer(validatedBody);
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