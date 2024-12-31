import { BASE_API_URL } from '$lib/util/apiClient';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// TEMP DATA
// const gameData: IBingoGame = {
//     id: '1',
//     title: 'Bingo Game',
//     center: 'Free',
//     items: [
//         "woof",
//         "wruff",
//         "wuuf",
//         "awo",
//         "awruff",
//         "awoof",
//         "woof?",
//         "woof!",
//         "dog",
//         "pup",
//         "leash",
//         "collar",
//         "wag",
//         "wagging",
//         "walk",
//         "walkies",
//         "🥺",
//         "wrawr",
//         "rawr",
//         "🦴",
//         "🐕",
//         "🐶",
//         "✨",
//         "🐕‍🦺"
//     ],
//     players: [
//         {
//             id: '1',
//             name: 'Player 1',
//             seed: '1'
//         }
//     ],
// }

export const load = (async ({ params, fetch, depends }) => {
    depends("custom:game")

    const gameDataRes = await fetch(`${BASE_API_URL}/game/${params.id}`);
    const gameData = await gameDataRes.json();

    if (!gameDataRes.ok) error(gameDataRes.status, gameData.message);
    
    return {
        game: gameData.game as IBingoGame,
    };
}) satisfies PageLoad;