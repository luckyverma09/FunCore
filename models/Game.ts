import mongoose from 'mongoose';

export interface IGame extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);