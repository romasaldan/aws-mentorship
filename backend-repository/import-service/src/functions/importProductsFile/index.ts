import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        authorizer: {
          arn: "arn:aws:lambda:eu-north-1:332213976395:function:authorization-service-dev-basicAuthorizer",
          type: "request",
        },
      },
    },
  ],
};
