import type { Types, PopulatedDoc, Document } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';
import type { Lesson } from '../lesson/model';

// Type definition for Comment on the backend
export type Comment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  parentLessonId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

export type PopulatedComment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  parentLessonId: Lesson;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

const CommentSchema = new Schema<Comment>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  parentLessonId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Lesson'
  },
  // The date the comment was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the comment
  content: {
    type: String,
    required: true
  },
  // The date the comment was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
