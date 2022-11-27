import type {Request, Response} from 'express';
import express from 'express';

import RatingCollection from "./collection";

import * as UserValidator from '../user/middleware';

const router = express.Router();

/**
 * Create a Rating entry in the database
 *
 * @name POST /api/rating/:contentId
 *
 * @param contentId - ID of content
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
    UserValidator.isUserLoggedIn,  // 403
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const contentId = req.params.contentId;
    const category = req.body.category;
    const score = req.body.score;
    const rating = await RatingCollection.addOne(userId, contentId, category, score);

    res.status(201).json({
      message: 'You have successfully rated the content',
      rating // TODO util.
    });
  }
);

/**
 * Update user's rating with new rating
 *
 * @param contentId - id of content
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
    UserValidator.isUserLoggedIn, // 403
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const contentId = req.params.contentId;
    const category = req.body.category;
    const score = req.body.score;
    const rating = await RatingCollection.updateOne(userId, contentId, category, score);

    res.status(200).json({
      message: 'You have successfully updated rating',
      rating
    });
  }
);

/**
 * Get an aggregation of all ratings on content
 *
 * @param contentId - id of content
 * @return {} - json mapping category to aggregate score
 *
 * @throws {404} Content does not exist
 */
router.get(
  '/:contentId?',
  [

  ],
  async (req: Request, res: Response) => {
    // TODO
  }
);

/**
 * Delete a user's rating on content
 *
 * @param contentId - id of content
 *
 * @throws {403} - User is not logged in
 * @throws {404} - Content does not exist
 * @throws {404} - User has not rated content
 */
router.delete(
  '/:contentId?',
  [
    UserValidator.isUserLoggedIn, // 403
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    const contentId = req.params.contentId;
    await RatingCollection.deleteManyByUserIdAndContentId(userId, contentId);

    res.status(200).json({
      message: 'User has undone all ratings on content'
    });
  }
);
