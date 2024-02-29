import { productsModel } from "../../models/products.model.js";


export default class ProductManager{


    async getProducts(req){

        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const status = req.query.status ? req.query.status : null;
        const category = req.query.category ? req.query.category : null;
        let sort = parseInt(req.query.sort);
        if (limit > 10) {
            limit = 10;
        }
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (category) {
            filter.category = category;
        }
        if(sort === 1 || sort === -1) {
            sort = { price: sort };
        } else {
            sort = null;
        }
        try {
            const products = await productsModel.paginate(filter, { limit, page, sort, lean: true });
            if (page > products.totalPages || page <= 0 || isNaN(page)) {
                throw new Error('Página inexistente');
            }
            products.prevLink = products.page > 1 ? `/products?page=${products.page - 1}` : null;
            products.nextLink = products.page < products.totalPages ? `/products?page=${products.page + 1}` : null;
            return products;
        } catch (error) {
            throw error;
        }

        // try {
        //     const options = {
        //         page: page || 1,
        //         limit: limit || 10,
        //         sort: sortOrder ? {price: sortOrder === 'asc' ? 1 : -1} : null
        //     }
        //     const query = category ? {category: category} : {}

        //     return await productsModel.paginate(query, options)
        // } catch (error) {
        //     console.error("error al mostrar",error)
        // }

        // try {
        //     return await productsModel.find().lean()        //convierto a obj de js
        // } catch (error) {
        //     return error
        // }
    }

    async getProductsView(){
        try {
            return await productsModel.find().lean();
        } catch (err) {
            return err
        }
    }

    async getProductById(id){

        try {
            if (id.length !== 24) {
                throw new Error('El id debe tener 24 caracteres');
            }
            const product = await productsModel.findOne({ _id: id });
            if (!product) {
                throw new Error(`No se encontró el producto con id ${id}`);
            }
            return product;
        } catch (error) {
            throw error;
        }

        // try {
        //     return await productsModel.findById(pid).lean()
        // } catch (err) {
        //     return {error: err.message}
        // }
    }

    async createProduct(product) {
        try {
            const newProduct = await productsModel.create(product);
            if (!newProduct) {
                throw new Error('No se pudo crear el producto');
            }
            return newProduct;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(`Ya existe un producto con el código ${product.code}`);
            }
            throw error;
        }
    }

    async updateProduct(id, product){
        try {
            let updatedProduct = await this.getProductById(id);
            await productsModel.updateOne({ _id: id }, product);
            updatedProduct = await this.getProductById(id);
            return updatedProduct;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(`Ya existe un producto con el código ${product.code}`);
            }
            throw error;
        }
    }
    
    async deleteProduct(id){

        try {
            let deletedProduct = await this.getProductById(id);
            await productsModel.deleteOne({ _id: id });
            return deletedProduct;
        } catch (error) {
            throw error;
        }

        // try {
        //     return await productsModel.findByIdAndDelete(id)
        // } catch (error) {
        //     return error
        // }
    }
}