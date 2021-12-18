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
    priceCent: {
      type: Number,
    },
  },
  { timestamps: true, version: true }
);

schema.pre("save", function () {
  if (this.isNew || this.isModified("stock.quantity")) {
    if (this.stock.quantity <= 0) {
      this.set("stockStatus", "Out-of-stock");
    } else {
      this.set("stockStatus", "In-stock");
    }
  }
});

schema.methods.reserveItem = async function (quantity) {
  if (!(quantity >= 0)) throw new Error("reserveItem quantity must be >=0");
  if (this.stock.quantity >= quantity) {
    this.set("stock.quantity", this.stock.quantity - quantity);
    this.set("stock.consumed", this.stock.consumed + quantity);
  } else {
    throw new Error("insuffience quantity");
  }
  await this.save();
};

schema.index({ productId: 1 });
schema.plugin(AutoIncrement, { inc_field: "productId" });
const model = mongoose.model("Product", schema);

export default model;
