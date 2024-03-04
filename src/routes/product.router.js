import express from "express"
import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js"
import { __dirname } from "../utils.js"


//esto es con fs
//import ProductManager from "../Dao/controllers/fs/productManager.js"
//const manager = new ProductManager(__dirname+"/Dao/database/products.json")

const pm = new ProductManager()
const routerP = express.Router()


routerP.get("/",async(req, res)=>{
    
    try {
        let { limit, page, sort, category } = req.query
        console.log(req.originalUrl);
  
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { price: Number(sort) }
        };
  
        if (!(options.sort.price === -1 || options.sort.price === 1)) {
            delete options.sort
        }
  
  
        const links = (products) => {
          let prevLink;
          let nextLink;
          if (req.originalUrl.includes('page')) {
              prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
              nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
              return { prevLink, nextLink };
          }
          if (!req.originalUrl.includes('?')) {
              prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
              nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
              return { prevLink, nextLink };
          }
          prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
          nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
          return { prevLink, nextLink };
  
      }
    
    
  
        // Devuelve un array con las categorias disponibles y compara con la query "category"
        const categories = await pm.categories()
  
        const result = categories.some(categ => categ === category)
        if (result) {
  
            const products = await pm.getProducts({ category }, options);
            console.log(products)
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
            return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
  
        }
  
       const products = await pm.getProducts({}, options);
  
          const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
          const { prevLink, nextLink } = links(products);
  
          if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' })
  
          return res.render('home', { products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page });
      } catch (error) {
          console.log(error);
      }
})


routerP.get("/:pid",async(req, res)=>{
    const productfind = await pm.getProductById(req.params);
    res.json({ status: "success", productfind });
})

routerP.post("/",async(req, res)=>{
    const newproduct = await pm.addProduct(req.body);
     res.json({ status: "success", newproduct });
})

routerP.put("/:pid", async(req, res)=>{
    const updatedproduct = await pm.updateProduct(req.params,req.body);
     res.json({ status: "success", updatedproduct });
})

routerP.delete("/:pid", async(req, res)=>{
    const id=parseInt(req.params.pid)
    const deleteproduct = await pm.deleteProduct(id);
     res.json({ status: "success",deleteproduct });
})

export default routerP;

