const { pathsToModuleNameMapper } = require("ts-jest/utils")
const { compilerOptions } = require("./tsconfig")

module.exports = {
  // Test setup file
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  // Add type checking to Typescript test files
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom-fourteen",
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  testPathIgnorePatterns: ["/node_modules/", "/.blitz/", "/.next/", "<rootDir>/db/migrations"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$"],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
  // This makes absolute imports work
  moduleDirectories: ["node_modules", "<rootDir>/node_modules", "."],
  modulePathIgnorePatterns: [".blitz"],
  moduleNameMapper: {
    // This ensures any path aliases in tsconfig also work in jest
    ...pathsToModuleNameMapper(compilerOptions.paths || {}),
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$": "<rootDir>/test/__mocks__/fileMock.js",
  },
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  // Coverage output
  coverageDirectory: ".coverage",
  collectCoverageFrom: ["**/*.{js,jsx,ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
}
