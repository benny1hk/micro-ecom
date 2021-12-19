import Model from "./Product.js";

const data = [
  {
    name: "Apple",
    stockStatus: "In-stock",
    stock: {
      init: 1000,
      quantity: 1000,
      consumed: 0,
    },
    priceCent: 120,
  },
  {
    name: "Orange",
    stockStatus: "In-stock",
    stock: {
      init: 1000,
      quantity: 1000,
      consumed: 0,
    },
    priceCent: 60,
  },
];

const seed = async () => {
  await Model.create(data);
};

export default seed;
