import type { Types, Document } from 'mongoose';
import { Schema, model } from 'mongoose';

export type Tag = {
  _id: Types.ObjectId; // id of tag object
  contentId: Types.ObjectId; // id of content being tagged
  tagname: string; // name of the tag, like I tagged 'western' on this lesson
}

const TagSchema = new Schema({
  contentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Lesson"
  },
  tagname: {
    type: String,
    required: true
  }
})

const TagModel = model<Tag>('Tag', TagSchema);
export default TagModel;
