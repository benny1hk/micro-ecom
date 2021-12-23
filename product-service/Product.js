// import mongoose from "mongoose";
import { AutoIncrement, mongoose } from "../core/database.js";
const { Schema } = mongoose;
import { MongooseCache } from "./MongooseCache.js";
import _ from "lodash";

// MongooseCache(mongoose);

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
  console.log("old reserveItem", this._id);
};

schema.statics.reserveItem = async function (product_id, quantity) {
  let update = await this.findOneAndUpdate(
    {
      _id: product_id,
      "stock.quantity": { $gte: quantity },
    },
    [
      {
        $set: {
          "stock.quantity": { $subtract: ["$stock.quantity", quantity] },
          "stock.consumed": { $add: ["$stock.consumed", quantity] },
          stockStatus: {
            $cond: {
              if: { $gt: [{ $subtract: ["$stock.quantity", quantity] }, 0] },
              then: "In-stock",
              else: "Out-of-stock",
            },
          },
        },
      },
    ]
  );
  // console.log("Update", update);
  if (!update) throw new Error("insuffience quantity");
  // console.log("new reserveItem", product_id);
};

schema.statics.preReserve = async function (_items) {
  let self = this;
  let queue = _.cloneDeep(_items);

  try {
    await Promise.all(
      queue.map(async (item) => {
        const { product_id, quantity } = item;
        let product = await self.getCache(product_id);
        if (!product) {
          product = await self.findOne({ _id: product_id });
          if (!product) throw new Error("Product not found");
          await self.setCache(product_id, product);
        }
        console.log("product.stock.quantity ", product.stock.quantity);
        const reserveable = product?.stock?.quantity >= quantity;
        if (reserveable === false) throw new Error("insuffience quantity");
        // setImmediate(async () => {});
        _.set(product, "stock.quantity", product.stock.quantity - quantity);
        await self.setCache(product_id, product);
        item.rollback = async function () {
          let product = await self.getCache(product_id);
          _.set(product, "stock.quantity", product.stock.quantity + quantity);
          await self.setCache(product_id, product);
        };
      })
    );
  } catch (error) {
    await Promise.all(
      queue.map(async (item) => {
        if (item.rollback) await item.rollback();
      })
    );

    throw error;
  }
};

schema.index({ productId: 1 });
schema.plugin(AutoIncrement, { inc_field: "productId" });

schema.plugin(MongooseCache);
const model = mongoose.model("Product", schema);

export default model;
