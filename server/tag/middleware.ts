import type {NextFunction, Request, Response} from "express";
import {Expression, Types} from 'mongoose';
import TagCollection from "./collection";

const doesTagExist = async (req: Request, res: Response, next: NextFunction) => {
  const contentId = req.params.contentId;
  const tagname = req.body.tagname;
  const tag = await TagCollection.findOne(contentId, tagname);

  if (!tag) {
    res.status(409).json({
      error: {
        tagDoesNotExist: `This tag with id: ${contentId} and tagname ${tagname} does not exist`
      }
    });
    return;
  }

  next();
};

const doesTagNotExist = async (req:Request, res: Response, next: NextFunction) => {
  const contentId = req.params.contentId;
  const tagname = req.body.tagname;
  const tag = await TagCollection.findOne(contentId, tagname);

  if (tag) {
    res.status(409).json({
      error: {
        tagExists: `This tag with id: ${contentId} and tagname ${tagname} already exists`
      }
    });
    return;
  }

  next();
};

export {
  doesTagExist,
  doesTagNotExist
};
