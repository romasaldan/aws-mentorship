"use strict";

import { Handler } from "aws-lambda";
import { availableProducts } from "../data/mockedProducts";

export const getProductsList: Handler = async (event) => {
  const requestOrigin = event.headers.origin || "";

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": requestOrigin,
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
    body: JSON.stringify(availableProducts, null, 2),
  };
};
