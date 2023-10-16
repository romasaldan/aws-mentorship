import { DynamoDB, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { initialProducts } from "../data/mockedProducts";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDB({ region: "eu-north-1" });

const getParams = (
  item: Record<string, string | number>
): PutItemCommandInput => ({
  TableName: "productTable",
  Item: marshall(item),
});

const post = (params: PutItemCommandInput) => {
  dynamo.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
};

initialProducts.forEach((product) => {
  console.log(getParams(product));
  post(getParams(product));
});
