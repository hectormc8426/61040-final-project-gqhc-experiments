import type { Request, Response, NextFunction } from 'express';
import ShowcaseCollection from './collection';
import { ShowcaseChunk } from './model';

/**
 * Checks if the showcase given in the req params exists 
 */
const doesShowcaseExist = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.showcaseId) {
        res.status(400).json({
            error: 'Provided showcase Id must be nonempty.'
        });
        return;
    }

    const showcase = await ShowcaseCollection.findOne(req.params.showcaseId as string);
    if (!showcase) {
        res.status(404).json({
            error: `A showcase with id ${req.params.showcaseId as string} does not exist.`
        });
        return;
    }

    next();
};

/**
 * Checks if the content of the showcase in req.body is valid, i.e not a stream of empty
 * spaces
 */
const isValidShowcaseContent = (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body as { content: Array<ShowcaseChunk> };
    if (content.length === 0) {
        res.status(400).json({
            error: 'Showcase content must be at least one character long.'
        });
        return;
    }
    next();
};

/**
 * Checks if the current user is the author of the showcase whose showcaseId is in req.params
 */
const isValidShowcaseModifier = async (req: Request, res: Response, next: NextFunction) => {
    const showcase = await ShowcaseCollection.findOne(req.params.showcaseId);
    const userId = showcase.userId._id;
    if (req.session.userId !== userId.toString()) {
        res.status(403).json({
            error: 'Cannot modify other users\' showcases.'
        });
        return;
    }

    next();
};

export {
    doesShowcaseExist, isValidShowcaseContent, isValidShowcaseModifier
};