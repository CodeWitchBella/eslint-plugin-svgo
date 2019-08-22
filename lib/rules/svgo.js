/**
 * @fileoverview Runs svg embedded in JSX through svgo
 * @author Isabella Skořepová
 */
'use strict'

const kebabCase = require('lodash.kebabcase')
const { spawnSync } = require('child_process')
const { Readable } = require('stream')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function assertType(ast, type) {
  if (ast.type !== type) {
    console.log(ast)
    const err = new Error('Expected ' + type + ' got ' + ast.type)
    err.ast = ast
    throw err
  }
}

function serializeAttributeName(name) {
  if (name === 'className') return 'class'
  if (['viewBox'].includes(name)) return name
  return kebabCase(name)
}

function serializeAttribute(ast) {
  assertType(ast, 'JSXAttribute')
  if (ast.value.type === 'JSXExpressionContainer') throw 'skip'
  assertType(ast.value, 'Literal')
  assertType(ast.name, 'JSXIdentifier')

  return serializeAttributeName(ast.name.name) + '=' + ast.value.raw
}

function serializeOpening(ast) {
  assertType(ast, 'JSXOpeningElement')
  assertType(ast.name, 'JSXIdentifier')

  return (
    ['<' + ast.name.name, ...ast.attributes.map(serializeAttribute)].join(' ') +
    (ast.selfClosing ? '/' : '') +
    '>'
  )
}

function serializeClosing(ast) {
  if (!ast) return ''
  assertType(ast, 'JSXClosingElement')
  assertType(ast.name, 'JSXIdentifier')

  return '</' + ast.name.name + '>'
}

function serializeJSXElement(ast) {
  if (ast.type === 'JSXText') {
    if (ast.value.trim() === '') return
    else {
      const err = new Error('svg may not contain direct text')
      err.ast = ast
      throw err
    }
  }
  assertType(ast, 'JSXElement')
  const start = serializeOpening(ast.openingElement)
  const middle = ast.children.map(serializeJSXElement).join('')
  const end = serializeClosing(ast.closingElement)
  return start + middle + end
}

const plugins = ['removeXMLNS']

function svgo(text) {
  const input = new Readable()
  input.push(text)
  input.push(null)
  const p = spawnSync(
    process.argv[0],
    [
      require.resolve('svgo/bin/svgo'),
      ...plugins.map(p => '--enable=' + p),
      '-i',
      '-',
    ],
    {
      input: text,
    },
  )
  if (p.status !== 0) {
    console.error(p.stderr.toString('utf8'))
    throw new Error('SVGO failed')
  }
  return p.stdout.toString('utf8').trim()
}

module.exports = {
  meta: {
    docs: {
      description: 'Runs svg embedded in JSX through svgo',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: 'code', // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    return {
      JSXElement(node) {
        if (node.openingElement.name.name !== 'svg') return

        try {
          const serialized = serializeJSXElement(node)
          const shorter = svgo(serialized)

          if (serialized !== shorter) {
            context.report({
              node,
              message: 'Does not match SVGO output',

              fix(fixer) {
                return fixer.replaceText(
                  node,
                  shorter.replace(/class=/g, 'className='),
                )
              },
            })
          }
        } catch (e) {
          if (e === 'skip') return
          context.report({ node: e.ast || node, message: e.message })
        }
      },
    }
  },
}
