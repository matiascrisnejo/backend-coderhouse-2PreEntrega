import fs from "fs"

export default class ProductManager{

    constructor(path){
        this.path=path,
     this.products=[]
    }

    async getProducts(objetoQuery){
    const {limit} = objetoQuery
     try{

        if(fs.existsSync(this.path)){
            const listadeproductos=await fs.promises.readFile(this.path,"utf-8")
            const listadoproductosParse=JSON.parse(listadeproductos)
            if(limit){
                const listadeproductosLimit = listadoproductosParse.slice(0, parseInt(limit))
                return listadeproductosLimit
            } else {
                return listadoproductosParse
            }
        } else{
            return []
        }
     }
     catch (error) {
        //console.error("Error while getting products:", error);
        throw new Error(error); // Re-throw the error to handle it at a higher level if needed
    }
    }

    async getProductsView(){
        try {
    
          if (fs.existsSync(this.path)) {
          
            const productlist = await fs.promises.readFile(this.path, "utf-8");
            const productlistJs = JSON.parse(productlist);
              return productlistJs;
          } else {
            return [];
          }
        } catch (error) {
          throw new Error(error);
        }
    };

     async generateIds() {
         try {
           if(fs.existsSync(this.path)){
             const productList = await fs.promises.readFile(this.path, "utf-8")
             const productListJs = JSON.parse(productList)
             const counter = productListJs.length
             if(counter == 0){
               return 1
             } else{
               return productListJs[counter - 1].id + 1
             }
           }
         } catch (error) {
             throw new Error(error)
         }
     }


     async addProduct(objBody){
         const {title, description, price, thumbnail, category, status=true, code, stock} = objBody
         if(!title || !description || !price || !category || !status || !code || !stock || !thumbnail){
             console.log("ingrese todos los datos del producto");
             return
         } else{
             const listadeproductos = await this.getProducts({})
             const codigorepetido = listadeproductos.find(
                 (elemento) => elemento.code === code
             )
             if(codigorepetido){
                 console.error("el codigo del producto que desea agregar es repetido");
                 return
             } else{
                 const id = await this.generateIds()
                 const productNew = {
                     id,
                     title,
                     description,
                     price,
                     category,
                     status,
                     thumbnail,
                     code,
                     stock,
                 }
                 listadeproductos.push(productNew)
                 await fs.promises.writeFile(this.path,
                     JSON.stringify(listadeproductos, null, 2)
                 )
             }
         }
     }


 //UPDATE
 async updateProduct(objectParams,objBody){
    const {title, description, price, thumbnail, category, status , code, stock} = objBody
    const {pid} = objectParams
        if(title === undefined || description === undefined || price === undefined|| category === undefined || status === undefined || code === undefined || stock === undefined){
            console.error("INGRESE TODOS LOS DATOS DEL PRODUCTO PARA SU ACTUALIZACION")
            return 
          }
          else{
              const listadeproductos = await this.getProducts({})
              const codigorepetido = listadeproductos.find( (elemento) => elemento.code === code)
              if(codigorepetido){
                   console.error("EL CODIGO DEL PRODUCTO QUE DESEA ACTUALIZAR ES REPETIDO")
                   return
              }
              else{
                  const listadeproductos = await this.getProducts({})
                  const newProductsList = listadeproductos.map( (elemento) =>{
                      if(elemento.id === parseInt(pid)){
                        const updatedProduct={
                          ...elemento,
                          title,
                          description,
                          price,
                          category,
                          status,
                          thumbnail,
                          code,
                          stock
                        }
                        return updatedProduct
                      }
                      else{
                          return elemento
                      }
                  })
                  await fs.promises.writeFile(this.path,JSON.stringify(newProductsList))
              }
              
          }
  }


  //DELETE
  async deleteProduct(id){
    const allproducts = await this.getProducts({})
    const productswithoutfound = allproducts.filter(
         (elemento) => elemento.id !== parseInt(id)
    )
    await fs.promises.writeFile(this.path, JSON.stringify(productswithoutfound)
    )
        return "producto eliminado"

    }


async getProductbyId(objectParams){
   const {pid} = objectParams

   try{
    if(fs.existsSync(this.path)){
        const allproducts = await this.getProducts({})
        const found = allproducts.find((element) => element.id === parseInt(pid))
        if(found){
            return found
        } else{
            throw new Error("producto no existe")
        }
    } else{
        throw new Error("producto no encontrado")
    }
   }
   catch (error) {
    //console.error("Error while Gtting the product:", error);
    throw new Error(error); // Re-throw the error to handle it at a higher level if needed
}
}
}
