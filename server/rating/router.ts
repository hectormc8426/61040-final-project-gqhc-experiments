import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import RatingCollection from "./collection";
import { constructRatingResponse } from './util'

import * as UserValidator from '../user/middleware';
import * as RatingValidator from './middleware';
import * as LessonValidator from '../lesson/middleware';
import LessonCollection from "../lesson/collection";
import Categories from './categories';

const router = express.Router();

/**
 * Create a Rating entry in the database
 *
 * @name POST /api/rating/:contentId
 *
 * @sessionParam userId - ID of user rating
 * @pathParam contentId - ID of content being rated
 * @queryParam category - Category of content to rate
 * @bodyParam score - Score to rate content's category
 *
 * @return {} - The created Rating
 *
 * @throws {400} - Score not in range [0, 100]
 * @throws {400} - Category not valid
 * @throws {403} - User is not logged in
 * @throws {404} Content does not exist
 * @throws {409} User has already rated content
 */
router.post(
  '/:contentId?',
  [
    RatingValidator.isValidScore, // 400
    RatingValidator.isValidCategory, // 400
    UserValidator.isUserLoggedIn,  // 403
    //LessonValidator.doesLessonParamExist,  // 404
    RatingValidator.hasUserNotRatedContent // 409
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const contentId = req.params.contentId;
    const category = (req.query.category as string) ?? '';
    const score = req.body.score;

    const rating = await RatingCollection.addOne(userId, contentId, category, score);

    res.status(201).json({
      message: 'You have successfully rated the content',
      rating: constructRatingResponse(rating)
    });
  }
);

/**
 * Update user's rating with new rating
 *
 * @name PATCH /api/rating/:contentId?:category
 *
 * @sessionParam userId - ID of user rating
 * @pathParam contentId - ID of content being rated
 * @queryParam category - Category of content to rate
 * @bodyParam score - Score to rate content's category
 *
 * @return {} - The created Rating
 *
 * @throws {400} - Score not in range [0, 100]
 * @throws {400} - Category not valid
 * @throws {403} - User is not logged in
 * @throws {404} Content does not exist
 * @throws {409} User has not rated content
 */
router.patch(
  '/:contentId?',
  [
    RatingValidator.isValidScore, // 400
    RatingValidator.isValidCategory, // 400
    UserValidator.isUserLoggedIn,  // 403
    //LessonValidator.doesLessonParamExist, // 404
    RatingValidator.hasUserRatedContent // 409
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const contentId = req.params.contentId;
    const category = (req.query.category as string) ?? '';
    const score = req.body.score;
    const rating = await RatingCollection.updateOne(userId, contentId, category, score);

    res.status(200).json({
      message: 'You have successfully updated rating',
      rating: constructRatingResponse(rating)
    });
  }
);

/**
 * Get an object mapping category -> score
 * This object is rating of content per category
 *
 * @name GET /api/rating/:contentId
 *
 * @pathParam contentId - ID of content being rated
 * @queryParam category - Category of content to rate
 *
 * @return {} - net rating number, averaging all categories
 *
 * @throws {404} Content does not exist
 */
router.get(
  '/:contentId?',
  [
    //LessonValidator.doesLessonParamExist, // 404
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // if category specified
    if (req.query.category !== undefined) {
      next();
      return;
    }

    // find
    const contentId = req.params.contentId;
    const all_rating_obj = await RatingCollection.findAllByContentId(contentId);

    const ratings: { [key: string]: number} = {};

    // get net score for each category
    for (let category in Categories) {
      let net_score = 0;
      let num_ratings = 0;

      for (const rating of all_rating_obj) {
        if (!(category in rating.ratings)) continue;  // if this rating does not rate category
        // @ts-ignore
        net_score += (rating.ratings.get(category) as number) ?? 0;  // guaranteed to be number
        num_ratings++;
      }
      let net = 0;
      if (num_ratings !== 0) {net = net/num_ratings}
      ratings[category] = net;
    }

    // return
    res.status(200).json({
      message: `Successfully compiled net score for each category for contentId=[${contentId}]`,
      ratings
    });
  },
/**
 * Receive a singular number
 *
 * @name GET /api/rating/:contentId?:category
 *
 * @pathParam contentId - ID of content being rated
 * @queryParam category - Category of content to rate
 *
 * @return {} - rating of that specific category
 *
 * @throws {400} Invalid Category
 */
  [
    RatingValidator.isValidCategory
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.useUserId !== undefined) {
      next();
      return;
    }

    // find
    const contentId = req.params.contentId;
    const rating_array = await RatingCollection.findAllByContentId(contentId);

    // aggregate
    const category = req.query.category as string;
    let net_score = 0;
    let num_ratings = 0;

    for (let rating of rating_array) {
      if (!(category in rating.ratings)) continue;  // if this rating does not rate category
      net_score += rating.ratings[category];
      num_ratings++;
    }

    // average
    let score = net_score;
    if (num_ratings > 0) {score = score/num_ratings}

    // return
    res.status(200).json({
      message: `contentId=[${contentId}] has score=[${score}] in category=[${category}]`,
      score
    });
  },
/**
 * Get a singular rating of a user of content on a specific category
 *
 * @name GET /api/rating/:contentId?:category:useUserId
 *
 * @pathParam contentId - ID of content being rated
 * @queryParam category - Category of content to rate
 * @queryParam useUserId - user
 *
 * @return {} - rating of that specific category
 *
 * @throws {400} Invalid Category
 */
  [
    UserValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    // find
    const contentId = req.params.contentId;
    const userId = req.session.userId;
    const category = (req.query.category as string) ?? '';
    const rating = await RatingCollection.findOne(userId, contentId);
    let score = -1;
    // if exists, replace
    console.log(rating.ratings)
    if (rating !== null && category in rating.ratings) {score = rating.ratings[category]}

    // return
    res.status(200).json({
      message: `Retrieved userId=[${userId}] rating on contentId=[${contentId}] in category=[${category}] with score=[${score}]`,
      score
    });
  },
);

/**
 * Delete all user's rating on content
 *
 * @name DELETE /api/rating/:contentId
 *
 * @sessionParam userId - ID of user rating
 * @pathParam contentId - ID of content being rated
 *
 * @throws {403} - User is not logged in
 * @throws {404} - Content does not exist
 * @throws {409} - User has not rated content
 */
router.delete(
  '/:contentId?',
  [
    UserValidator.isUserLoggedIn,  // 403
    //LessonValidator.doesLessonParamExist, // 404
    RatingValidator.hasUserRatedContent // 409
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // if category, do that instead
    if (req.query.category !== undefined) {
      next();
      return;
    }

    const userId = req.session.userId;
    const contentId = req.params.contentId;
    await RatingCollection.deleteOne(userId, contentId);

    res.status(200).json({
      message: 'User has undone all ratings on content'
    });
  },
/**
 * Delete a user's specific rating of content on category
 *
 * @name DELETE /api/rating/:contentId?:category
 *
 * @sessionParam userId - ID of user rating
 * @pathParam contentId - ID of content being rated
 * @queryParam category - Category of content to rate
 *
 * @throws {400} - Invalid Category
 * @throws {403} - User is not logged in
 * @throws {404} - Content does not exist
 * @throws {404} - User has not rated content
 */
  [
    RatingValidator.isValidCategory, // 400
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const contentId = req.params.contentId;
    const category = (req.query.category as string) ?? '';
    await RatingCollection.removeRatingOnCategory(userId, contentId, category);

    res.status(200).json({
      message: `User has deleted rating of ${contentId} on category ${category}`
    });
  }
)

export { router as ratingRouter };
