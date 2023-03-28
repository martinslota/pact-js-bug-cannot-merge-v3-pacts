import { Publisher } from "@pact-foundation/pact-core";
import { contractDirs } from "./util.js";

const publisher = new Publisher({
  pactBroker: "http://localhost:9292",
  pactFilesOrDirs: contractDirs,
  consumerVersion: "1",
});

await publisher.publish();
