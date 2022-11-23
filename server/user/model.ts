import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import { Cosmetic } from 'server/cosmetic/model';


// Type definition for User on the backend
export type User = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    username: string;
    password: string;
    dateJoined: Date;
    musicCoins: number;
    profileCosmeticId: Types.ObjectId;
    backgroundCosmeticId: Types.ObjectId;
    bannerCosmeticId: Types.ObjectId;
    allCosmetics: Types.ObjectId[];
};

// Type definition for populated User (with cosmetic fields populated)
export type PopulatedUser = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    username: string;
    password: string;
    dateJoined: Date;
    musicCoins: number;
    profileCosmeticId: Cosmetic;
    backgroundCosmeticId: Cosmetic;
    bannerCosmeticId: Cosmetic;
    allCosmetics: Cosmetic[];
}

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
    // The user's username
    username: {
        type: String,
        required: true
    },
    // The user's password
    password: {
        type: String,
        required: true
    },
    // The date the user joined
    dateJoined: {
        type: Date,
        required: true
    },
    // The amount of Music Coins the user has
    musicCoins: {
        type: Number,
        required: true
    },
    // All cosmetics that the user owns
    allCosmetics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Cosmetic' }],
        required: true
    },
    // The following fields aren't required in order to allow reference population while also allowing
    // users to not have these cosmetics set

    // The id of the user's selected profile cosmetic 
    profileCosmeticId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Cosmetic'
    },
    // The id of the user's selected background cosmetic 
    backgroundCosmeticId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Cosmetic'
    },
    // The id of the user's selected banner cosmetic 
    bannerCosmeticId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Cosmetic'
    }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
