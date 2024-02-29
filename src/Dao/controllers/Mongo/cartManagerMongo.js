import { cartsModel } from "../../models/carts.model.js"
import ProductManager from "../Mongo/productManagerMongo.js"

const pm = new ProductManager()

export default class CartManager{
    
    async getCarts(){
        
        try {
            if (id.length !== 24) {
                throw new Error('El id debe tener 24 caracteres');
            }
            const cart = await cartsModel.findOne({ _id: id }).lean();
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${id}`);
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id){

        try {
            if (id.length !== 24) {
                throw new Error('El id debe tener 24 caracteres');
            }
            const cart = await cartsModel.findOne({ _id: id }).lean();
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${id}`);
            }
            return cart;
        } catch (error) {
            throw error;
        }

        //const cart = await cartsModel.findById(cid).populate("products.product")
        //console.log("response", cart)
        //return cart

        //return await cartsModel.findOne({ _id: cid})
    }

    async createCart() {
        try {
            const cart = await cartsModel.create({});
            if (!cart) {
                throw new Error('No se pudo crear el carrito');
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            await pm.getProductById(productId);
            let cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.product._id.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity: quantity });
            }
            await cartsModel.updateOne({ _id: cartId }, { products: cart.products });
            cart = await this.getCartById(cartId);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCart(id, products) {
        try {
            //verifico que los ids de los productos existan
            const promises = products.map(product => {
                return pm.getProductById(product.product)
                    .catch(error => {
                        throw new Error(error);
                    });
            });
            await Promise.all(promises);

            //traigo el carrito que voy a actualizar
            let cart = await this.getCartById(id);

            //busco los productos que ya estén en el carrito y actualizo la cantidad, si no está lo agrego
            products.forEach(product => {
                const productIndex = cart.products.findIndex(cartProduct => cartProduct.product && cartProduct.product._id && cartProduct.product._id.toString() === product.product);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity = product.quantity;
                } else {
                    cart.products.push({ product: product.product, quantity: product.quantity });
                }
            });

            //actualizo el carrito
            await cartsModel.updateOne({ _id: id }, { products: cart.products });

            //traigo y devuelvo el carrito actualizado
            cart = await this.getCartById(id);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            let cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.product._id.toString() === productId);
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${productId} en el carrito con id ${cartId}`);
            } else {
                cart.products[productIndex].quantity = quantity;
            }
            await cartsModel.updateOne({ _id: cartId }, { products: cart.products });
            cart = await this.getCartById(cartId);
            return cart;
        } catch (error) {
            throw error;
        }
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