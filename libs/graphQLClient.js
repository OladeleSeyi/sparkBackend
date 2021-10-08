import { GraphQLClient, gql } from "graphql-request";

export async function graphQLClient(query, variables) {
  const endpoint = "https://backend.buycoins.tech/api/graphql";
  const authValue =
    "Basic " +
    Buffer.from(
      process.env.BUYCOINS_PK + ":" + process.env.BUYCOINS_SK
    ).toString("base64");

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: authValue,
    },
    credentials: "include",
    mode: "cors",
  });

  //   provide string queries and mutations
  query = gql`
    ${query}
  `;

  try {
    if (variables) {
      const data = await graphQLClient.request(query, variables);
      return data;
    }
    const data = await graphQLClient.request(query);
    return data;
  } catch (e) {
    console.log(JSON.stringify(e, undefined, 2));
    throw new Error(e.message, e);
  }
}
