import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Rating} from './model';
import {Types} from "mongoose";

type RatingResponse = {
  _id: string;
  aliasId: string;
  contentId: string;
  category: string;
  score: number;
};

const constructRatingResponse = (rating: HydratedDocument<Rating>): RatingResponse => {
  const ratingCopy: Rating = {
    ...rating.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...ratingCopy,
    _id: ratingCopy._id.toString(),
    aliasId: ratingCopy.userId.toString(),
    contentId: ratingCopy.contentId.toString()
  };
};

export {
  constructRatingResponse
};
