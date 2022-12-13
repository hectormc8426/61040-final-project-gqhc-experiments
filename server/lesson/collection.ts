import type { HydratedDocument, Types } from 'mongoose';
import type { Lesson, LessonChunk } from './model';
import LessonModel from './model';


/**
 * This class allows access to Lesson instances in the MongoDB database. 
 * The supported actions are as follows:
 *      - add a lesson
 *      - delete a lesson
 *      - edit a lesson
 *      - find a lesson by the given username + title
 *      - find a lesson by its objectId
 *      - get every lesson by a user (userId)
 *      - get every lesson
 * 
 * If more actions are needed, feel free to add them here! (but update the doc in this file please! :D)
 */
class LessonCollection {

    /**
     * Add a lesson to the collection
     * 
     * @param {Types.ObjectId | string} userId - The id of the user who made the lesson
     * @param {Array<LessonChunk>} content - A list of lesson chunks that form the lesson when concatenated together
     * @return {Promise<HydratedDocument<Lesson>>} - The newly created lesson
     */
    static async addOne(userId: Types.ObjectId | string, title: string, content: Array<LessonChunk>, originalText: string): Promise<HydratedDocument<Lesson>> {
        const date = new Date();
        const lesson = new LessonModel({
            userId: userId,
            dateCreated: date,
            dateModified: date,
            title: title,
            content: content,
            originalText: originalText
        });

        await lesson.save()
        return lesson.populate('userId');
    }

    /**
     * Find a lesson by its object id
     * 
     * @param lessonId - The id of the lesson that is being queried
     * @returns The lesson with the given id, if such lesson exists
     */
    static async findOne(lessonId: Types.ObjectId | string): Promise<HydratedDocument<Lesson>> {
        return LessonModel.findOne({ _id: lessonId }).populate('userId');
    }

    /**
     * Get all the lessons on the platform
     * 
     * @returns a list of every lesson on the platform
     */
    static async findAll(): Promise<Array<HydratedDocument<Lesson>>> {
        return LessonModel.find({}).populate('userId');
    }

    /**
     * 
     * @param userId - The id of the user whose lessons are being queried
     * @returns All the lessons by the given user, if such lessons exist
     */
    static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Lesson>>> {
        return LessonModel.find({ userId: userId }).populate('userId');
    }

    /**
     * Get up to 10 most recent lessons
     * 
     * @returns a list of up to ten most recent lessons
     */
    static async findRecentLessons(): Promise<Array<HydratedDocument<Lesson>>> {
        return LessonModel.find().sort({ dateModified: -1 }).limit(10);
    }

    /**
     * Return lessons whose title contains the given string
     * 
     * @returns a list of lessons containing the given name
     */
    static async findLessonsByName(name: string): Promise<Array<HydratedDocument<Lesson>>> {
        let pattern = new RegExp(name, "i");
        return LessonModel.find({ title: pattern });
    }

    /**
     * Delete a lesson with the given lessonId
     * 
     * @param lessonId - The id of the lesson that will be deleted, if any
     */
    static async deleteOne(lessonId: Types.ObjectId | string): Promise<void> {
        await LessonModel.deleteOne({ _id: lessonId });
    }

    /**
     * Deletes every lesson of a user with the given userId, if any
     * 
     * @param userId - The id of the user whose lessons are going to deleted
     */
    static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
        await LessonModel.deleteMany({ userId: userId });
    }

    /**
     * Updates the specified lesson with the given information
     * 
     * @param lessonId - The id of the lesson to be updated
     * @param content - The new content of the specified lesson
     * @returns The newly updated lesson
     */
    static async updateOne(lessonId: Types.ObjectId | string, title: string, content: Array<LessonChunk>, originalText: string): Promise<HydratedDocument<Lesson>> {
        const lesson = await LessonModel.findOne({ _id: lessonId });
        lesson.title = title;
        lesson.content = content;
        lesson.originalText = originalText;
        lesson.dateModified = new Date();
        await lesson.save();
        return lesson.populate('userId');
    }


}

export default LessonCollection;