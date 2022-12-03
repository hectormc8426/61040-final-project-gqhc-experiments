import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';


// Type definition for User on the backend
export type User = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    username: string;
    password: string;
    dateJoined: Date;
    experiencePoints: number;
};

// Type definition for populated User (with cosmetic fields populated)
export type PopulatedUser = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    username: string;
    password: string;
    dateJoined: Date;
    experiencePoints: number;
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
    experiencePoints: {
        type: Number,
        required: true
    },
    // All cosmetics that the user owns
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
