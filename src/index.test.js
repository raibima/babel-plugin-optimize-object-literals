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

it("should work even when there are more than 1 leading comments", () => {
  const { code } = babel.transform(
    `
    // john
    // doe
    // @stringify
    const obj = { foo: 'bar' };
  `,
    { plugins: [plugin] }
  );
  expect(code).toMatchInlineSnapshot(`
    "// john
    // doe
    // @stringify
    const obj = JSON.parse(\`{\\"foo\\":\\"bar\\"}\`);"
  `);
});

it("should work with \\n character (produces valid output)", () => {
  const { code } = babel.transform(
    `
    // @stringify
    const obj = { foo: '\\n bar \\n' };
  `,
    { plugins: [plugin] }
  );
  expect(code).toMatchInlineSnapshot(`
    "// @stringify
    const obj = JSON.parse(\`{\\"foo\\":\\"\\\\n bar \\\\n\\"}\`);"
  `);
});
