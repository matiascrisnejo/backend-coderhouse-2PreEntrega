import express from "express"
import CartManager from "../Dao/controllers/Mongo/cartManagerMongo.js"
import { __dirname } from "../utils.js"
import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js"


//esto es fs
//import CartManager from "../Dao/controllers/fs/productManager.js"
//const cm=new CartManager(__dirname+'/Dao/database/carts.json')

const pm = new ProductManager()
const cm = new CartManager()

const routerC =express.Router()

//ENDPOINT devuelve todos los carritos
routerC.get("/",async(req,res)=>{
  const result = await  cm.getCarts()
  return res.status(200).send(result)
})

//ENDPOINT devuelve un solo carrito
routerC.get("/:cid",async(req,res)=>{

  try {
    const { cid } = req.params
    const result = await cm.getCartById(cid)
    
    // Si el resultado del GET tiene la propiedad 'CastError' devuelve un error
    if(result === null || typeof(result) === 'string') return res.status(404).send({status:'error', message: 'ID not found' });
    

    // Resultado
    return res.status(200).send(result);
} catch (err) {
    console.log(err);
}

})

//ENDPOINT creo carrito con o sin productos
routerC.post("/", async (req, res) => {
  try {
    const { products } = req.body
    console.log(products)

    
    if (!Array.isArray(products)) return res.status(400).send({ status: 'error', message: 'TypeError' });

    // Corroborar si todos los ID de los productos existen
    const results = await Promise.all(products.map(async (product) => {
        const checkId = await pm.getProductById(product._id);
        if (checkId === null || typeof(checkId) === 'string') return res.status(404).send({status: 'error', message: `The ID product: ${product._id} not found`})
    }))

    const check = results.find(value => value !== undefined)
    if (check) return res.status(404).send(check)

    const cart = await cm.addCart(products)
    
            
    res.status(200).send(cart);

}
catch (err) {
    console.log(err);
}
})

  routerC.post("/:cid/products/:pid", async (req, res) => {
    
    try {
        
      let { cid, pid } = req.params
      const { quantity } = req.body
      

      if (quantity < 1) return res.status(400).send({status:'error', payload:null, message:'The quantity must be greater than 1'})
      
      const checkIdProduct = await pm.getProductById(pid);
      

      if (checkIdProduct === null || typeof(checkIdProduct) === 'string') return res.status(404).send({status: 'error', message: `The ID product: ${pid} not found`})
  
      const checkIdCart = await cm.getCartById(cid)

      if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({status: 'error', message: `The ID cart: ${cid} not found`})
  
      const result = await cm.addProductInCart(cid, { _id: pid, quantity })
      
      return res.status(200).send({message:`added product ID: ${pid}, in cart ID: ${cid}`, cart: result});

  } catch (error) {
      console.log(error);
  }
  });

  //ENDPOINT actualiza la lista de productos
  routerC.put('/:cid', async (req, res) => {
    try {
      const { cid } = req.params
      const {products} = req.body
      
      const results = await Promise.all(products.map(async (product) => {
          const checkId = await pm.getProductById(product._id);
          
          if (checkId === null || typeof(checkId) === 'string') {
              return res.status(404).send({status: 'error', message: `The ID product: ${product._id} not found`})
          }
      }))
      const check = results.find(value => value !== undefined)
      if (check) return res.status(404).send(check)

  
      const checkIdCart = await cm.getCartById(cid)
      if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({status: 'error', message: `The ID cart: ${cid} not found`})
      
      const cart = await cm.updateProductsInCart(cid, products)
      return res.status(200).send({status:'success', payload:cart})
  } catch (error) {
      console.log(error);
  }
})

/* 
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
*/

export default routerC