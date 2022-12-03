import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Tag} from './model';
import {Types} from "mongoose";

type TagResponse = {
  _id: string;
  contentId: string;
  tagname: string;
};

const constructTagResponse = (tag: HydratedDocument<Tag>): TagResponse => {
  const tagCopy: Tag = {
    ...tag.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...tagCopy,
    _id: tagCopy._id.toString(),
    contentId: tagCopy.contentId.toString(),
    tagname: tagCopy.tagname.toString()
  };
};

export {
  constructTagResponse
};
