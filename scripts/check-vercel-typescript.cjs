const ts = require('typescript')

if (typeof ts.sys?.readFile !== 'function') {
  console.error(
    'The installed TypeScript version is incompatible with @vercel/node: ' +
      'typescript must export sys.readFile.',
  )
  process.exit(1)
}
