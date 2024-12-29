import { z } from 'zod';

export const itemNameValidator = z.string().max(100);

/**
 * Does not enforce the 24 or 25 item rule
 */
export const bingoGameSettingsValidatorLax = z.object({
    title: z.string().max(100).default('Bingo Game'),
    center: itemNameValidator.optional(),
    items: z.array(itemNameValidator),
})

export default bingoGameSettingsValidatorLax.refine((data) => {
    return data.items.length >= (data.center === undefined ? 25 : 24);
}, {
    message: 'There must be enough items in the list to fill the board (24 or 25)',
    path: ['items'],
});