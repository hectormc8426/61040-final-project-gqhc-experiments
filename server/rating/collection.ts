import type {HydratedDocument, Types} from 'mongoose'
import type {Rating} from './model';
import RatingModel from "./model";

class RatingCollection {
  // CREATION

  /**
   * Add a new Rating to database
   *
   * @param userId - The one who rated
   * @param contentId - What they rated
   * @param category - What attribute of the content they rated
   * @param score - What the user rated the content
   * @return {} Rating object
   */
  static async addOne(userId: Types.ObjectId | string, contentId: Types.ObjectId | string, category: string, score: number): Promise<HydratedDocument<Rating>> {
    const rating = new RatingModel({userId, contentId, category, score});
    await rating.save();
    return rating
  }


  // FINDING

  /**
   * Find the rating of user on content
   *
   * @param userId - The one who rated
   * @param contentId - What they rated
   * @param category - What attribute of the content they rated
   * @return {} Rating Object fitting params in database
   */
  static async findOne(userId: Types.ObjectId | string, contentId: Types.ObjectId | string, category: string): Promise<HydratedDocument<Rating>> {
    return RatingModel.findOne({userId, contentId, category})
  }

  /**
   * Find all ratings user has on content
   *
   * @param userId - The one who rated
   * @param contentId - What they rated
   * @return {} Array of all rating objects fitting params in database
   */
  static async findAllByUserIdAndContentId(userId: Types.ObjectId | string, contentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Rating>>> {
    return RatingModel.find({userId, contentId})
  }

  /**
   * Find all ratings by user
   *
   * @param userId - The one who rated
   * @return {} Array of all ratings by user in database
   */
  static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Rating>>> {
    return RatingModel.find({userId})
  }

  /**
   * Find all ratings on content
   *
   * @param contentId - What was rated
   * @return {} Array of all ratings to content
   */
  static async findAllByContentId(contentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Rating>>> {
    return RatingModel.find({contentId})
  }

  /**
   * Find all ratings on content by category
   *
   * @param contentId - What was rated
   * @param category - Category of rating
   * @return {} Array of all ratings to content
   */
  static async findAllByContentIdAndCategory(contentId: Types.ObjectId | string, category: string): Promise<Array<HydratedDocument<Rating>>> {
    return RatingModel.find({contentId, category})
  }


  // UPDATING

  /**
   * Change rating score by user on content in category
   *
   * @param userId - The one who changed their mind
   * @param contentId - The content they changed their mind on
   * @param category - Category of content wrongly scored before
   * @param score - The new score for content
   */
  static async updateOne(userId: Types.ObjectId | string, contentId: Types.ObjectId | string, category: string, score: number): Promise<HydratedDocument<Rating>> {
    const rating = await RatingModel.findOne({userId, contentId, category});
    rating.score = score;
    await rating.save();

    return rating;
  }


  // DELETE

  /**
   * Delete specific rating
   *
   * @param userId - The one who no longer wants to rate
   * @param contentId - What they rated
   * @param category - The category to unrate
   */
  static async deleteOne(userId: Types.ObjectId | string, contentId: Types.ObjectId | string, category: string): Promise<boolean> {
    const rating = await RatingModel.deleteOne({userId, contentId, category});
    return rating !== null;
  }

  /**
   * Delete all ratings user did on content
   *
   * @param userId - The one who no longer wants to rate
   * @param contentId - What they rated
   */
  static async deleteManyByUserIdAndContentId(userId: Types.ObjectId | string, contentId: Types.ObjectId | string): Promise<void> {
    await RatingModel.deleteMany({userId, contentId});
  }

  /**
   * Delete all ratings user has ever done
   *
   * @param userId - The one whose ratings will disappear
   */
  static async deleteManyByUserId(userId: Types.ObjectId | string): Promise<void> {
    await RatingModel.deleteMany({userId});
  }

  /**
   * Delete all ratings that have ever been done on content
   *
   * @param contentId - The content to be rid of all ratings
   */
  static async deleteManyByContentId(contentId: Types.ObjectId | string): Promise<void> {
    await RatingModel.deleteMany({contentId});
  }
}

export default RatingCollection;
