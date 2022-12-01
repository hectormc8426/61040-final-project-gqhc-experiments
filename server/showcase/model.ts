import type { Types, PopulatedDoc, Document } from 'mongoose';
import { Schema, model } from 'mongoose';

export type Showcase = {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    dateCreated: Date;
    dateModified: Date;
    title: string;
    content: string;
};


// mongoose schema definition for Showcase
const ShowcaseSchema = new Schema<Showcase>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
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
        type: String,
        required: true
    }
})

const ShowcaseModel = model<Showcase>('Showcase', ShowcaseSchema);
export default ShowcaseModel;