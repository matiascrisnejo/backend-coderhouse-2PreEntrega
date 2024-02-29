import express from "express"
import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js"
import { __dirname } from "../utils.js"
import CartManager from "../Dao/controllers/Mongo/cartManagerMongo.js"


const cm = new CartManager()
const pm = new ProductManager()
const routerV = express.Router()

routerV.get("/", async(req, res)=> {
    const listadeproductos = await pm.getProductsView()
    console.log(listadeproductos);
    res.render("home",{listadeproductos})
})

routerV.get('/products', async (req, res) => {
    try {
        const products = await pm.getProducts(req);
        res.render('products', {
            style: 'products.css',
            products
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
})

routerV.get('/carts/:cid', async (req, res) => {
    const id = req.params.cid;
    try {
        const cart = await cm.getCartById(id);
        cart.products = cart.products.map(product => {
            return {
                ...product,
                total: product.product.price * product.quantity
            };
        });
        cart.total = cart.products.reduce((acc, product) => acc + product.total, 0).toFixed(2);
        res.render('carts', {
            style: 'carts.css',
            cart
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerV.get("/realtimeproducts", (req, res)=>{
    res.render("realtimeproducts")
})

routerV.get("/chat", (req, res)=>{
    res.render("chat")
})

export default routerV

