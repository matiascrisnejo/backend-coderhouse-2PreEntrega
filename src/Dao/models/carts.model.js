import mongoose from "mongoose"

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                },
                //_id: false
            },
        ],
            default : []
    }
})

export const cartsModel = mongoose.model(cartCollection,cartSchema)