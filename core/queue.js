import amqp from "amqplib";
class Queue {
  static ORDER_CREATE = "ORDER_CREATE";
  static PRODUCT_RESERVE = "PRODUCT_RESERVE";
  static PRODUCT_RESERVE_SUCCESS = "PRODUCT_RESERVE_SUCCESS";
  static PRODUCT_RESERVE_FAILED = "PRODUCT_RESERVE_FAILED";
  static PRODUCT_TRANS = "PRODUCT_TRANS";
  static ORDER_COMPLETED = "ORDER_COMPLETED";
  static ORDER_REJECTED = "ORDER_REJECTED";

  constructor({ mainQueue, amqpServer }) {
    this.mainQueue = mainQueue;
    this.amqpServer = amqpServer || process.env.amqpServer;
  }

  async connect({ oneByOne = false }) {
    this.connection = await amqp.connect(process.env.amqpServer);
    this.channel = await this.connection.createChannel();
    if (oneByOne) {
      this.channel.prefetch(1);
    } else {
      this.channel.prefetch(50);
    }
    await this.channel.assertQueue(Queue.ORDER_CREATE);
    await this.channel.assertQueue(Queue.PRODUCT_RESERVE);
    await this.channel.assertQueue(Queue.PRODUCT_RESERVE_SUCCESS);
    await this.channel.assertQueue(Queue.PRODUCT_RESERVE_FAILED);
    await this.channel.assertQueue(Queue.ORDER_COMPLETED);
    await this.channel.assertQueue(Queue.ORDER_REJECTED);
    console.log("queue connected", this.amqpServer);
    return true;
  }

  async send(data, queue) {
    this.channel.sendToQueue(
      queue || this.mainQueue,
      Buffer.from(JSON.stringify({ ...data, time: new Date(Date.now()) }))
    );
  }

  async consume(cb, queue) {
    const self = this;
    const consumer = await this.channel.consume(
      queue || this.mainQueue,
      async function (msg) {
        if (msg !== null) {
          let content = JSON.parse(msg.content);
          // if (content) await cb(content);
          await cb(content);
          self.channel.ack(msg);
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
