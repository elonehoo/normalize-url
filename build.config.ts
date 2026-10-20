import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  hooks: {
    'rollup:done': async function (ctx) {
      // unbuild 3 emits an invalid export= plus a separate Options type export.
      // A merged function/namespace retains the callable CommonJS API and type.
      // Fail closed if the upstream declaration shape changes instead of hiding it.
      const original = 'export = normalizeUrl;\nexport type { Options };'
      const replacement = `type NormalizeUrlOptions = Options;
declare namespace normalizeUrl {
  export type Options = NormalizeUrlOptions;
}
export = normalizeUrl;`
      for (const file of ['index.d.ts', 'index.d.cts']) {
        const path = resolve(ctx.options.rootDir, ctx.options.outDir, file)
        const declaration = await readFile(path, 'utf8')
        if (declaration.split(original).length !== 2)
          throw new Error(`Unexpected declaration exports in ${file}; review the CommonJS type adapter`)
        await writeFile(path, declaration.replace(original, replacement))
      }
    },
  },
})
