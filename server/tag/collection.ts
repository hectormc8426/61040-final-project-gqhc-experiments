import type {HydratedDocument, Types} from 'mongoose'
import type {Tag} from './model';
import TagModel from "./model";

class TagCollection {
  // CREATION

  /**
   * Add a new Tag to database
   *
   * @param contentId - Content to be tagged
   * @param tagname - name of the tag
   * @return {} Tag object
   */
  static async addOne(contentId: Types.ObjectId | string, tagname: string): Promise<HydratedDocument<Tag>> {
    const tag = new TagModel({contentId, tagname});
    await tag.save();
    return tag
  }


  // FINDING

  /**
   * Find specific tag on content based on tagname
   *
   * @param contentId - Content that was tagged
   * @param tagname - Name of the tag
   * @return {} Tag Object fitting params in database
   */
  static async findOne(contentId: Types.ObjectId | string, tagname: string): Promise<HydratedDocument<Tag>> {
    return TagModel.findOne({contentId, tagname});
  }

  /**
   * Find all tags on content
   *
   * @param contentId - Content that was tagged
   * @return {} Array of all tags to content
   */
  static async findAllByContentId(contentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Tag>>> {
    return TagModel.find({contentId});
  }

  /**
   * Find all tags with tagname
   *
   * @param tagname - Name of tag
   * @return {} Array of all tags with tagname
   */
  static async findAllByTagname(tagname: string): Promise<Array<HydratedDocument<Tag>>> {
    return TagModel.find({tagname});
  }


  // DELETE

  /**
   * Delete specific tag
   *
   * @param contentId - Content being tagged
   * @param tagname - name of tag
   */
  static async deleteOne(contentId: Types.ObjectId | string, tagname: string): Promise<boolean> {
    const tag = await TagModel.deleteOne({contentId, tagname});
    return tag !== null;
  }

  /**
   * Delete all tags that have ever been done on content
   *
   * @param contentId - The content to be rid of all tags
   */
  static async deleteManyByContentId(contentId: Types.ObjectId | string): Promise<void> {
    await TagModel.deleteMany({contentId});
  }
}

export default TagCollection;
