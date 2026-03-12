const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  transformIgnorePatterns: [
    "node_modules/(?!@octokit/.*|fetch-blob|node-domexception|data-uri-to-buffer|formdata-polyfill)"
  ],
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
};