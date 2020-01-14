module.exports = function({ types: t }) {
  return {
    name: "babel-plugin-optimize-object-literals",
    visitor: {
      ObjectExpression(path) {
        const { node: parentNode } = path.getStatementParent();
        if (parentNode.type !== "VariableDeclaration") {
          return;
        }
        if (!parentNode.leadingComments) {
          return;
        }
        // get the last comment from the leadingComments list
        // and trim it
        const comment = parentNode.leadingComments[
          parentNode.leadingComments.length - 1
        ].value.trim();
        if (comment !== "@stringify") {
          return;
        }
        const obj = convert(path.node, t);
        const parsed = JSON.stringify(obj)
          .replace(/\\n/g, "\\n")
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, "\\&")
          .replace(/\\r/g, "\\r")
          .replace(/\\t/g, "\\t")
          .replace(/\\b/g, "\\b")
          .replace(/\\f/g, "\\f");
        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier("JSON"), t.identifier("parse")),
            [
              t.templateLiteral(
                [t.templateElement({ raw: parsed, cooked: parsed })],
                []
              )
            ]
          )
        );
      }
    }
  };
};

// Copied from https://github.com/uetchy/babel-plugin-transform-object-literals
function convert(node, t) {
  if (node.type === "ObjectExpression") {
    return Object.fromEntries(
      node.properties.map(prop => {
        const key = t.isIdentifier(prop.key) ? prop.key.name : prop.key.value;
        const value = prop.value;
        return [key, convert(value, t)];
      })
    );
  } else if (node.type === "ArrayExpression") {
    return node.elements.map(itemNode => {
      return convert(itemNode, t);
    });
  } else {
    return node.value;
  }
}
