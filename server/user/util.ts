import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { PopulatedUser, Quest, User } from './model';

// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  username: string;
  dateJoined: string;
  experiencePoints: number;
  quests: Array<Quest>;
  dailyLoginDate: Date;
  loginStreak: number;
  loginDays: Array<Date>;
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
    experiencePoints: userCopy.experiencePoints,
    quests: constructQuestResponse(user.quests),
    dailyLoginDate: userCopy.dailyLoginDate,
    loginStreak: userCopy.loginStreak,
    loginDays: userCopy.loginDays
  };
};

const constructQuestResponse = (quests: Map<string, Quest>): Array<Quest> => {
  const formattedResponse: Array<Quest> = [];

  for (const questPair of quests) {
    const quest: Quest = questPair[1];
    formattedResponse.push(quest);
  }
  return formattedResponse;
}

export {
  constructUserResponse
};

