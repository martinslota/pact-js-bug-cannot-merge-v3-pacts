"use strict";

const axios = require("axios");
const expect = require("chai").expect;
const { PactV3, SpecificationVersion } = require("@pact-foundation/pact");
const LOG_LEVEL = process.env.LOG_LEVEL || "DEBUG";
const { contractDirs } = require("../util.js");

describe("Test Pact.js", () => {
  const port1 = 8992;
  const port2 = 8993;

  const provider1 = new PactV3({
    port: port1,
    dir: contractDirs[0],
    spec: SpecificationVersion.SPECIFICATION_VERSION_V3,
    consumer: "MyConsumer",
    provider: "MyProvider",
    logLevel: LOG_LEVEL,
  });

  const provider2 = new PactV3({
    port: port2,
    dir: contractDirs[1],
    spec: SpecificationVersion.SPECIFICATION_VERSION_V3,
    consumer: "MyConsumer",
    provider: "MyProvider",
    logLevel: LOG_LEVEL,
  });

  function generateInteraction(index) {
    return {
      states: [{ description: `state ${index}` }],
      uponReceiving: `request`,
      withRequest: {
        method: "GET",
        path: `/${index}`,
      },
      willRespondWith: {
        status: 200,
      },
    };
  }

  describe("for first provider", function () {
    before(() => {
      provider1.addInteraction(generateInteraction(1));
    });

    it("works", async () => {
      await provider1.executeTest(async () => {
        const response = await axios.request({
          method: "GET",
          baseURL: `http://localhost:${port1}`,
          url: "/1",
        });
        expect(response.status).to.equal(200);
      });
    });
  });

  describe("for second provider", function () {
    before(() => {
      provider2.addInteraction(generateInteraction(2));
    });

    it("works", async () => {
      await provider2.executeTest(async () => {
        const response = await axios.request({
          method: "GET",
          baseURL: `http://localhost:${port2}`,
          url: "/2",
        });
        expect(response.status).to.equal(200);
      });
    });
  });
});
