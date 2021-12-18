import Queue from "../core/queue.js";
const main = async () => {
  const queue = new Queue({ mainQueue: Queue.GATEWAY_QUEUE });
  await queue.connect({});

  queue.consume(async (data) => {
    console.log("return on gateway", data);
  });

  let i = 200;

  Array(i)
    .fill(0)
    .map((v) => {
      queue.send(
        {
          event: "createorder",
          payload: {
            name: "testorder",
            items: [
              { product_id: "61bcfc93138fc9fd86e700af", quantity: 5 },
              { product_id: "61bcfc93138fc9fd86e700ae", quantity: 5 },
            ],
          },
          success: {
            queue: Queue.GATEWAY_QUEUE,
            event: "createorder/success",
          },
          failed: {
            queue: Queue.GATEWAY_QUEUE,
            event: "createorder/failed",
          },
        },
        Queue.ORDER_QUEUE
      );
    });

  // while (i--) {
  //   queue.send(
  //     {
  //       event: "createorder",
  //       payload: {
  //         name: "testorder",
  //         items: [
  //           { product_id: "61bcfc93138fc9fd86e700af", quantity: 5 },
  //           { product_id: "61bcfc93138fc9fd86e700ae", quantity: 5 },
  //         ],
  //       },
  //       success: {
  //         queue: Queue.GATEWAY_QUEUE,
  //         event: "createorder/success",
  //       },
  //       failed: {
  //         queue: Queue.GATEWAY_QUEUE,
  //         event: "createorder/failed",
  //       },
  //     },
  //     Queue.ORDER_QUEUE
  //   );
  // }
};
main();
