function cyrb128(str: string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

/**
 * Create a seeded random number generator
 * https://stackoverflow.com/a/47593316
 * @param seed A seed number
 * @returns A seeded random number generator function
 */
function mulberry32(seed: number) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}


/**
 * Create a seeded random number generator with additional functions
 * Shamelessly copied from https://stackoverflow.com/a/68523152
 * @param seed A seed number
 */
const seededRandom = (seed: number|string) => {
    let rng = typeof seed === 'number' ? mulberry32(seed) : mulberry32(cyrb128(seed)[0]);
  
    /**
     * @returns A seeded random float number between lo and hi (exclusive)
     */
    const rnd = (lo: number = 0, hi: number = 1) => {
        return rng() * (hi - lo) + lo;
    };
  
    /**
     * @returns A seeded random integer number between lo and hi (exclusive)
     */
    const rndInt = (lo?: number, hi?: number) => Math.floor(rnd(lo, hi));
  
    /**
     * Shuffle an array in place, using the Fisher-Yates algorithm
     * @param a An array to shuffle
     * @returns A reference to the input array, shuffled in place
     */
    const shuffle = <A>(a: A[]): A[] => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = rndInt(i + 1);
            const x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    };
  
    return {rnd, rndInt, shuffle};
};

export default seededRandom;