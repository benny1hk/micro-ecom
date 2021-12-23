import { createClient } from "redis";

function MongooseCache(schema, options) {
  // const exec = mongoose.Query.prototype.exec;
  const client = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));
  client.connect();

  schema.statics.getCache = async function (_id) {
    const key = JSON.stringify({
      _id: _id,
      collection: this.collection.collectionName,
    });
    const cacheValue = await client.get(key);
    if (cacheValue) {
      return JSON.parse(cacheValue);
    }
    return null;
  };
  schema.statics.setCache = async function (_id, value) {
    const key = JSON.stringify({
      _id: _id,
      collection: this.collection.collectionName,
    });
    client.set(key, JSON.stringify(value));
    client.expire(key, 5);
  };

  console.debug("Redis Cache enabled");
}

export { MongooseCache };
