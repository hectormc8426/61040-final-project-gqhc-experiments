import type { HydratedDocument, Types } from 'mongoose';
import CosmeticCollection from '../cosmetic/collection';
import CosmeticModel from '../cosmetic/model';
import type { User } from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */

type UserDetails = { password?: string; username?: string; musicCoins?: number, profileCosmeticId?: string | Types.ObjectId; backgroundCosmeticId?: string | Types.ObjectId; bannerCosmeticId?: string | Types.ObjectId }
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

        const user = new UserModel({ username, password, dateJoined, musicCoins: 0, allCosmetics: [] });
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
        return UserModel.findOne({ _id: userId }).populate('allCosmetics').populate('profileCosmeticId').populate('bannerCosmeticId').populate('backgroundCosmeticId');
    }

    /**
     * Find a user by username (case insensitive).
     *
     * @param {string} username - The username of the user to find
     * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
     */
    static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
        return UserModel.findOne({ username: new RegExp(`^${username.trim()}$`, 'i') }).populate('allCosmetics').populate('profileCosmeticId').populate('bannerCosmeticId').populate('backgroundCosmeticId');
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
        }).populate('allCosmetics').populate('profileCosmeticId').populate('bannerCosmeticId').populate('backgroundCosmeticId');
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

        if (userDetails.musicCoins) {
            user.musicCoins = userDetails.musicCoins
        }

        // set profile cosmetic id
        if (userDetails.profileCosmeticId) {
            const profileCosmetic = await CosmeticCollection.findOneById(userDetails.profileCosmeticId);
            user.profileCosmeticId = profileCosmetic.id;
        }

        if (userDetails.backgroundCosmeticId) {
            const backgroundCosmetic = await CosmeticCollection.findOneById(userDetails.backgroundCosmeticId);
            user.backgroundCosmeticId = backgroundCosmetic.id;
        }

        if (userDetails.bannerCosmeticId) {
            const bannerCosmetic = await CosmeticCollection.findOneById(userDetails.bannerCosmeticId);
            user.bannerCosmeticId = bannerCosmetic.id;
        }

        await user.save();

        // this feels kinda jank but should work for now 
        return (await (await (await user.populate('allCosmetics')).populate('profileCosmeticId')).populate('bannerCosmeticId')).populate('backgroundCosmeticId');
    }

    /**
     * Add cosmetic to user's list of owned cosmetics
     * 
     * @param {string} userId - The userId of the user to add cosmetic to
     * @param {string} cosmeticId - Id of cosmetic to add to user's list of owned cosmetics
     */
    static async addCosmetic(userId: Types.ObjectId | string, cosmeticId: Types.ObjectId | string) {
        const user = await UserModel.findOne({ _id: userId });
        const cosmetic = await CosmeticModel.findOne({ _id: cosmeticId });
        if (!cosmetic)
            return;

        user.allCosmetics.push(cosmetic.id);

        await user.save();

        // this feels kinda jank but should work for now 
        return (await (await (await user.populate('allCosmetics')).populate('profileCosmeticId')).populate('bannerCosmeticId')).populate('backgroundCosmeticId');
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
