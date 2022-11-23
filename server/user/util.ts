import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { PopulatedUser, User } from './model';
import { CosmeticResponse, constructCosmeticResponse } from '../cosmetic/util';
import { Cosmetic } from '../cosmetic/model';

// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  username: string;
  dateJoined: string;
  musicCoins: number;
  profileCosmetic: CosmeticResponse | null;
  backgroundCosmetic: CosmeticResponse | null;
  bannerCosmetic: CosmeticResponse | null;
  allCosmetics: CosmeticResponse[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructUserResponse = (user: HydratedDocument<User>): UserResponse => {
  const userCopy: PopulatedUser = {
    ...user.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete userCopy.password;

  return {
    _id: userCopy._id.toString(),
    username: userCopy.username,
    dateJoined: formatDate(user.dateJoined),
    musicCoins: user.musicCoins,
    profileCosmetic: convertCosmetic(userCopy.profileCosmeticId),
    bannerCosmetic: convertCosmetic(userCopy.bannerCosmeticId),
    backgroundCosmetic: convertCosmetic(userCopy.backgroundCosmeticId),
    allCosmetics: userCopy.allCosmetics.map((cosmetic) => convertCosmetic(cosmetic))
  };
};

const convertCosmetic = (cosmetic: Cosmetic): CosmeticResponse => {
  if (!cosmetic)
    return null;
  return { ...cosmetic, _id: cosmetic._id.toString() }
}

export {
  constructUserResponse
};

