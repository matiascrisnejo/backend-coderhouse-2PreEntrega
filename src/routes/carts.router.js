import express from "express"
import CartManager from "../Dao/controllers/Mongo/cartManagerMongo.js"
import { __dirname } from "../utils.js"


//esto es fs
//import CartManager from "../Dao/controllers/fs/productManager.js"
//const cm=new CartManager(__dirname+'/Dao/database/carts.json')

const cm = new CartManager()
const routerC =express.Router()

//routerC.get("/",async(req,res)=>{
//    const carrito = await  cm.getCarts()
//    res.json({carrito})
// })

routerC.get("/:cid",async(req,res)=>{

  try {
    const id = req.params.cid;
    const cart = await cm.getCartById(id);
    res.json({ status: 'success', payload: cart });
} catch (error) {
    res.status(500).json({ error: error.message });
}

  // const { cid }= req.params
  // const result = await cm.findCartById(cid)
  // res.send({ result: "success", payload: result })
  //res.json({cart})

})


routerC.post("/", async (req, res) => {

  try {
    const cart = await cm.createCart();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

    // const cart = await cm.addCart()
    // res.json({ cart })
});

  routerC.post("/:cid/products/:pid", async (req, res) => {
    
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const quantity = req.body.quantity ?? 1;
      const cart = await cm.addProduct(cartId, productId, quantity);
      res.json({ status: 'success', payload: cart });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }

    // const { cid, pid } = req.params;
    // const cart = await cm.addProductToCart(cid, pid) 
    // res.json({ cart });
  });

  routerC.put('/:cid', async (req, res) => {
    try {
        const id = req.params.cid;
        const products = req.body.products ?? [];
        const cart = await cm.updateCart(id, products);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

routerC.put('/:cid/products/:pid', async (req, res) => {
  try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const quantity = req.body.quantity ?? 1;
      const cart = await cm.updateProductQuantity(cartId, productId, quantity);
      res.json({ status: 'success', payload: cart });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
})

routerC.delete('/:cid', async (req, res) => {
  try {
      const id = req.params.cid;
      const cart = await cm.deleteCart(id)
      res.json({ status: 'success', payload: cart });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
})

routerC.delete('/:cid/products/:pid', async (req, res) => {
  try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const cart = await cm.removeProduct(cartId, productId);
      res.json({ status: 'success', payload: cart });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
  

export default routerC