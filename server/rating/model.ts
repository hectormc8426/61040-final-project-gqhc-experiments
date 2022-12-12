import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Rating = {
  _id: Types.ObjectId; // id of rating object
  userId: string; // User who roted
  contentId: string; // id of content being rated
  ratings: { [key: string]: number}
}

const RatingSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  contentId: {
    type: String,
    required: true
  },
  ratings: {
    type: Object,
    of: String,
    required: true
  }
  // category: {
  //   type: String,
  //   required: true
  // },
  // score: {
  //   type: Number,
  //   required: true
  // }
})

const RatingModel = model<Rating>('Rating', RatingSchema);
export default RatingModel;
