import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Rating = {
  _id: Types.ObjectId; // id of rating object
  userId: Types.ObjectId; // User who roted
  contentId: Types.ObjectId; // id of content being rated
  category: string; // category of the rating, #TODO will this be used? Should we predefine them?
}

const RatingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

const RatingModel = model<Rating>('Rating', RatingSchema);
export default RatingModel;
