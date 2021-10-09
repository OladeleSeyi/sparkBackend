import { graphQLClient } from "../libs/graphQLClient";
import { queries } from "../libs/queries";

export async function main(event, ctx) {
  const data = JSON.parse(event.body);
  const query = queries.checkTxnFee;
  const variables = {
    amount: data.amount,
  };
  try {
    const res = await graphQLClient(query, variables);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        data: res,
      }),
    };
  } catch (e) {
    console.log("Error getting Txn Fee", e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Failure: An error occured fetching the Data",
      }),
    };
  }
}
