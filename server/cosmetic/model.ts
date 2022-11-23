import type { Types, PopulatedDoc, Document } from 'mongoose';
import { Schema, model } from 'mongoose';


// Type definition for cosmetic on the backend
export type Cosmetic = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
};

// Mongoose schema definition for interfacing with a MongoDB table
// Cosmetics stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CosmeticSchema = new Schema({
});

const CosmeticModel = model<Cosmetic>('Cosmetic', CosmeticSchema);
export default CosmeticModel;
