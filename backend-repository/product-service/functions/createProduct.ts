"use strict";

import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Product } from "../models/Product";

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const addProduct = async (item: Product) => {
  const command = new PutCommand({
    TableName: process.env.productTable as string,
    Item: item,
  });

  const response = await docClient.send(command);
  return response;
};

export const createProduct: Handler = async (event) => {
  const body = JSON.parse(event.body);

  if (!body.id || typeof body.id !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "please specify id because it is a key value of the table",
      }),
    };
  }

  try {
    await addProduct(body);

    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error, type: "Database error", body }),
    };
  }
};
