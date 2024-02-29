import express from "express"
import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js"
import { __dirname } from "../utils.js"


//esto es con fs
//import ProductManager from "../Dao/controllers/fs/productManager.js"
//const manager = new ProductManager(__dirname+"/Dao/database/products.json")

const pm = new ProductManager()
const routerP = express.Router()

routerP.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
    }
    next();
});


routerP.get("/",async(req, res)=>{
    
    try {
        const products = await pm.getProducts(req);
        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    //const productList = await pm.getProducts(req.query)
    //res.json({productList})
})


routerP.get("/:pid",async(req, res)=>{

    try {
        const id = req.params.pid;
        const product = await pm.getProductById(id);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    //const productFind = await pm.getProductById(req.params)
    //res.json({ status: "success", productFind })
})

routerP.post("/",async(req, res)=>{

    try {
        const product = req.body;
        const newProduct = await pm.createProduct(product);
        res.json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    //const newproduct = await pm.addProducts(req.body)
    //res.json({ status: "success", newproduct })
})

routerP.put("/:pid", async(req, res)=>{
    
    try {
        const id = req.params.pid;
        const product = req.body;
        const updatedProduct = await pm.updateProduct(id, product);
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
    //const updateproduct = await pm.updateProduct(req.params, req.body)
    //res.json({ status: "success", updateproduct })
})

routerP.delete("/:pid", async(req, res)=>{
    
    try {
        const id = req.params.pid;
        const deletedProduct = await pm.deleteProduct(id);
        res.json({ status: 'success', payload: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    //const id = parseInt(req.params.pid)
    //const deleteproduct = await pm.deleteProduct(id)
    //res.json({ status: "success", deleteproduct })
})

export default routerP;

