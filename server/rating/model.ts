import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

enum Categories {
  Clarity = 'Clarity',
  Accuracy = 'Accuracy',
  Engaging = 'Engaging'
}

export type Rating = {
  _id: Types.ObjectId; // id of rating object
  userId: string; // User who roted
  contentId: string; // id of content being rated
  category: string; // category of the rating, #TODO will this be used? Should we predefine them?
  score: number;
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
  category: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
})

const RatingModel = model<Rating>('Rating', RatingSchema);
export default RatingModel;
