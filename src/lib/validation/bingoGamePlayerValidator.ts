import { z } from "zod";

const bingoGamePlayerSchema = z.object({
    name: z.string().max(100),
    seed: z.string().max(100).optional(),
});

export default bingoGamePlayerSchema;