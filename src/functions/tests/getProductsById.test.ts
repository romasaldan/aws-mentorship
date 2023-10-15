import { availableProducts } from "../../data/mockedProducts";
import { getProductsById } from "../getProductsById";
import { Context } from "aws-lambda";

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
  done(error?: Error, result?: any): void {
    return;
  },
  fail(error: Error | string): void {
    return;
  },
  succeed(messageOrObject: any): void {
    return;
  },
};
describe("getProductsById", () => {
  afterEach(() => {
    availableProducts.splice(0, availableProducts.length, ...availableProducts);
  });

  it("should return a product when it exists", async () => {
    const mockEvent = {
      pathParameters: { id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
    };

    const expectedProduct = availableProducts[0];

    const response = await getProductsById(mockEvent, mockedContext, () => {});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(expectedProduct);
  });

  it("should return status code 204 when product does not exist", async () => {
    const mockEvent = {
      pathParameters: { id: "nonexistent-id" },
    };

    const response = await getProductsById(mockEvent, mockedContext, () => {});

    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('{"error":"Product not found"}');
  });
});
