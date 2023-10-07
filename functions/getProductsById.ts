"use strict";

import { Handler } from "aws-lambda";
import { availableProducts } from "../data/mockedProducts";

export const getProductsById: Handler = async (event) => {
  const productId = event.pathParameters.id;
  const product = availableProducts.find((product) => product.id === productId);

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product, null, 2),
    };
  }

  return {
    statusCode: 204,
    body: "",
  };
};
