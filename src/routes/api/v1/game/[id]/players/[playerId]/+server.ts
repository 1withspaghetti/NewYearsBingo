import { BingoGame } from '$lib/models/bingoGameModel';
import { idValidator } from '$lib/validation/idValidator';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BingoPlayer } from '$lib/models/bingoPlayerModel';
import { ZodError } from 'zod';

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        let id = idValidator.parse(params.id);
        let playerId = idValidator.parse(params.playerId);

        let game = await BingoGame.findById(id);
        if (!game) return error(404, 'Game not found');

        let player = await BingoPlayer.findById(playerId);
        if (!player) return error(404, 'Player not found');

        await player.deleteOne();
        game.players = game.players.filter(p => p.toString() !== playerId);
        await game.save();

        return json({});
    } catch (e) {
        if (e instanceof ZodError) {
            return error(400, e.errors[0].message);
        } else throw e;
    }
};