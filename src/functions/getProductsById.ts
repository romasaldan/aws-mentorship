"use strict";

import { Handler } from "aws-lambda";
import { availableProducts } from "../data/mockedProducts";

export const getProductsById: Handler = async (event) => {
  const productId = event.pathParameters.id;
  const product = availableProducts.find((product) => product.id === productId);
  const requestOrigin = event.headers.origin || "";

  if (product) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": requestOrigin,
        "Access-Control-Allow-Methods": "OPTIONS,GET",
      },
      body: JSON.stringify(product, null, 2),
    };
  }

  return {
    statusCode: 204,
    body: "",
  };
};
