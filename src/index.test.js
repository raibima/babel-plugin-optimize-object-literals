const babel = require("@babel/core");
const plugin = require("./index");

it("transforms object literals with @stringify directive", () => {
  const { code } = babel.transform(
    `
    // @stringify
    const obj = { foo: 'bar' };
  `,
    { plugins: [plugin] }
  );
  expect(code).toMatchInlineSnapshot(`
    "// @stringify
    const obj = JSON.parse(\`{\\"foo\\":\\"bar\\"}\`);"
  `);
});

it("doesn't transform object literals with no @stringify directive", () => {
  const { code } = babel.transform(
    `
    const obj = { foo: 'bar' };
  `,
    { plugins: [plugin] }
  );
  expect(code).toMatchInlineSnapshot(`
    "const obj = {
      foo: 'bar'
    };"
  `);
});
