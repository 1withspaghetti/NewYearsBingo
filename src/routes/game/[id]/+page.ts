import type { PageLoad } from './$types';

// TEMP DATA
const gameData: IBingoGame = {
    id: '1',
    title: 'Bingo Game',
    center: 'Free',
    items: [
        "woof",
        "wruff",
        "wuuf",
        "awo",
        "awruff",
        "awoof",
        "woof?",
        "woof!",
        "dog",
        "pup",
        "leash",
        "collar",
        "wag",
        "wagging",
        "walk",
        "walkies",
        "🥺",
        "wrawr",
        "rawr",
        "🦴",
        "🐕",
        "🐶",
        "✨",
        "🐕‍🦺"
    ],
    players: [
        {
            id: '1',
            name: 'Player 1',
            seed: 1
        }
    ],
}

export const load = (async ({ params, fetch }) => {
    return {
        game: gameData,
    };
}) satisfies PageLoad;