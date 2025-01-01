import type { RequestHandler } from './$types';
import { idValidator } from '$lib/validation/idValidator';
import bingoGamePlayerChecksValidator from '$lib/validation/bingoGamePlayerChecksValidator';
import { BingoPlayer } from '$lib/models/bingoPlayerModel';
import { BingoGame } from '$lib/models/bingoGameModel';
import { error, json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export const POST: RequestHandler = async ({ params, request }) => {
    try {
        let id = idValidator.parse(params.id);
        let playerId = idValidator.parse(params.playerId);
        let body = await request.json();
        let validatedBody = bingoGamePlayerChecksValidator.parse(body);

        let game = await BingoGame.findById(id);
        if (!game) return error(404, 'Game not found');

        let player = await BingoPlayer.findById(playerId);
        if (!player) return error(404, 'Player not found');

        player.checks = validatedBody.checks;
        let playerResult = await player.save();

        return json({ player: playerResult.toObject() });
    } catch (e) {
        if (e instanceof ZodError) {
            return error(400, e.errors[0].message);
        } else throw e;
    }
};