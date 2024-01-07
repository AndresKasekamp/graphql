// Stored GraphQL queries
import { gql } from "graphql-request";

/**
 * Getting users first and last name
 */
const getName = () => {
  const query = gql`
    query getName {
      user {
        firstName
        lastName
        id
        createdAt,
        attrs
      }
    }
  `;

  return query;
};

/**
 * Getting succesful audits count
 */
const getAuditCount = () => {
  const query = gql`
    query getAuditCount {
      user {
        audits_aggregate(where: { grade: { _is_null: false } }) {
          aggregate {
            count
          }
        }
      }
    }
  `;

  return query;
};

const getUpDownAmount = () => {
  const query = gql`
    query getUpDownAmounts {
      downAmount: transaction_aggregate(
        where: {
          type: { _eq: "down" }
          event: { path: { _eq: "/johvi/div-01" } }
        }
      ) {
        aggregate {
          sum {
            amount
          }
        }
      }
      upAmount: transaction_aggregate(
        where: {
          type: { _eq: "up" }
          event: { path: { _eq: "/johvi/div-01" } }
        }
      ) {
        aggregate {
          sum {
            amount
          }
        }
      }
      xpAmount: transaction_aggregate(
        where: {
          type: { _eq: "xp" }
          event: { path: { _eq: "/johvi/div-01" } }
        }
      ) {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  `;

  return query;
};

const getXPprogression = () => {
  const query = gql`
    query xpProgression {
      transaction(
        where: {
          type: { _eq: "xp" }
          event: { path: { _eq: "/johvi/div-01" } }
        }
        order_by: { createdAt: asc }
      ) {
        amount
        createdAt
      }
    }
  `;

  return query;
};

const getSuccesfulAuditors = (userID) => {
  const query = gql`
    query getSuccesfulAuditors {
      audit(where: {
      grade: {_is_null: false}
    	auditorId: {_neq: ${userID}}
    }) {
        auditorLogin
        }
    }`;

  return query;
};

export {
  getName,
  getAuditCount,
  getUpDownAmount,
  getXPprogression,
  getSuccesfulAuditors,
};
