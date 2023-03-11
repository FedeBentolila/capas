import supertest from "supertest";
import { expect } from "chai";
import { getfakeproduct } from "./generadorproductos.js";

const requestWithSupertest = supertest('http://localhost:8080');

describe('test api restfull', ()=>{
    describe('GET',()=>{
        it('deberia retornar 200', async()=>{
            let response= await requestWithSupertest.get('/productos')
            expect(response.status).to.eql(200)
        })
    })

    describe('POST',()=>{
        it('deberia incorporar un producto', async()=>{
            let producto =getfakeproduct()
            let response= await requestWithSupertest.post('/productos').send(producto)
            expect(response.status).to.eql(200)
            const product= response.request._data 
            expect(product).to.include.keys('title','description','price','code','stock','thumbnail')
            expect(product.title).to.eql(producto.title)
            expect(product.description).to.eql(producto.description) 
        })
    })

})








