import type { HydratedDocument, Types } from 'mongoose';
import type { Showcase, ShowcaseChunk } from './model';
import ShowcaseModel from './model';


/**
 * This class allows access to Showcase instances in the MongoDB database. 
 * The supported actions are as follows:
 *      - add a showcase
 *      - delete a showcase
 *      - edit a showcase
 *      - find a showcase by its objectId
 *      - get every showcase by a user
 *      - get every showcase for a lesson
 *      - get every showcase by a user for a lesson
 *      - get every showcase
 * 
 */
class ShowcaseCollection {

    /**
     * Add a showcase to the collection
     * 
     * @param {Types.ObjectId | string} userId - The id of the user who made the showcase
     * @param {Types.ObjectId | string} lessonId - The id of the lesson to associate with the showcase
     * @param {string} content - Content of the showcase
     * @return {Promise<HydratedDocument<Showcase>>} - The newly created showcase
     */
    static async addOne(userId: Types.ObjectId | string, lessonId: Types.ObjectId | string, content: Array<ShowcaseChunk>): Promise<HydratedDocument<Showcase>> {
        const date = new Date();
        const showcase = new ShowcaseModel({
            userId: userId,
            dateCreated: date,
            dateModified: date,
            lessonId: lessonId,
            content: [...content]
        });

        await showcase.save()
        return (await showcase.populate('userId')).populate('lessonId');
    }

    /**
     * Find a showcase by its object id
     * 
     * @param showcaseId - The id of the lesson that is being queried
     * @returns The showcase with the given id, if such a showcase exists
     */
    static async findOne(showcaseId: Types.ObjectId | string): Promise<HydratedDocument<Showcase>> {
        return ShowcaseModel.findOne({ _id: showcaseId }).populate('userId').populate('lessonId');
    }

    /**
     * Get all the showcases on the platform
     * 
     * @returns a list of every showcase on the platform
     */
    static async findAll(): Promise<Array<HydratedDocument<Showcase>>> {
        return ShowcaseModel.find({}).populate('userId').populate('lessonId');
    }

    /**
     * 
     * @param userId - The id of the user whose showcases are being queried
     * @returns All the showcases by the given user, if such showcases exist
     */
    static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Showcase>>> {
        return ShowcaseModel.find({ userId: userId }).populate('userId').populate('lessonId');
    }

    /**
     * 
     * @param lessonId - The id of the lesson whose showcases are being queried
     * @returns All the showcases associated with the lesson, if such showcases exist
     */
    static async findAllByLessonId(lessonId: Types.ObjectId | string): Promise<Array<HydratedDocument<Showcase>>> {
        return ShowcaseModel.find({ lessonId: lessonId }).populate('userId').populate('lessonId');
    }

    /**
     * @param userId - The id of the user whose showcases are being queried
     * @param lessonId - The id of the lesson whose showcases are being queried
     * @returns All the showcases associated with the lesson, if such showcases exist
     */
    static async findAllByLessonAndUserId(lessonId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Showcase>>> {
        return ShowcaseModel.find({ lessonId: lessonId, userId: userId }).populate('userId').populate('lessonId');
    }

    /**
     * Delete a showcase with the given showcaseId
     *
     * @param showcaseId - The id of the showcase that will be deleted, if any
     */
    static async deleteOne(showcaseId: Types.ObjectId | string): Promise<void> {
        await ShowcaseModel.deleteOne({ _id: showcaseId });
    }

    /**
     * Deletes every showcase of a user with the given userId, if any
     * 
     * @param userId - The id of the user whose showcases are going to deleted
     */
    static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
        await ShowcaseModel.deleteMany({ userId: userId });
    }

    /**
     * Updates the specified showcase with the given information
     * 
     * @param showcaseId - The id of the sohwcase to be updated
     * @param content - The new content of the specified lesson
     * @returns The newly updated lesson
     */
    static async updateOne(showcaseId: Types.ObjectId | string, content: Array<ShowcaseChunk>): Promise<HydratedDocument<Showcase>> {
        const showcase = await ShowcaseModel.findOne({ showcaseId: showcaseId });
        showcase.content = [...content];
        showcase.dateModified = new Date();
        await showcase.save();
        return (await showcase.populate('userId')).populate('lessonId');
    }


}

export default ShowcaseCollection;