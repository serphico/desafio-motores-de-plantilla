const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.static('data'));

const dataPath = require('path').resolve(__dirname, '../data/productos.txt');

class Products {
    constructor(){
        this.Products = []
    }

    save(obj){
        console.log(obj)
        let data = fs.readFileSync(dataPath, 'utf-8')

        if(!data){
            let id = parseInt(this.Products.length)+1
            this.Products = obj;
            let nuevoArray = {...this.Products, id: id};
            
            fs.writeFileSync(dataPath,JSON.stringify([nuevoArray]))
             
             return nuevoArray;
        }else{
            if(data.length <= 2){
                let id = parseInt(this.Products.length)+1
                this.Products = obj;
                let nuevoArray = {...this.Products, id: id};
                
                fs.writeFileSync(dataPath,JSON.stringify([nuevoArray]))
                 
                 return nuevoArray;
            }else if(data.length > 2){
                
                let objParse = JSON.parse(data);
                let lastId;
                for (const i of objParse) {
                    lastId = i.id;
                }
                let newProd = {...obj, id:lastId+1}
                objParse.push(newProd);


                fs.writeFileSync(dataPath,JSON.stringify(objParse))

                return objParse;

            }
        }


    }

    getAll(){
        let data = fs.readFileSync(dataPath, 'utf-8')
        if(data.length <= 0){
            console.log('no hay nada.')
        }else{
            return JSON.parse(data);
        }

    }

    getById(id){
        console.log(id)
        let reqId = id-1;
        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        if(data[reqId] != undefined){
            return data[reqId];
        }else if(data[reqId] == undefined){
           return null;
        }

    }

    putData(obj,id){

        let newId = id - 1;
        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log(data)
        if(!data[newId]){
            let error = {"error": "El elemento no existe"}
            return error
        }else{
            data[newId] = obj;
            fs.writeFileSync(dataPath,JSON.stringify([data]))
            return data
        }

    }
    deleteData(id){
        let newId = id - 1;
        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        

        if(data.length < id){
            let error = {error: "El elemento no existe"}
            return error
        }else{
            data.splice(newId,1)
            fs.writeFileSync(dataPath,JSON.stringify([data]))
            return data

        }
    }
}

const productsConstructor = new Products();
console.log(productsConstructor.getById)
module.exports = productsConstructor;