import { model, Schema } from "mongoose";

const flowersSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'shops',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['single', 'bouquet'],
        },
        description: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
            min: 0.01,
        },
        currency: {
            type: String,
            default: 'EUR'
        },
        image_url: {
            type: String,
            required: true,
            alias: 'imageUrl',
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const FlowersCollections = model('flowers', flowersSchema);
