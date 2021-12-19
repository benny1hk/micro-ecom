import Model from "./Product.js";

const data = [
  {
    name: "Apple",
    stockStatus: "In-stock",
    stock: {
      init: 500,
      quantity: 500,
      consumed: 0,
    },
    priceCent: 120,
  },
  {
    name: "Orange",
    stockStatus: "In-stock",
    stock: {
      init: 300,
      quantity: 300,
      consumed: 0,
    },
    priceCent: 60,
  },
];

const seed = async () => {
  await Model.create(data);
};

export default seed;
