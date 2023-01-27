import "dotenv/config";
import { InquirerClient } from "./core/InquirerClient.js";

const client = new InquirerClient();
client.start();
