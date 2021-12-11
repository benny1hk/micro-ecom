// import mongoose from "mongoose";
import { AutoIncrement, mongoose } from "../core/database.js";
const { Schema } = mongoose;

const schema = new Schema(
  {
    email: { type: String, index: true, unique: true, lowercase: true },
    name: { type: String },
    password: String,
    credit: {
      init: { type: Number, default: 0 },
      current: { type: Number, default: 0 },
      expended: { type: Number, default: 0 },
    },
  },
  { timestamps: true, version: true }
);

// schema.statics.register = async function (email, name, password) {
//   const user = new model({ email, name, password });
//   await user.save();
//   return user;
// };

// schema.statics.login = async function (email, password) {
//   const user = await this.findOne({ email, password });
//   if (!user) throw new Error("User/Password Incorrect");
//   return user;
// };

schema.index({ userId: 1 });
schema.plugin(AutoIncrement, { inc_field: "userId" });
const model = mongoose.model("User", schema);

export default model;
