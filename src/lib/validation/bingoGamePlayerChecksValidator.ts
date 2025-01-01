import { z } from "zod";

const bingoGamePlayerChecksValidator = z.object({
    checks: z.array(z.number().min(0).max(24)).max(25),
});

export default bingoGamePlayerChecksValidator;