import { cartsModel } from "../../models/carts.model.js"
import ProductManager from "../Mongo/productManagerMongo.js"

const pm = new ProductManager()

export default class CartManager{
    
    async getCarts(){
        try {
            return await cartsModel.find()
        } catch (err) {
            console.log(err);
        }
    }

    async getCartById(cartId){

        try {
            return await cartsModel.findOne({ _id: cartId }).lean().populate("products._id");
        } catch (err) {
            return err.message
        }

        //const cart = await cartsModel.findById(cid).populate("products.product")
        //console.log("response", cart)
        //return cart

        //return await cartsModel.findOne({ _id: cid})
    }

    async addCart(products) {
        try {
            const cartCreated = await cartsModel.create({})
            products.forEach(product => cartCreated.products.push(product))
            await cartCreated.save()
            return cartCreated
        } catch (err) {
            return err.message
        }
    }

    async addProductInCart(cid, productFromBody) {
        try {
            const cart = await cartsModel.findOne({  _id: cid})
            const findProduct = cart.products.some(
                (product) => product._id.toString() === productFromBody._id)

            if(findProduct){
                await cartsModel.updateOne(
                    {_id: cid, "products._id": productFromBody._id},
                    { $inc: {"products.$.quantity": productFromBody.quantity}})
                    return await cartsModel.findOne({ _id: cid })
            }

            await cartsModel.updateOne(
                {_id: cid},
                {
                    $push: {
                        products: {
                            _id: productFromBody._id,
                            quantity: productFromBody.quantity
                        }
                    }
                })
        } catch (err) {
            console.log(err.message)
            return err
        }
    }

    async updateProductsInCart(cid, products) {
        try {
            return await cartsModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new:true })
        } catch (err) {
            return err
        }
    }

    async updateOneProduct(cid, products) {
        await cartsModel.update(
            { _id: cid },
            { products })
        return await cartsModel.findOne({ _id: cid })
    }

    async deleteCart(id) {
        try {
            let cart = await this.getCartById(id);
            await cartsModel.updateOne({ _id: id }, { products: [] });
            cart = await this.getCartById(id);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async removeProduct(cartId, productId) {
        try {
            let cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.product._id.toString() === productId);
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${productId} en el carrito con id ${cartId}`);
            } else {
                cart.products.splice(productIndex, 1);
            }
            await cartsModel.updateOne({ _id: cartId }, { products: cart.products });
            cart = await this.getCartById(cartId);
            return cart;
        } catch (error) {
            throw error;
        }
    }



}