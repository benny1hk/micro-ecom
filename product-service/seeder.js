import Model from "./Product.js";

const data = [
  {
    name: "Apple",
    stockStatus: "In-stock",
    stock: {
      init: 100,
      quantity: 100,
      consumed: 0,
    },
    priceCent: 120,
  },
  {
    name: "Orange",
    stockStatus: "In-stock",
    stock: {
      init: 50,
      quantity: 50,
      consumed: 0,
    },
    priceCent: 60,
  },
];

const seed = async () => {
  await Model.create(data);
};

export default seed;
