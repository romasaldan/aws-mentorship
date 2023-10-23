"use strict";

import { Handler } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Product, Stock } from "../models/Product";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDB({ region: "eu-north-1" });

export const getProduct = async (id: string) => {
  const product = await dynamo.getItem({
    TableName: process.env.productTable as string,
    Key: { id: { S: id } },
  });

  return product.Item ? (unmarshall(product.Item) as Product) : undefined;
};

export const getStock = async (id: string) => {
  const stock = await dynamo.getItem({
    TableName: process.env.stocks as string,
    Key: { product_id: { S: id } },
  });

  return stock.Item ? (unmarshall(stock.Item) as Stock) : undefined;
};

export const getProductsById: Handler = async (event) => {
  const productId = event.pathParameters?.id;
  console.log("call getProductsById productId=", productId);
  const requestOrigin = event.headers?.origin || "";
  let product: Product | undefined;
  let stock: Stock | undefined;

  try {
    product = await getProduct(productId);
    stock = await getStock(productId);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error, type: "Database error" }),
    };
  }

  if (product) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": requestOrigin,
        "Access-Control-Allow-Methods": "OPTIONS,GET",
      },
      body: JSON.stringify({ ...product, count: stock?.count ?? 0 }),
    };
  }

  return {
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": requestOrigin,
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
    body: JSON.stringify({ error: "Product not found" }),
  };
};
