"use strict";

import { Handler } from "aws-lambda";
import { availableProducts } from "../data/mockedProducts";

export const getProductsList: Handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(availableProducts, null, 2),
  };
};
