import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import csvParser from "csv-parser";

const getCopyCommand = (key: string) =>
  new CopyObjectCommand({
    Bucket: "uploaded-romasaldan",
    CopySource: `uploaded-romasaldan/${key}`,
    Key: key.replace("uploaded", "parsed"),
  });

const getDeleteCommand = (key: string) =>
  new DeleteObjectCommand({
    Bucket: "uploaded-romasaldan",
    Key: key,
  });

const importFileParser = async (event: S3Event) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const s3Client = new S3Client({ region: "eu-north-1" });
        const stream = (
          await s3Client.send(
            new GetObjectCommand({
              Bucket: "uploaded-romasaldan",
              Key: record.s3.object.key,
            })
          )
        ).Body;

        return new Promise((resolve, reject) => {
          stream
            .pipe(csvParser())
            .on("data", (data) => {
              console.log("CSV file is being processed: ", data);
            })
            .on("error", (error) => {
              console.error("Error when parsed the file ", error);
              reject(error);
            })
            .on("end", async () => {
              console.log("Parsing of data is finished");

              await Promise.all([
                s3Client.send(getCopyCommand(record.s3.object.key)),
                s3Client.send(getDeleteCommand(record.s3.object.key)),
              ]);
              console.log(
                "the file has been copied to parsed folder and removed from uploaded folder"
              );
              resolve("success");
            });
        });
      })
    );

    return {
      message: "success",
    };
  } catch (error) {
    return { error };
  }
};

export const main = importFileParser;
