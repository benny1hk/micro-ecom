// import mongoose from "mongoose";
import { AutoIncrement, mongoose } from "../core/database.js";
const { Schema } = mongoose;

const statusEnum = ["Init", "Processing", "Completed", "Failed"];

const schema = new Schema(
  {
    orderno: { type: String },
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

schema.statics.reserved = async function (order_id) {
  let update = await this.findOneAndUpdate({ _id: order_id, status: "Init" }, [
    { $set: { status: "Completed" } },
  ]);
  if (!update) throw new Error("Order not found");
};
schema.statics.failed = async function (order_id) {
  let update = await this.findOneAndUpdate({ _id: order_id, status: "Init" }, [
    { $set: { status: "Failed" } },
  ]);
  if (!update) throw new Error("Order not found");
};
schema.methods.reserved = async function () {
  this.set("status", "Completed");
  this.increment();
  let order = await this.save();
  return order;
};
schema.methods.failed = async function () {
  this.set("status", "Failed");
  this.increment();
  let order = await this.save();
  return order;
};

schema.index({ orderId: 1 });
schema.plugin(AutoIncrement, {
  inc_field: "orderId",
  id: null,
});

schema.path("orderId").set(function (v) {
  if (this.isNew) {
    this.orderNo = "CO-" + `${v}`.padStart(7, "0");
  }
  return v;
});
const model = mongoose.model("Order", schema);
export default model;
