# SVGO for JSX

This eslint plugin adds single eslint rule `svgo/svgo`. It flags every occurence
of `<svg>` which was not optimized by SVGO. Also has autofix so that if you have
that turned on you can just copy-paste your svg into your editor.

## Installing

```
npm i -D eslint-plugin-svgo
```

Then add `svgo` to plugins section in your eslint config and
`"svgo/svgo": "warn"` to rules section of that config.
