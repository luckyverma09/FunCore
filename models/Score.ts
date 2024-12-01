import mongoose from 'mongoose';

export interface IScore extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  game: mongoose.Types.ObjectId;
  score: number;
  createdAt: Date;
}

const ScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Score || mongoose.model<IScore>('Score', ScoreSchema);
