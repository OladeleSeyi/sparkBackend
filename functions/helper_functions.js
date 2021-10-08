import * as dynamoDbLib from "../libs/dynamoDbLib";
import { graphQLClient } from "../libs/graphQLClient";
import { mutations } from "../libs/queries";

export async function onDeposit(request) {
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
  const buyMutation = mutations.buyCoins;

  const buyVariables = {
    price:
      "QnV5Y29pbnNQcmljZS1mYjcwZWI5ZC01YmIxLTRmNjUtODhjNy00YmZhOTA1OTczY2Q=",
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
