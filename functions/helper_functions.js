import * as dynamoDbLib from "../libs/dynamoDbLib";
import { graphQLClient } from "../libs/graphQLClient";
import { mutations, queries } from "../libs/queries";

export async function onDeposit(request) {
  // update the status of the request from pending
  const getQuery = queries.getPrice;
  const newPrice = await graphQLClient(getQuery);
  const params = {
    TableName: process.env.requestTableName,
    Item: {
      ...request,
      orderId: newPrice.getPrices[0].id,
      status: "Ordered",
    },
  };
  try {
    await dynamoDbLib.call("put", params);
  } catch (e) {
    console.log("failure updating Dynamodb", e);
  }
  // order up the amount of coins you can get
  const buyMutation = mutations.buyCoins;

  const buyVariables = {
    price: newPrice.getPrices[0].id,
    amount: request.totalBtcAmount,
  };

  const buyOrder = await graphQLClient(buyMutation, buyVariables);
  //  Save these in the txn table
  console.log("buyOrder", buyOrder);
  const txnParams = {
    TableName: "dev-txnTable",
    Item: {
      id: request.orderId,
      requestId: request.id,
      amount: request.totalBtcAmount,
      status: "pending",
      email: request.email,
      sendAddress: request.sendAddress,
    },
  };
  try {
    const txn = await dynamoDbLib.call("put", txnParams);
    return txn;
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

export async function getOrder(id) {
  const params = {
    TableName: process.env.requestTableName,
    FilterExpression: "#o = :ooo ",
    ExpressionAttributeNames: {
      "#o": "orderId",
    },
    ExpressionAttributeValues: {
      ":ooo": id,
    },
  };

  try {
    let request = await dynamoDbLib.call("scan", params);
    return request.Items[0];
  } catch (e) {
    console.log("error getting deposit request ", e);
  }
}

export async function onOrderConfirmation(request) {
  const sendVariables = {
    address: request.sendAddress,
    amount: request.btcAmount,
  };
  const sendMutation = mutations.sendCoins;
  try {
    const sendOrder = await graphQLClient(sendMutation, sendVariables);
    return sendOrder;
  } catch (e) {
    console.log("failure sending", e);
    throw new Error("failure sending", e);
  }
}
