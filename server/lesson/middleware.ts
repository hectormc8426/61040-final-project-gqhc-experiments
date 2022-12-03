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
    if (!req.body.postId) {
        res.status(400).json({
            error: 'Cannot query when the post id is not provided.'
        });
        return;
    }

    const post = await LessonCollection.findOne(req.body.postId);

    if (post === null) { // then the post does not exist in the database -> let the caller know
        res.status(400).json({
            error: 'Cannot perform operations on a nonexisting post.'
        });
        return;
    }

    next();
};

const isNonexistingPost = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.postId) {
        res.status(400).json({
            error: 'Cannot query when the post id is not provided.'
        });
        return;
    }

    const post = await LessonCollection.findOne(req.body.postId);

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

    const post = await LessonCollection.findOne(req.body.postId);

    if (post.userId !== req.session.userId) { // then the post does exist in the database -> let the caller know
        res.status(400).json({
            error: 'Cannot edit the post if the user is not its author.'
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
    isNonexistingPost
};

