import { string } from "zod";

/**
 * Regex for validating string mongodb ObjectIDs
 */
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

/**
 * Validation schema for mongodb ObjectIDs
 */
export const idValidator = string().regex(OBJECT_ID_REGEX, 'Invalid ID');
