// import type { HydratedDocument, Types } from 'mongoose';
// import type { Showcase } from './model';
// import ShowcaseModel from './model';


// /**
//  * This class allows access to Lesson instances in the MongoDB database. 
//  * The supported actions are as follows:
//  *      - add a showcase
//  *      - delete a showcase
//  *      - edit a showcase
//  *      - find a showcase by its objectId
//  *      - get every showcase by a user ( userId)
//  *      - get every showcase for a lesson
//  *      - get every showcase
//  * 
//  */
// class ShowcaseCollection {

//     /**
//      * Add a showcase to the collection
//      * 
//      * @param {Types.ObjectId | string} userId - The id of the user who made the showcase
//      * @param {string} content - Content of the showcase
//      * @return {Promise<HydratedDocument<Showcase>>} - The newly created showcase
//      */
//     static async addOne(userId: Types.ObjectId | string, title: string, content: string): Promise<HydratedDocument<Showcase>> {
//         const date = new Date();
//         const lesson = new LessonModel({
//             userId: userId,
//             dateCreated: date,
//             dateModified: date,
//             title: title,
//             content: content
//         });

//         await lesson.save()
//         return lesson;
//     }

//     /**
//      * Find a lesson by its object id
//      * 
//      * @param lessonId - The id of the lesson that is being queried
//      * @returns The lesson with the given id, if such lesson exists
//      */
//     static async findOne(lessonId: Types.ObjectId | string): Promise<HydratedDocument<Lesson>> {
//         return LessonModel.findOne({ _id: lessonId });
//     }

//     /**
//      * Get all the lessons on the platform
//      * 
//      * @returns a list of every lesson on the platform
//      */
//     static async findAll(): Promise<Array<HydratedDocument<Lesson>>> {
//         return LessonModel.find({});
//     }

//     /**
//      * 
//      * @param userId - The id of the user whose lessons are being queried
//      * @returns All the lessons by the given user, if such lessons exist
//      */
//     static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Lesson>>> {
//         return LessonModel.find({ userId: userId });
//     }

//     /**
//      * Delete a lesson with the given lessonId
//      * 
//      * @param lessonId - The id of the lesson that will be deleted, if any
//      */
//     static async deleteOne(lessonId: Types.ObjectId | string): Promise<void> {
//         await LessonModel.deleteOne({ _id: lessonId });
//     }

//     /**
//      * Deletes every lesson of a user with the given userId, if any
//      * 
//      * @param userId - The id of the user whose lessons are going to deleted
//      */
//     static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
//         await LessonModel.deleteMany({ userId: userId });
//     }

//     /**
//      * Updates the specified lesson with the given information
//      * 
//      * @param lessonId - The id of the lesson to be updated
//      * @param content - The new content of the specified lesson
//      * @returns The newly updated lesson
//      */
//     static async updateOne(lessonId: Types.ObjectId | string, title: string, content: Array<LessonChunk>): Promise<HydratedDocument<Lesson>> {
//         const lesson = await LessonModel.findOne({ lessonId: lessonId });
//         lesson.title = title;
//         lesson.content = content;
//         lesson.dateModified = new Date();
//         await lesson.save();
//         return lesson;
//     }


// }

// export default ShowcaseCollection;