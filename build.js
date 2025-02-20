const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/entry.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  platform: 'node',
  format: 'esm',
  loader: { '.js': 'jsx' },
}).catch(() => process.exit(1));