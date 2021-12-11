// import mongoose from "mongoose";
import { AutoIncrement, mongoose } from "../core/database.js";
const { Schema } = mongoose;

const schema = new Schema(
  {
    name: { type: String },
    stockStatus: {
      type: String,
      enum: ["In-stock", "Out-of-stock"],
    },
    stock: {
      init: { type: Number, default: 0 },
      quantity: { type: Number, default: 0 },
      consumed: { type: Number, default: 0 },
    },
  },
  { timestamps: true, version: true }
);

schema.index({ productId: 1 });
schema.plugin(AutoIncrement, { inc_field: "productId" });
const model = mongoose.model("Product", schema);
export default model;
