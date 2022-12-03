import type { Types, PopulatedDoc, Document } from 'mongoose';
import { Schema, model } from 'mongoose';
import { Lesson } from 'server/lesson/model';
import { User } from 'server/user/model';

export type Showcase = {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    lessonId: Types.ObjectId;
    dateCreated: Date;
    dateModified: Date;
    content: string;
};

export type PopulatedShowcase = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: User;
    lessonId: Lesson,
    dateCreated: Date;
    content: string;
    dateModified: Date;
};

// mongoose schema definition for Showcase
const ShowcaseSchema = new Schema<Showcase>({
    // user Id associated with the showcase
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // lesson associated with the showcase
    lessonId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Lesson'
    },
    dateCreated: {
        type: Date,
        required: true
    },
    dateModified: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const ShowcaseModel = model<Showcase>('Showcase', ShowcaseSchema);
export default ShowcaseModel;