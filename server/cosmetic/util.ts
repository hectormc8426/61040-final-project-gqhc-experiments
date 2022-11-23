import type { HydratedDocument } from 'mongoose';
import { Cosmetic } from './model';

export type CosmeticResponse = {
    _id: string,
    cosmeticName: string,
    filepath: string,
    cosmeticType: string
}


/**
 * Transform a raw Cosmetic object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Cosmetic>} cosmetic - A Cosmetic object
 * @returns {CosmeticResponse} - The Cosmetic object
 */
const constructCosmeticResponse = (cosmetic: HydratedDocument<Cosmetic>): CosmeticResponse => {
    const cosmeticCopy: Cosmetic = {
        ...cosmetic.toObject({
            versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    return {
        ...cosmeticCopy,
        _id: cosmeticCopy._id.toString(),
    };
};

export {
    constructCosmeticResponse
};