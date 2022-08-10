const Fs = require('fs')
const Path = require('path')
const Sass = require('node-sass')

const getComponents = () => {
  let allComponents = []

  const types = ['atoms', 'molecules', 'organisms']

  types.forEach((type) => {
    const allFiles = Fs.readdirSync(`src/${type}`).map((file) => ({
      input: `src/${type}/${file}`,
      output: `lib/${file.slice(0, -4) + 'css'}`,
    }))

    allComponents = [...allComponents, ...allFiles]
  })

  return allComponents
}

const compile = (path, fileName) => {
  const result = Sass.renderSync({
    data: Fs.readFileSync(Path.resolve(path)).toString(),
    outputStyle: 'expanded',
    outFile: 'global.css',
    includePaths: [Path.resolve('src')],
  }).css.toString()

  Fs.writeFileSync(Path.resolve(fileName), result)
}

compile('src/global.scss', 'lib/global.css')

getComponents().forEach((component) => {
  compile(component.input, component.output)
})
