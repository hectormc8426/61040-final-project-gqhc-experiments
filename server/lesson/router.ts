import { application, NextFunction, Request, Response } from 'express';
import express from 'express';
import LessonCollection from './collection';
import * as LessonValidator from './middleware';
import * as UserValidator from '../user/middleware';
import * as util from './util';
import ShowcaseCollection from '../showcase/collection';
import RatingCollection from "../rating/collection";
import TagCollection from "../tag/collection";
import CommentCollection from "../comment/collection";

const router = express.Router();

/**
 * If the userId is given, get all the lessons by the corresponding user.
 * If the userId is not given, get all the lessons in the platform.
 * 
 * CASE 1:
 * @name GET /api/lessons
 * 
 * @return {Lesson[]} - A list of all lessons in the database
 * 
 * 
 * CASE 2:
 * @name GET /api/lessons?userId=id
 * 
 * @return {Lesson[]} - A list of all lessons by the user corresponding to the given userId in the database
 * 
 * CASE 3:
 * @name GET /api/lessons?lessonId=id
 * 
 * @return {Lesson} - The lesson corresponding to the given lessonId in the database
 */
router.get(
    '/',
    // TODO: add appropriate middlewares
    [

    ],
    async (req: Request, res: Response) => {
        if (req.query.userId !== undefined) {
            // then a user is specified so return their lessons only
            const userLessons = await LessonCollection.findAllByUserId(req.query.userId as string);
            res.status(200).json(userLessons.map(util.constructLessonResponse));
        }
        else if (req.query.lessonId !== undefined) {
            const lesson = await LessonCollection.findOne(req.query.lessonId as string);
            res.status(200).json(util.constructLessonResponse(lesson));
        }
        else {
            // then the user is not specified so return all lessons on the platform! (need to be fixed later for performance)
            const lessons = await LessonCollection.findAll();
            // res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lessons.map(util.constructLessonResponse));
        }
    }
);

router.get(
    '/recent',
    // TODO: add appropriate middlewares
    [

    ],
    async (req: Request, res: Response) => {
        const lessons = await LessonCollection.findRecentLessons();
        res.status(200).json(lessons.map(util.constructLessonResponse));
    }
);

router.get(
    '/search/:name',
    // TODO: add appropriate middlewares
    [

    ],
    async (req: Request, res: Response) => {
        const lessons = await LessonCollection.findLessonsByName(req.params.name);
        res.status(200).json(lessons.map(util.constructLessonResponse));
    }
);

/**
 * Create a new lesson.
 * 
 * @name POST /api/lessons
 * @param {string} title - The title of the new lesson
 * @param {[LessonChunk]} content - The content of the new lesson
 * @return {Lesson} - The created lesson
 */
router.post(
    '/',
    [
        UserValidator.isUserLoggedIn,
        UserValidator.isCurrentSessionUserExists,
        LessonValidator.isContentValid,
        LessonValidator.isTitleValid
    ],
    // TODO: add appropriate middlewares
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const title = req.body.title;
        const content = req.body.content;
        const originalText = req.body.originalText;
        const lesson = await LessonCollection.addOne(userId, title, content, originalText);
        res.status(201).json({
            message: "Your lesson was created successfully.",
            lesson: util.constructLessonResponse(lesson)
        });
    }
);

/**
 * Delete a lesson.
 * 
 * @name DELETE /api/lessons/:lessonId
 * @return {string} - A success message
 */
router.delete(
    '/:lessonId',
    [
        UserValidator.isUserLoggedIn,
        UserValidator.isCurrentSessionUserExists,
        // // LessonValidator.isUserAuthorizedToEdit,
        LessonValidator.isExistingPost,
    ],
    // TODO: add appropriate middlewares
    async (req: Request, res: Response) => {
        await LessonCollection.deleteOne(req.params.lessonId);
        await ShowcaseCollection.deleteByLessonId(req.params.lessonId);
        await RatingCollection.deleteManyByContentId(req.params.lessonId);
        await TagCollection.deleteManyByContentId(req.params.lessonId);
        await CommentCollection.deleteManyLesson(req.params.lessonId);

        res.status(200).json({
            message: 'Your lesson was deleted successfully.'
        });
    }
);

/**
 * Modify a lesson.
 * 
 * @name PUT /api/lessons/:lessonId
 * @param {string} title - The title of the new lesson
 * @param {[LessonChunk]} content - The content of the new lesson
 * @return {Lesson} - The edited lesson
 */
router.put(
    '/:lessonId',
    [
        UserValidator.isUserLoggedIn,
        UserValidator.isCurrentSessionUserExists,
        LessonValidator.isUserAuthorizedToEdit,
    ],
    // TODO: add appropriate middlewares
    async (req: Request, res: Response) => {
        const lesson = await LessonCollection.updateOne(req.params.lessonId, req.body.title, req.body.content, req.body.originalText);
        res.status(200).json({
            message: 'Your lesson was updated successfully.',
            lesson: util.constructLessonResponse(lesson)
        });
    }
)


export { router as lessonRouter }