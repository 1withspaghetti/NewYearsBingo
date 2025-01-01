interface IBingoGameSettings {
    title: string;
    center?: string;
    items: string[];
}

interface IBingoGamePlayer {
    id: string;
    name: string;
    seed: string;
    checks: number[]
}

interface IBingoGame extends IBingoGameSettings {
    id: string;
    players: IBingoGamePlayer[];
}
