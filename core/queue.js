import amqp from "amqplib";

class Queue {
  static USER_QUEUE = "USER_QUEUE";
  static PRODUCT_QUEUE = "PRODUCT_QUEUE";
  static ORDER_QUEUE = "ORDER_QUEUE";

  constructor({ mainQueue, amqpServer }) {
    this.mainQueue = mainQueue;
    this.amqpServer = amqpServer || process.env.amqpServer;
  }

  async connect() {
    this.connection = await amqp.connect(process.env.amqpServer);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(USER_QUEUE);
    await this.channel.assertQueue(PRODUCT_QUEUE);
    await this.channel.assertQueue(ORDER_QUEUE);
    console.log("queue connected", this.amqpServer);
    return true;
  }

  async send(data, queue) {
    this.channel.sendToQueue(
      queue || this.mainQueue,
      Buffer.from(JSON.stringify(data))
    );
  }

  async consume(cb, queue) {
    const consumer = await this.channel.consume(
      queue || this.mainQueue,
      async function (msg) {
        if (msg !== null) {
          let content = JSON.parse(msg.content);
          // if (content) await cb(content);
          await cb(content);
          channel.ack(msg);
        }
      }
    );
    return consumer;
  }

  async disconnect() {
    await this.channel.close();
    await this.connection.close();
  }
}

export default Queue;
