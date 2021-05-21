const hexToRgb = (h) => {
  let r = 0
  let g = 0
  let b = 0

  if (h.length === 4) {
    r = '0x' + h[1] + h[1]
    g = '0x' + h[2] + h[2]
    b = '0x' + h[3] + h[3]
  } else if (h.length === 7) {
    r = '0x' + h[1] + h[2]
    g = '0x' + h[3] + h[4]
    b = '0x' + h[5] + h[6]
  }
  return `${+r}, ${+g}, ${+b}`
}

const generateRgbVar = (name, color) => {
  const colorRgb = hexToRgb(color)
  if (!colorRgb.includes('NaN')) {
    document.documentElement.style.setProperty(`--v-${name}-rgb`, colorRgb)
  }
}

const createRgbVarsForThemes = (themes) => {
  console.log('Raaaaaaan')
  Object.keys(themes).forEach((tKey) => {
    const theme = themes[tKey]
    Object.keys(theme).forEach((key) => {
      const colors = theme[key]
      if (typeof colors === 'object') {
        Object.keys(colors).forEach((colorKey) => {
          const color = colors[colorKey]
          generateRgbVar(`${key}-${colorKey}`, color)
        })
      } else {
        generateRgbVar(key, colors)
      }
    })
  })
}

module.exports = {
  hexToRgb,
  generateRgbVar,
  createRgbVarsForThemes,
}
