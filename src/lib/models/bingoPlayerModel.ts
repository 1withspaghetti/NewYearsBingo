import mongoose from "mongoose";

const bingoPlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    seed: { type: String, required: true },
});

export const BingoPlayer = mongoose.model("BingoPlayer", bingoPlayerSchema);