module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["core/**/*.js", "!core/web/app/**/*.js"]
};