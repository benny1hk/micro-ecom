module.exports = {
  apps: [
    {
      namespace: "micro",
      name: "api-gateway",
      script: "./api-gateway/index.mjs",
      watch: ["./api-gateway"],
      // env_production: {
      //   NODE_ENV: "production",
      //   mongodb_uri: "mongodb://localhost/user-service",
      //   amqpServer: "amqp://localhost:5672",
      // },
      env: {
        NODE_ENV: "development",
        // mongodb_uri: "mongodb://localhost/user-service",
        amqpServer: "amqp://localhost:5672",
      },
    },
    {
      namespace: "micro",
      name: "user-service",
      script: "./user-service/index.mjs",
      watch: ["./user-service"],
      // env_production: {
      //   NODE_ENV: "production",
      //   mongodb_uri: "mongodb://localhost/user-service",
      //   amqpServer: "amqp://localhost:5672",
      // },
      env: {
        NODE_ENV: "development",
        mongodb_uri: "mongodb://127.0.0.1:27016/user-service",
        amqpServer: "amqp://localhost:5672",
      },
    },
    {
      namespace: "micro",
      name: "product-service",
      script: "./product-service/index.mjs",
      watch: ["./product-service"],
      // env_production: {
      //   NODE_ENV: "production",
      //   mongodb_uri: "mongodb://localhost/product-service",
      //   amqpServer: "amqp://localhost:5672",
      // },
      env: {
        NODE_ENV: "development",
        mongodb_uri: "mongodb://127.0.0.1:27016/product-service",
        amqpServer: "amqp://localhost:5672",
      },
    },
    {
      namespace: "micro",
      name: "order-service",
      script: "./order-service/index.mjs",
      watch: ["./order-service"],
      // env_production: {
      //   NODE_ENV: "production",
      //   mongodb_uri: "mongodb://localhost/order-service",
      //   amqpServer: "amqp://localhost:5672",
      // },
      env: {
        NODE_ENV: "development",
        mongodb_uri: "mongodb://127.0.0.1:27016/order-service",
        amqpServer: "amqp://localhost:5672",
      },
    },
  ],
  deploy: {
    // production: {
    //   user: "SSH_USERNAME",
    //   host: "SSH_HOSTMACHINE",
    //   ref: "origin/master",
    //   repo: "GIT_REPOSITORY",
    //   path: "DESTINATION_PATH",
    //   "pre-deploy-local": "",
    //   "post-deploy":
    //     "npm install && pm2 reload ecosystem.config.js --env production",
    //   "pre-setup": "",
    // },
  },
};
