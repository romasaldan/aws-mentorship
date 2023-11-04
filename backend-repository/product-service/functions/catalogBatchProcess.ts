"use strict";

import { Handler, SQSEvent } from "aws-lambda";
import { Product } from "../models/Product";
import { addProduct } from "./createProduct";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sendData = async (product: Product) => {
  const snsClient = new SNSClient({ region: "eu-north-1" });

  try {
    const response = await snsClient.send(
      new PublishCommand({
        TopicArn: "arn:aws:sns:eu-north-1:332213976395:createProductTopic",
        Message: `The product ${JSON.stringify(product)} has been added`,
        Subject: "The new product has been added",
      })
    );

    return response;
  } catch (e) {
    console.log("SNS Error: ", e);
  }
};

export const catalogBatchProcess: Handler = async (event: SQSEvent) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const product = JSON.parse(record.body) as unknown as Product;

        await addProduct(product);
        await sendData(product);

        return Promise.resolve("success");
      })
    );

    return {
      message: "success",
    };
  } catch (error) {
    console.log("error", error);
    return { error };
  }
};
