# Runs svg embedded in JSX through svgo (svgo)

SVGO is able to shorten SVGs, but that is not available in JSX

## Rule Details

This rule aims to remedy that...

Examples of **incorrect** code for this rule:

```js
<svg>
  <circle cx="10" cy="10" r="5" fill="aquamarine" />
</svg>
```

Examples of **correct** code for this rule:

```js
<svg>
  <circle cx="10" cy="10" r="5" fill="#7fffd4" />
</svg>
```

### Options

No options

## When Not To Use It

When you do not want your jsx to be shorter or you run into bugs :-)

## Further Reading

...
