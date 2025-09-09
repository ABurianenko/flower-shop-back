import { Schema } from "mongoose";

const flowersSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        shopId: {
            type: Schema.Types.ObjectId,
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
            required: true,
            default: 'EUR'
        },
        image_url: {
            type: String,
            required: true,
            alias: 'imageUrl',
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        available: {
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
)
