import faker from "faker";

export function getfakeproduct(){
    
    let productofake=
    {
        title: faker.commerce.product(),
        description: faker.commerce.product(),
        price: faker.commerce.price(),
        code: "25",
        stock: "10",
        thumbnail: faker.image.fashion(100, 100, true)
    };

    return productofake
  }











