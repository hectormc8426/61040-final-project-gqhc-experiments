import type { HydratedDocument, Types } from 'mongoose';
import type { Quest, User } from './model';
import UserModel from './model';
import { questList } from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */

type UserDetails = { password?: string; username?: string; experiencePoints?: number, quest?: Quest, dailyLoginDate?: Date, loginStreak: number, loginDays: Array<Date> }
class UserCollection {
    /**
     * Add a new user
     *
     * @param {string} username - The username of the user
     * @param {string} password - The password of the user
     * @return {Promise<HydratedDocument<User>>} - The newly created user
     */
    static async addOne(username: string, password: string): Promise<HydratedDocument<User>> {
        const dateJoined = new Date();
        let questInit: Map<string, Quest> = new Map();

        for (const quest of questList) {
            questInit.set(quest[0], {
                "name": quest[0], "desc": quest[1][0], "currentProgress": quest[1][1],
                "goalProgress": quest[1][2], "reward": quest[1][3], "repeatAmount": quest[1][4]
            })
        }

        const days = new Array([dateJoined]);

        const user = new UserModel({ username, password, dateJoined, experiencePoints: 0, quests: questInit, dailyLoginDate: dateJoined, loginStreak: 1, days });
        await user.save(); // Saves user to MongoDB
        return user;
    }

    /**
     * Find a user by userId.
     *
     * @param {string} userId - The userId of the user to find
     * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
     */
    static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
        return UserModel.findOne({ _id: userId });
    }

    /**
     * Find a user by username (case insensitive).
     *
     * @param {string} username - The username of the user to find
     * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
     */
    static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
        return UserModel.findOne({ username: new RegExp(`^${username.trim()}$`, 'i') });
    }

    /**
     * Find a user by username (case insensitive).
     *
     * @param {string} username - The username of the user to find
     * @param {string} password - The password of the user to find
     * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
     */
    static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
        return UserModel.findOne({
            username: new RegExp(`^${username.trim()}$`, 'i'),
            password
        });
    }

    /**
     * Update user's information
     *
     * @param {string} userId - The userId of the user to update
     * @param {UserDetails} userDetails - An object with the user's updated credentials
     * @return {Promise<HydratedDocument<User>>} - The updated user
     */
    static async updateOne(userId: Types.ObjectId | string, userDetails: UserDetails): Promise<HydratedDocument<User>> {
        const user = await UserModel.findOne({ _id: userId });
        if (userDetails.password) {
            user.password = userDetails.password;
        }

        if (userDetails.username) {
            user.username = userDetails.username;
        }

        if (userDetails.experiencePoints) {
            user.experiencePoints = userDetails.experiencePoints;
        }

        if (userDetails.dailyLoginDate) {
            user.dailyLoginDate = userDetails.dailyLoginDate;
        }

        if (userDetails.quest) {
            user.quests.set(userDetails.quest.name, {
                "name": userDetails.quest.name,
                "desc": userDetails.quest.desc,
                "currentProgress": userDetails.quest.currentProgress,
                "goalProgress": userDetails.quest.goalProgress,
                "reward": userDetails.quest.reward,
                "repeatAmount": userDetails.quest.repeatAmount
            });
        }

        if (userDetails.loginStreak) {
            user.loginStreak = userDetails.loginStreak;
        }

        if (userDetails.loginDays) {
            user.loginDays = userDetails.loginDays;
        }

        await user.save();

        // this feels kinda jank but should work for now 
        return user;
    }


    /**
     * Delete a user from the collection.
     *
     * @param {string} userId - The userId of user to delete
     * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
     */
    static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
        const user = await UserModel.deleteOne({ _id: userId });
        return user !== null;
    }
}

export default UserCollection;
