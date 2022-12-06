import { Types, PopulatedDoc, Document } from 'mongoose';
import { Schema, model } from 'mongoose';
import { User } from 'server/user/model';

export type LessonChunk = {
    contentType: String, // type of content; e.g., text, image, video -> this will tell us where to look for this chunk of lesson
    content: String; // objectId to query in text/image/video collection from above
};

export type Lesson = {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    dateCreated: Date;
    dateModified: Date;
    title: string;
    content: Array<LessonChunk>;
    originalText: string;
};

export type PopulatedLesson = {
    _id: Types.ObjectId;
    userId: User;
    dateCreated: Date;
    dateModified: Date;
    title: string;
    content: Array<LessonChunk>;
    originalText: string;
};

// mongoose schema definition for Lesson
const LessonSchema = new Schema<Lesson>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dateCreated: {
        type: Date,
        required: true
    },
    dateModified: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: [{ contentType: String, content: String }],
        required: true
    },
    originalText: {
        type: String,
        required: false
    }
})

const LessonModel = model<Lesson>('Lesson', LessonSchema);
export default LessonModel;