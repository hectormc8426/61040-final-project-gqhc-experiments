import type { Request, Response, NextFunction } from 'express';
import UserCollection from '../user/collection';
import LessonCollection from './collection';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isTitleValid = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.title.trim() === "") {
        res.status(400).json({
            error: 'Lesson without a title is not allowed.'
        });
        return;

    }

    next();
};

const isContentValid = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.content.length === 0 || req.body.content[0].content === "") {
        res.status(400).json({
            error: 'Lesson with no content is not allowed.'
        });
        return;

    }

    next();
};

const isExistingPost = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.lessonId) {
        res.status(400).json({
            error: 'Cannot query when the post id is not provided.'
        });
        return;
    }

    const post = await LessonCollection.findOne(req.params.lessonId);

    if (post === null) { // then the post does not exist in the database -> let the caller know
        res.status(400).json({
            error: 'Cannot perform operations on a nonexisting post.'
        });
        return;
    }

    next();
};

const isNonexistingPost = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.lessonId) {
        res.status(400).json({
            error: 'Cannot query when the post id is not provided.'
        });
        return;
    }

    const post = await LessonCollection.findOne(req.params.lessonId);

    if (post !== null) { // then the post does exist in the database -> let the caller know
        res.status(400).json({
            error: 'Such post exists already.'
        });
        return;
    }

    next();
};

const isUserAuthorizedToEdit = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        res.status(400).json({
            error: 'Cannot edit when the userId is not provided.'
        });
        return;
    }

    const post = await LessonCollection.findOne(req.body.lessonId);
    // hacky
    if (String(post.userId._id) !== String(req.session.userId)) { // then the post does exist in the database -> let the caller know
        res.status(400).json({
            error: 'Cannot edit the post if the user is not its author.'
        });
        return;
    }

    next();
};

/**
 * Checks if the lessonId given in the body of the request exists
 */
const doesLessonBodyExist = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.lessonId) {
        res.status(400).json({
            error: 'Cannnot query when the lesson id is not provided.'
        });
        return;
    }

    const lesson = await LessonCollection.findOne(req.body.lessonId);

    if (lesson === null) { // then the lesson does exist in the database -> let the caller know
        res.status(404).json({
            error: 'This lesson does not exist'
        });
        return;
    }

    next();
};

/**
 * Checks if the lessonId given in the query of the request exists
 *
 * Only used for showcase querying right now, so there doesn't have to actually a field in
 * req.query for it to still pass.
 */
const doesLessonQueryExist = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.lessonId) {
        next(); // no errors if not there
        return;
    }
    const lesson = await LessonCollection.findOne(req.query.lessonId as string);

    if (lesson === null) { // then the lesson does exist in the database -> let the caller know
        res.status(404).json({
            error: 'This lesson does not exist'
        });
        return;
    }

    next();
};

/**
 * Checks if .../:lessonId is a valid ID that exists in the Database
 */
const doesLessonParamExist = async (req: Request, res: Response, next: NextFunction) => {
    const lesson = await LessonCollection.findOne(req.params.contentId);

    if (lesson === null) { // then the lesson does exist in the database -> let the caller know
        res.status(404).json({
            error: 'This lesson does not exist'
        });
        return;
    }

    next();
};

export {
    isTitleValid,
    isContentValid,
    isExistingPost,
    isUserAuthorizedToEdit,
    isNonexistingPost,
    doesLessonBodyExist,
    doesLessonQueryExist,
    doesLessonParamExist
};

