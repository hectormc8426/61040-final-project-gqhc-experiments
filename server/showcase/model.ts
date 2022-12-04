import type { Types, PopulatedDoc, Document } from 'mongoose';
import { Schema, model } from 'mongoose';
import { Lesson } from 'server/lesson/model';
import { User } from 'server/user/model';

export type ShowcaseChunk = {
    contentType: String, // type of content; e.g., text, image, video -> this will tell us where to look for this chunk of lesson
    content: String; // objectId to query in text/image/video collection from above
};


export type Showcase = {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    lessonId: Types.ObjectId;
    dateCreated: Date;
    dateModified: Date;
    content: Array<ShowcaseChunk>;
};

export type PopulatedShowcase = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: User;
    lessonId: Lesson,
    dateCreated: Date;
    dateModified: Date;
    content: Array<ShowcaseChunk>;
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
        type: [{ contentType: String, content: String }],
        required: true
    }
})

const ShowcaseModel = model<Showcase>('Showcase', ShowcaseSchema);
export default ShowcaseModel;