import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import { PopulatedShowcase, Showcase, ShowcaseChunk } from './model';

export type ShowcaseResponse = {
    _id: string;
    author: string;
    lesson: string;
    lessonId: string;
    dateCreated: string;
    content: Array<ShowcaseChunk>;
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
* Transform a raw Showcase object from the database into an object
* with all the information needed by the frontend
*
* @param {HydratedDocument<Showcase>} showcase - A showcase
* @returns {ShowcaseResponse} - The showcase object formatted for the frontend
*/
const constructShowcaseResponse = (showcase: HydratedDocument<Showcase>): ShowcaseResponse => {
    const showcaseCopy: PopulatedShowcase = {
        ...showcase.toObject({
            versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const { username } = showcaseCopy.userId;
    delete showcaseCopy.userId;
    const { _id, title } = showcaseCopy.lessonId;
    delete showcaseCopy.lessonId;
    return {
        ...showcaseCopy,
        _id: showcaseCopy._id.toString(),
        author: username,
        lesson: title,
        lessonId: _id.toString(),
        dateCreated: formatDate(showcase.dateCreated),
        dateModified: formatDate(showcase.dateModified)
    };
};

export {
    constructShowcaseResponse
};
