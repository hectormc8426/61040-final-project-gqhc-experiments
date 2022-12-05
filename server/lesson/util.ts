import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import { PopulatedLesson, Lesson, LessonChunk } from './model';

export type LessonResponse = {
    _id: string;
    userId: string;
    author: string;
    dateCreated: string;
    content: Array<LessonChunk>;
    title: string;
    dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
export const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
* Transform a raw Lesson object from the database into an object
* with all the information needed by the frontend
*
* @param {HydratedDocument<Lesson>} lesson - A lesson
* @returns {LessonResponse} - The lesson object formatted for the frontend
*/
const constructLessonResponse = (lesson: HydratedDocument<Lesson>): LessonResponse => {
    const lessonCopy: PopulatedLesson = {
        ...lesson.toObject({
            versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const { username } = lessonCopy.userId;

    return {
        ...lessonCopy,
        _id: lessonCopy._id.toString(),
        userId: lessonCopy.userId._id.toString(),
        author: username,
        dateCreated: formatDate(lesson.dateCreated),
        dateModified: formatDate(lesson.dateModified)
    };
};

export {
    constructLessonResponse
};
