import { graphQLClient } from "./libs/graphQLClient";
import { queries } from "./libs/queries";

export const hello = async (event, context) => {
  const query = queries.getPrice;

  const happy = await graphQLClient(query);
  console.log("happy", happy);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: "Success",
      data: happy.getPrices[0],
    }),
  };
};
