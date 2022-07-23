import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const END_POINT = "https://api.studio.thegraph.com/query/9399/daitoken/0.0.5";

const TOP10_QUERY = `
{
    users(first: 10, orderBy: balance, orderDirection: desc) {
      id
      address
      balance
      transactionCount
    }
  }
`;

export const TokenStats = () => {
  const { data, isLoading, error } = useQuery(["users"], async () => {
    const response = await axios({
      url: END_POINT,
      method: "POST",
      data: {
        query: TOP10_QUERY,
      },
    });
    return response.data.data;
  });

  if (isLoading) return <p>Loading.......</p>;
  if (error) return <pre>{error.message}</pre>;

  return (
    <div>
      <p>Top 10 Account Balance of Dai Token Holders</p>
      {!isLoading &&
        data?.users?.map(
          ({ address, balance, id, transactionCount }, index) => {
            return (
              <div className="display-top" key={id} data-count={index + 1}>
                <div className="para-div">
                  <p>Address:</p>

                  <p>{address}</p>
                </div>

                <div className="para-div">
                  <p>Account Balance:</p>

                  <p>{balance / 1e18}</p>
                </div>

                <div className="para-div">
                  <p>Number of Transactions:</p>
                  <p>{transactionCount}</p>
                </div>
              </div>
            );
          }
        )}
    </div>
  );
};