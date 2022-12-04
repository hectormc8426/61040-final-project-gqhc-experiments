import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { PopulatedUser, Quest, User } from './model';

// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  username: string;
  dateJoined: string;
  experiencePoints: number;
  quests: Array<string>;
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
    quests: constructQuestResponse(user.quests)
  };
};

const constructQuestResponse = (quests: Map<string, Quest>): Array<string> => {
  const formattedResponse: Array<string> = [];

  for (const questPair of quests) {
    const quest: Quest = questPair[1];
    if (quest.currentProgress >= quest.goalProgress) {
      formattedResponse.push(questPair[0] + ": COMPLETED");
    }
    else {
      formattedResponse.push(questPair[0] + ": " + quest.currentProgress + "/" + quest.goalProgress);
    }
  }
  return formattedResponse;
}

export {
  constructUserResponse
};

