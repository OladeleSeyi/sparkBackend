import * as dynamoDbLib from "../libs/dynamoDbLib";
import { graphQLClient } from "../libs/graphQLClient";
import { mutations } from "../libs/queries";

export async function onDeposit(price, amount, request) {
  // update the status of the request from pending
  const params = {
    TableName: process.env.requestTableName,
    Item: {
      ...request,
      status: "Ordered",
    },
  };
  try {
    await dynamoDbLib.call("put", params);
  } catch (e) {
    console.log("failure updating Dynamodb", e);
  }
  // order up the amount of coins you can get
  // const buyMutation = mutations.buyCoins;

  // const buyVariables = {
  //   price: request.orderId,
  //   amount: request.totalBtcAmount,
  // };

  // const buyOrder = await graphQLClient(buyMutation, buyVariables);
  //  Save these in the txn table
  const txnParams = {
    TableName: process.env.transactionTableName,
    Item: {
      id: request.orderId,
      amount: request.totalBtcAmount,
      status: "pending",
      email: request.email,
      sendAddress: request.sendAddress,
    },
  };
  console.log("txnParams", txnParams);
  try {
    await dynamoDbLib.call("put", txnParams);
  } catch (e) {
    console.log(e);
  }
}

export async function getRequest(ref) {
  const params = {
    TableName: process.env.requestTableName,
    FilterExpression: "#d = :dddd ",
    ExpressionAttributeNames: {
      "#d": "depositReference",
    },
    ExpressionAttributeValues: {
      ":dddd": ref,
    },
  };

  try {
    let request = await dynamoDbLib.call("scan", params);
    return request.Items[0];
  } catch (e) {
    console.log("error getting deposit request ", e);
  }
}
