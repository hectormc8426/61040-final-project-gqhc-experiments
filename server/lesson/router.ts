import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import LessonCollection from './collection';

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
 */
router.get(
    '/',
    // TODO: add appropriate middlewares
    async (req: Request, res: Response) => {
        if (req.query.userId !== undefined) {
            // then a user is specified so return their lessons only
            const userLessons = await LessonCollection.findAllByUserId(req.query.userId as string);
            res.status(200).json(userLessons);
        } else {
            // then the user is not specified so return all lessons on the platform! (need to be fixed later for performance)
            const lessons = await LessonCollection.findAll();
            res.status(200).json(lessons);
        }
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
    // TODO: add appropriate middlewares
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const title = req.body.title;
        const content = req.body.content;
        const lesson = await LessonCollection.addOne(userId, title, content);
        res.status(201).json({
            message: "Your lesson was created successfully.",
            lesson: lesson
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
    // TODO: add appropriate middlewares
    async (req: Request, res: Response) => {
        await LessonCollection.deleteOne(req.params.lessonId);
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
    // TODO: add appropriate middlewares
    async (req: Request, res: Response) => {
        const lesson = await LessonCollection.updateOne(req.params.freetId, req.body.title, req.body.content);
        res.status(200).json({
            message: 'Your lesson was updated successfully.',
            lesson: lesson
        });
    }
)

export { router as lessonRouter }