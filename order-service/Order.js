// import mongoose from "mongoose";
import { AutoIncrement, mongoose } from "../core/database.js";
const { Schema } = mongoose;

const statusEnum = ["Init", "Processing", "Completed", "Failed"];

const schema = new Schema(
  {
    name: { type: String },
    status: {
      type: String,
      enum: statusEnum,
      default: statusEnum[0],
    },
    items: [
      {
        product_id: {
          type: "ObjectId",
          // validate: async (_id) => {
          //   console.log("test", _id);
          // },
        },
        name: { type: String },
        quantity: { type: Number },
        // unitPrice: { type: Number },
      },
    ],
    // totalCentAmount: { type: Number },
  },
  { timestamps: true, version: true }
);

schema.methods.reserved = async function () {
  this.set("status", "Completed");
  let order = await this.save();
  return order;
};

schema.methods.failed = async function () {
  this.set("status", "Failed");
  let order = await this.save();
  return order;
};

schema.index({ orderId: 1 });
schema.plugin(AutoIncrement, { inc_field: "orderId" });
const model = mongoose.model("Order", schema);
export default model;
