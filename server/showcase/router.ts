import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import ShowcaseCollection from './collection';
import * as util from './util';
import * as userValidator from '../user/middleware';
import * as showcaseValidator from '../showcase/middleware';
import * as lessonValidator from '../lesson/middleware';

const router = express.Router();
/**
 * See the README for more information on API routes
 */

/**
 * If the lessonId is given, get all the showcases associated with the lesson
 * If the userId is given, get all the showcases associated with the user id
 * If both are given, get all the showcases that match both criterion
 * If none are given, get all showcases
 * 
 * CASE 1:
 * @name GET /api/showcases
 * 
 * @return {Showcase[]} - A list of all showcases in the database
 * 
 * 
 * CASE 2:
 * @name GET /api/showcases?lessonId=id
 * 
 * @return {Showcase[]} - A list of all showcases associated with the given lesson Id in the database
 * 
 * CASE 3:
 * @name GET /api/showcases?userId=id
 * 
 * @return {Showcase[]} - A list of all showcases by the user corresponding to the id in the database
 * 
 * CASE 4:
 * @name GET /api/showcases?lessonId=id&userId=id
 * 
 * @return {Showcase[]} - A list of all showcases that match both criterion
 */
router.get(
    '/',
    [
        userValidator.isUserExists,
        lessonValidator.doesLessonQueryExist
    ],
    async (req: Request, res: Response) => {
        if (req.query.userId !== undefined) {
            // user is specified
            if (req.query.lessonId !== undefined) {
                // both user and lesson specified
                const showcases = await ShowcaseCollection.findAllByLessonAndUserId(req.query.lessonId as string, req.query.userId as string);
                res.status(200).json(showcases.map(util.constructShowcaseResponse));
                return;
            }
            const showcases = await ShowcaseCollection.findAllByUserId(req.query.userId as string);
            res.status(200).json(showcases.map(util.constructShowcaseResponse));
            return;
        } else {
            // user is not specified
            if (req.query.lessonId !== undefined) {
                const showcases = await ShowcaseCollection.findAllByLessonId(req.query.lessonId as string);
                res.status(200).json(showcases.map(util.constructShowcaseResponse));
                return;
            }
            const showcases = await ShowcaseCollection.findAll();
            res.status(200).json(showcases.map(util.constructShowcaseResponse));
            return;
        }

    }
);

/**
 * @name POST /api/showcases
 * 
 * @param lessonId - Id of the lesson to associate with the showcase
 * @param content - Content of the showcase
 * 
 * @return the newly created showcase
 */
router.post(
    '/',
    [lessonValidator.doesLessonBodyExist,
    userValidator.isCurrentSessionUserExists,
    showcaseValidator.isValidShowcaseContent],
    async (req: Request, res: Response) => {
        const showcase = await ShowcaseCollection.addOne(req.session.userId, req.body.lessonId, req.body.content);
        res.status(201).json({
            message: `Showcase created successfully`,
            showcase: util.constructShowcaseResponse(showcase)
        });
    }
);

/**
 * @name DELETE /api/showcases/:showcaseId?
 * 
 * @param showcaseId - Id of the showcase to delete
 * 
 * @return a success message
 */
router.delete(
    '/:showcaseId?',
    [showcaseValidator.doesShowcaseExist, userValidator.isCurrentSessionUserExists, showcaseValidator.isValidShowcaseModifier],
    async (req: Request, res: Response) => {
        const showcase = await ShowcaseCollection.deleteOne(req.params.showcaseId);
        res.status(200).json({
            message: "Showcase delete successfully."
        });
    }
);

/**
 * @name PUT /api/showcases/:showcaseId?
 * 
 * @param showcaseId - Id of the showcase to update
 * @param content - new content of the showcase
 * 
 * @return the updated user
 */
router.put(
    '/:showcaseId?',
    [showcaseValidator.doesShowcaseExist, userValidator.isCurrentSessionUserExists, showcaseValidator.isValidShowcaseModifier, showcaseValidator.isValidShowcaseContent],
    async (req: Request, res: Response) => {
        const showcase = await ShowcaseCollection.updateOne(req.params.showcaseId, req.body.content);
        res.status(200).json({
            message: "Showcase updated successfully.",
            showcase: util.constructShowcaseResponse(showcase)
        });
    }
);

export { router as showcaseRouter };