import SUT from "./vitest.config.js";

describe("default export: defineConfig", () => {
  describe("when called with no parameters", () => {
    it("should return the config object using all baked in defaults", () => {
      const result = SUT();

      expect(result).toBeInstanceOf(Object);
      expect(result.test).toBeInstanceOf(Object);
      expect(result.test).to.containSubset({
        globals: true,
        include: ["src/test/**/*.unit.ts", "src/test/**/*.e2e.ts"],
        reporters: ["verbose"],
      });

      expect(result.test?.coverage?.exclude).toContain("src/test/**/*");
    });
  });

  describe("when called with explicit excludes", () => {
    it("should pass user settings", () => {
      const result = SUT({
        include: ["my-super-pattern"],
        exclude: ["my-patterns"],
        reporters: ["custom-reporter"],
        coverage: { exclude: ["nothing/please"] },
      });

      expect(result).toBeInstanceOf(Object);

      expect(result.test).to.containSubset({
        include: ["my-super-pattern"],
        exclude: ["my-patterns"],
        reporters: ["custom-reporter"],
      });

      expect(result.test?.coverage?.exclude).toContain("nothing/please");
    });
  });
});
