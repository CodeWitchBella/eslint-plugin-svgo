/**
 * @fileoverview Runs svg embedded in JSX through svgo
 * @author Isabella Skořepová
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/svgo')
const RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
})
ruleTester.run('svgo', rule, {
  valid: [
    '<svg width="20" height="20"><circle cx="10" cy="10" r="5" fill="#7fffd4"/></svg>',
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: '<svg><circle cx="10" cy="10" r="5" fill="aquamarine" /></svg>',
      errors: [
        {
          message: 'Does not match SVGO output',
          type: 'JSXElement',
          output: '<svg><circle cx="10" cy="10" r="5" fill="#7fffd4"/></svg>',
        },
      ],
    },
  ],
})
