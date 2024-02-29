import fs from "fs"

export default class CartManager{
    constructor(path){
        this.path=path,
     this.carts=[  
     ]
    }
    //READ
    async getCarts(){
    if(fs.existsSync(this.path)){
      const cartlist= await fs.promises.readFile(this.path,"utf-8")
      const cartlistparse=JSON.parse(cartlist)
      return cartlistparse
    }
    else{
      return []
    }
    
    }


    async getCartbyId(objparams){
        const {cid}=objparams
     try {
      
      if (fs.existsSync(this.path)) {
        const allcarts=await this.getCarts()
        const found=allcarts.find(element=>element.id===parseInt(cid))
        if (found) {
          return found;
        } else {
         return ("cart no existe");
        }
      } else {
        return("cart file json  not found");
      }
    } catch (error) {
      return(error);
    }
  }
    //GENERATE ID 
    async generatecartId(){
      try {
        if (fs.existsSync(this.path)) {
          const cartlist = await fs.promises.readFile(this.path, "utf-8");
          const cartlistJs = JSON.parse(cartlist);
          const counter = cartlistJs.length;
          if (counter == 0) {
            return 1;
          } else {
            return cartlistJs[counter - 1].id + 1;
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    async addCart(){
      const listaCarts = await this.getCarts();
      const id = await this.generatecartId();
      const cartNew = {
        id,
        products: []
      };
      listaCarts.push(cartNew);
      await fs.promises.writeFile(this.path, JSON.stringify(listaCarts, null, 2));
    }
    

      async addProductToCart(cid, pid){
        const listaCarts = await this.getCarts();
        const cart = listaCarts.find(e => e.id === cid);
        const productIndex = cart.products.findIndex(p => p.pid === pid);
      
        if (productIndex !== -1) {
          // Si el producto ya existe en el carrito, incrementar la cantidad
          cart.products[productIndex].quantity++;
        } else {
          // Si el producto no existe en el carrito, agregarlo como un nuevo objeto
          cart.products.push({
            pid,
            quantity: 1
          });
        }
      
        await fs.promises.writeFile(this.path, JSON.stringify(listaCarts,null,2));
      }
      

     
    }