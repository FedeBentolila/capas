import axios from "axios";

export function axiosTest(){
 // get productos
axios.get('http://localhost:8080/productos')
.then((res)=>{
    console.log('exito en get productos')
    console.log(res.data)
})
.catch((error)=>{
    console.log(error)
})

// post productos
axios.post('http://localhost:8080/productos',
{
    title: "PRUEBA",
    description: "PRUEBA",
    price: "200",
    code: "25",
    stock: "10",
    thumbnail: "https://www.catipilla.com/wp-content/uploads/2023/02/test-clip-art-cpa-school-test.png",
}
)
.then(()=>{
    console.log('exito en post productos')

    // delete productos
    axios.delete('http://localhost:8080/productos/3')
    .then((res)=>{
    console.log('exito en delete productos')
    })
    .catch((error)=>{
    console.log(error)
    })
})
.catch((error)=>{
    console.log(error)
}) 

}
