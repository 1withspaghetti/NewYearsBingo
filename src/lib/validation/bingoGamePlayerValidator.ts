import { z } from "zod";

const bingoGamePlayerSchema = z.object({
    name: z.string().max(100),
    seed: z.number().int().positive().optional(),
});

export default bingoGamePlayerSchema;