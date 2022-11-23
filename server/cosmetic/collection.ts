import type { HydratedDocument, Types } from 'mongoose';
import type { Cosmetic } from './model';
import CosmeticModel from './model'

class CosmeticCollection {
    /**
   * Find a cosmetic by cosmeticId.
   *
   * @param {string} cosmeticId - The cosmeticId of the cosmetic to find
   * @return {Promise<HydratedDocument<Cosmetic>> | Promise<null>} - The cosmetic with the given id, if any
   */
    static async findOneById(cosmeticId: Types.ObjectId | string): Promise<HydratedDocument<Cosmetic>> {
        return CosmeticModel.findOne({ _id: cosmeticId });
    }
}

export default CosmeticCollection;