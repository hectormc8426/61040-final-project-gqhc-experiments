import type { Types, PopulatedDoc, Document } from 'mongoose';
import { Schema, model } from 'mongoose';


// Type definition for cosmetic on the backend
export type Cosmetic = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    name: string;
    filepath: string;
    cosmeticType: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Cosmetics stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CosmeticSchema = new Schema({
    // name of cosmetic 
    name: {
        types: String,
        required: true
    },
    // filepath to the cosmetic file
    filepath: {
        types: String,
        required: true
    },
    // type of cosmetic (profile, banner, background)
    cosmeticType: {
        type: String,
        required: true
    }
});

const CosmeticModel = model<Cosmetic>('Cosmetic', CosmeticSchema);
export default CosmeticModel;
