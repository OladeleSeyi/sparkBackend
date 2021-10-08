import { graphQLClient } from "./libs/graphQLClient";
import { queries } from "./libs/queries";

export const hello = async (event, context) => {
  const query = queries.getBalances;

  const happy = await graphQLClient(query);
  console.log("happy", happy);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v2.0! ${await message({
        time: 1,
        copy: "Your function executed successfully!",
      })}`,
      happy,
    }),
  };
};

const message = ({ time, ...rest }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
  );
