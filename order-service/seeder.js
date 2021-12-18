import User from "./User.js";

const data = [
  {
    email: "benny@abc.com",
    name: "benny",
    password: "benny",
    credit: {
      init: 1000,
      current: 0,
      expended: 0,
    },
  },
  {
    email: "jimmy@abc.com",
    name: "jimmy",
    password: "jimmy",
    credit: {
      init: 500,
      current: 0,
      expended: 0,
    },
  },
  {
    email: "sunny@abc.com",
    name: "sunny",
    password: "sunny",
    credit: {
      init: 200,
      current: 0,
      expended: 0,
    },
  },
];

const seed = async () => {
  await User.create(data);
};

export default seed;
