import amqp from "amqplib";
const USER_QUEUE = "USER_QUEUE";
const PRODUCT_QUEUE = "PRODUCT_QUEUE";
const ORDER_QUEUE = "ORDER_QUEUE";

let connection;
let channel;

class Queue {
  constructor({ mainQueue, amqpServer }) {
    this.mainQueue = mainQueue;
    this.amqpServer = amqpServer || process.env.amqpServer;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.amqpServer);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(USER_QUEUE);
      await this.channel.assertQueue(PRODUCT_QUEUE);
      await this.channel.assertQueue(ORDER_QUEUE);
      console.log("queue connected", this.amqpServer);
    } catch (error) {
      console.error(error);
    }
  }
}

const connect = async () => {
  try {
    connection = await amqp.connect(process.env.amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(USER_QUEUE);
    await channel.assertQueue(PRODUCT_QUEUE);
    await channel.assertQueue(ORDER_QUEUE);
    console.log("queue connected", process.env.amqpServer);
  } catch (error) {
    console.error(error);
  }
};

const send = async (queue, data) => {
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};

const consume = async (queue, cb) => {
  return channel.consume(queue, async function (msg) {
    if (msg !== null) {
      // console.log(msg.content.toString());
      let content = JSON.parse(msg.content);
      if (content) await cb(content);
      channel.ack(msg);
    }
  });
};

const disconnect = async () => {
  queue.connection.close();
};

export {
  connect,
  connection,
  channel,
  send,
  consume,
  USER_QUEUE,
  PRODUCT_QUEUE,
  ORDER_QUEUE,
};
