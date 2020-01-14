# babel-plugin-optimize-object-literals

Transforms object literals into JSON.parse calls.

```bash
npm install --save-dev babel-plugin-optimize-object-literals
```

## In
```js
// @stringify
const obj = { foo: 'bar' };
```

## Out
```js
const obj = JSON.parse(`{"foo":"bar"}`);
```
