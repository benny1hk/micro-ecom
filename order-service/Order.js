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
    },
    items: [
      {
        product_id: { type: "ObjectId" },
        name: { type: String },
        quantity: { type: Number },
        // unitPrice: { type: Number },
      },
    ],
    // totalCentAmount: { type: Number },
  },
  { timestamps: true, version: true }
);

schema.index({ orderId: 1 });
schema.plugin(AutoIncrement, { inc_field: "orderId" });
const model = mongoose.model("Order", schema);
export default model;
