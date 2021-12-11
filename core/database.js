import mongoose from "mongoose";
import AutoIncrementLib from "mongoose-sequence";
const AutoIncrement = AutoIncrementLib(mongoose);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.on("disconnected", function () {
  console.log("db disconnected");
});
db.once("open", function () {
  console.log("db connected", db._connectionString);
});

const connect = async () => {
  if (process.env.TEST) {
    console.log("We are not connecting to real mongod in Test mode");
    return;
  }
  await mongoose.connect(process.env.mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export { db, connect, AutoIncrement, mongoose };
