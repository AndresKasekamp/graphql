import { GraphQLClient, request, gql } from "graphql-request";

/**
 * Constructing graphql query and client
 * @param {string} jwtToken - jwtToken during app life-cycle
 * @param {string} query - graph ql query to use from store
 */
const constructGraphQLQuery = async (jwtToken, query) => {
  const client = new GraphQLClient(
    "https://01.kood.tech/api/graphql-engine/v1/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  const response = await client.request(query);
  return response;
};

export { constructGraphQLQuery };
