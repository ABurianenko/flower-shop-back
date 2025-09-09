import { model, Schema } from "mongoose";

const addressSchema = new Schema(
    {
        city: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        building: {
            type: String,
            required: true,
        },
    },
    {_id: false}
)

const shopsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: addressSchema,
            required: true,
        },
        slug: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const ShopsCollection = model('shops', shopsSchema);
