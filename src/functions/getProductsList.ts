"use strict";

import { Handler } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Product, Stock } from "../models/Product";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDB({ region: "eu-north-1" });

export const getProducts = async () => {
  const products = await dynamo.scan({
    TableName: process.env.productTable as string,
  });
  return (products.Items?.map((product) => unmarshall(product)) ??
    []) as Product[];
};

export const getStocks = async () => {
  const stocks = await dynamo.scan({
    TableName: process.env.stocks as string,
  });

  return stocks.Items?.map((stock) => unmarshall(stock)) as Stock[];
};

export const getProductsList: Handler = async (event) => {
  console.log("call getProductsList");
  const requestOrigin = event.headers?.origin || "";
  let products: Product[] = [];
  let stocks: Stock[] = [];

  try {
    products = await getProducts();
    stocks = await getStocks();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error, type: "Database error" }),
    };
  }

  const productsWithModel =
    products?.map((product) => {
      const model = stocks?.find((stock) => stock.product_id === product.id);

      return {
        ...product,
        count: model?.count ?? 0,
      };
    }) ?? [];

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": requestOrigin,
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
    body: JSON.stringify(productsWithModel),
  };
};
