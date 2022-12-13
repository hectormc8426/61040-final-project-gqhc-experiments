import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import RatingCollection from "./collection";
import { constructRatingResponse } from './util'

import * as UserValidator from '../user/middleware';
import * as RatingValidator from './middleware';
import * as LessonValidator from '../lesson/middleware';
import LessonCollection from "../lesson/collection";
import Categories from "./categories";

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
 * Get an aggregation of all ratings on content
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
    const ratingsQuery = await RatingCollection.findAllByContentId(contentId);

    const ratings: { [key: string]: number } = {};
    for (let category in Categories) {
      ratings[category] = 0;
      let num = 0;
      for (let rating of ratingsQuery) {
        if (rating.category === category) {
          ratings[category] += rating.score;
          num++;
        }
      }

      if (num !== 0) { ratings[category] = ratings[category] / num}
    }

    // return
    res.status(200).json({
      message: `Successfully retrieved full net score for each category for contentId=[${contentId}]`,
      ratings
    });
  },
/**
 * Get rating of a specific category
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
    const category = (req.query.category as string) ?? '';
    const scores = await RatingCollection.findAllByContentIdAndCategory(contentId, category);

    // average
    let net = 0;
    for (let i = 0; i < scores.length; i++) {
      net += scores[i].score;
    }

    if (scores.length > 0) {
      net = net / scores.length
    }

    // return
    res.status(200).json({
      message: `Successfully retrieved full score for contentId=[${contentId}] in category=[${category}] with score=[${net}]`,
      score: net
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
    const rating = await RatingCollection.findOne(userId, contentId, category);
    const score = (rating === null) ? -1 : rating.score;

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
    await RatingCollection.deleteManyByUserIdAndContentId(userId, contentId);

    res.status(200).json({
      message: 'User has undone all ratings on content'
    });
  },
  [
    RatingValidator.isValidCategory, // 400
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const contentId = req.params.contentId;
    const category = (req.query.category as string) ?? '';
    await RatingCollection.deleteOne(userId, contentId, category);

    res.status(200).json({
      message: `User has deleted rating of ${contentId} on category ${category}`
    });
  }
)

export { router as ratingRouter };
