import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import Immutable from 'immutable'; // do 'npm install immutable'

// When creating quests, make sure the new quest appears both in 'questNames' and 'questList'

// Immutable set keeping track of the names of all of the existing quests. Exists as a set for quick look up time.
export const questNames: Immutable.Set<string> =
    Immutable.Set(["doOneShowcase", "commentOne", "rateOne",
        "createOneLesson", "createLessons", "createShowcases", "login"]);

export type Quest = {
    name: string;
    desc: string;
    currentProgress: number;
    goalProgress: number;
    reward: number;
    repeatAmount: number;
};

// serves as the starting values for quest. When creating new quests for a user, those quests should be initialized to these values.
export const questList: Immutable.Map<string, [string, number, number, number, number]> =
    Immutable.Map([["doOneShowcase", ["Complete a showcase", 0, 1, 100, 0]],
    ["commentOne", ["Comment on a lesson", 0, 1, 50, 0]],
    ["rateOne", ["Rate a lesson", 0, 1, 50, 0]],
    ["createOneLesson", ["Create a lesson", 0, 1, 300, 0]],
    ["createLessons", ["Create lessons (REPEATING) 🔄", 0, 3, 250, 3]],
    ["createShowcases", ["Create showcases (REPEATING) 🔄", 0, 3, 300, 3]],
    ["login", ["Login for the day (REPEATING) 🔄", 0, 2, 20, 1]],]);

// Type definition for User on the backend
export type User = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    username: string;
    password: string;
    dateJoined: Date;
    experiencePoints: number;
    quests: Map<string, Quest>;
    //Map of quests names to Objects containing fields for 'name', 'currentProgress', 'goalProgress', and 'reward'
    //currentProgress is how much a quest has been completed towards the goalProgress. Quest is completed
    //and user receives reward when currentProgress >= goalProgress.
};

// Type definition for populated User (with cosmetic fields populated)
export type PopulatedUser = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    username: string;
    password: string;
    dateJoined: Date;
    experiencePoints: number;
    quests: Map<string, Quest>
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
    quests: {
        type: Map,
        required: true
    }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
