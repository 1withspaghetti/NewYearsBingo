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
const seededRandom = (seed: number) => {
    let rng = mulberry32(seed);
  
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