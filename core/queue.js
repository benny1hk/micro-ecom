import amqp from "amqplib";
class Queue {
  static USER_QUEUE = "USER_QUEUE";
  static PRODUCT_QUEUE = "PRODUCT_QUEUE";
  static ORDER_QUEUE = "ORDER_QUEUE";
  static GATEWAY_QUEUE = "GATEWAY_QUEUE";

  constructor({ mainQueue, amqpServer }) {
    this.mainQueue = mainQueue;
    this.amqpServer = amqpServer || process.env.amqpServer;
  }

  async connect({ oneByOne = false }) {
    this.connection = await amqp.connect(process.env.amqpServer);
    this.channel = await this.connection.createChannel();
    if (oneByOne) {
      this.channel.prefetch(1);
    }
    await this.channel.assertQueue(Queue.USER_QUEUE);
    await this.channel.assertQueue(Queue.PRODUCT_QUEUE);
    await this.channel.assertQueue(Queue.ORDER_QUEUE);
    await this.channel.assertQueue(Queue.GATEWAY_QUEUE);
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
