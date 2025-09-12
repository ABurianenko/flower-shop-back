import { model, Schema } from "mongoose";

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

function generateOrderNumber() {
    const d = new Date();
    const y = String(d.getUTCFullYear()).slice(2);
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `ORD-${y}${m}${day}-${rnd}`;
}

const orderSchema = new Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
            default: () => generateOrderNumber()
        },
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
        status: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

orderSchema.index({ createdAt: 1 });

export const OrdersCollection = model('orders', orderSchema);
