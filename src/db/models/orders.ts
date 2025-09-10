import { model, Schema } from "mongoose";
import { ref } from "process";

const customerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const deliveryAddressSchema = new Schema(
    {
        city: {
            type: String,
            required: function() {
                return this.type === 'delivery';
            },
        },
        street: {
            type: String,
            required: function() {
                return this.type === 'delivery';
            },
        },
        building: {
            type: String,
            required: function() {
                return this.type === 'delivery';
            },
        },
        apartment: {
            type: String,
            required: false,
        },
        entrance: {
            type: String,
            required: false,
        }
    },
    { _id: false }
);

const itemSchema = new Schema(
    {
        flowerId: {
            type: Schema.Types.ObjectId,
            ref: 'flowers',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
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
    },
    { _id: false }
);

const orderSchema = new Schema(
    {
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'shops',
            required: true,
        },
        customer: {
            type: customerSchema,
            required: true,
        },
        deliveryAddress: {
            type: deliveryAddressSchema,
            required: true,
        },
        items: {
            type: [itemSchema],
            required: true,
            validate: [(val: any) => val.length > 0, 'At least one item is required']
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0.01,
        },
        currency: {
            type: String,
            required: true,
            default: 'EUR'
        },
        type: {
            type: String,
            required: true,
            enum: ['delivery', 'pickup'],
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export const OrdersCollection = model('orders', orderSchema);
