import { importProductsFile } from "./handler"; // Import your Lambda function here
import awsMock from "aws-sdk-mock";
import { APIGatewayProxyResult, Context } from "aws-lambda";
import { JSONSchema } from "json-schema-to-ts";
import { ValidatedAPIGatewayProxyEvent } from "../../libs/api-gateway";

const mockedContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "mocked",
  functionVersion: "mocked",
  invokedFunctionArn: "mocked",
  memoryLimitInMB: "mocked",
  awsRequestId: "mocked",
  logGroupName: "mocked",
  logStreamName: "mocked",
  getRemainingTimeInMillis(): number {
    return 999;
  },
  done(): void {
    return;
  },
  fail(): void {
    return;
  },
  succeed(): void {
    return;
  },
};

describe("importProductsFile Lambda Function", () => {
  // Set up AWS SDK mock before each test
  beforeEach(() => {
    awsMock.mock("S3", "putObject", (_, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    awsMock.restore("S3");
  });

  it("should return a signed URL", async () => {
    const event = {
      queryStringParameters: {
        filename: "example.csv",
      },
    };

    const response = (await importProductsFile(
      event as unknown as ValidatedAPIGatewayProxyEvent<JSONSchema>,
      mockedContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty("signedUrl");
  });

  it.skip("should handle errors and return a 400 response", async () => {
    const event = {
      queryStringParameters: {
        filename: "example.csv",
      },
    };

    // Mock an error by rejecting the S3 operation
    awsMock.mock("S3", "putObject", () => {
      throw Error("Mock S3 error");
    });

    const response = (await importProductsFile(
      event as unknown as ValidatedAPIGatewayProxyEvent<JSONSchema>,
      mockedContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty(
      "message",
      "Mock S3 error"
    );
  });
});
