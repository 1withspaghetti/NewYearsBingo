import mongoose, { Types } from "mongoose";
import { BingoPlayer } from "./bingoPlayerModel";

const bingoGameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    center: { type: String },
    items: { type: [String], required: true },
    players: [{ type: Types.ObjectId, ref: BingoPlayer.modelName }],
}, {
    virtuals: {
        url: {
            get: function() {
                return `/game/${this.id}`;
            }
        }
    }
});

export const BingoGame = mongoose.model("BingoGame", bingoGameSchema);