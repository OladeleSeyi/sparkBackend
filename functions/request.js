import { nanoid } from "nanoid";
import { graphQLClient } from "../libs/graphQLClient";
import * as dynamoDbLib from "../libs/dynamoDbLib";
import { mutations } from "../libs/queries";

export async function main(event, ctx) {
  const data = JSON.parse(event.body);
  console.log("req", data);

  // validate the request

  // Generate Id

  const id = nanoid(12);

  //  Create a link to deposit and send bands to
  const { amount, safetyAmount } = data;

  const variables = {
    amount: safetyAmount,
    redirectLink: "https://localhost:3000/hello",
  };

  const depositMutation = mutations.createDeposit;

  try {
    const {
      createSendCashPayDeposit: {
        link: paymentLink,
        id: depositId,
        reference: depositReference,
      },
    } = await graphQLClient(depositMutation, variables);

    // Save the transaction request
    const params = {
      TableName: process.env.requestTableName,
      ConditionExpression: "attribute_not_exists(id)",
      Item: {
        id,
        email: data.email,
        orderId: data.orderId,
        status: "Requested",
        amount,
        dollarAmount: data.dollarAmount,
        paymentLink,
        depositId,
        depositReference,
        btcAmount: data.btcAmount,
        estimatedNetworkFee: data.estimatedNetworkFee,
        totalBtcAmount: data.totalBtcAmount,
        safetyAmount: data.safetyAmount,
        sendAddress: data.sendAddress,
      },
    };
    // respond the transaction link
    // TODO: Create a better Response object
    await dynamoDbLib.call("put", params);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: `Go Serverless v2.0! "Your function executed successfully!"`,
        data: {
          paymentLink,
        },
      }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: `Failing Serverless v2.0!`,
        error: e.message,
      }),
    };
  }
}
