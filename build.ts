#!/usr/bin/env bun
import { existsSync } from 'node:fs'
import { cp, rm } from 'node:fs/promises'
import path from 'node:path'

const outdir = path.join(process.cwd(), 'dist')

if (existsSync(outdir)) {
  await rm(outdir, { force: true, recursive: true })
}

const result = await Bun.build({
  entrypoints: [path.join(process.cwd(), 'src/index.html')],
  minify: true,
  outdir,
  sourcemap: 'linked',
  target: 'browser',
})

if (!result.success) {
  for (const log of result.logs) {
    console.error(log)
  }

  process.exit(1)
}

if (existsSync('public')) {
  await cp('public', outdir, { recursive: true })
}

console.log(`Built ${result.outputs.length} files into ${outdir}`)
