import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

function stringToHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

function hashToColors(hash) {
  const baseHue = (hash * 137.508) % 360
  const frostingHue = (baseHue + 120) % 360
  const decorationHue = (baseHue + 240) % 360

  return {
    base: `hsl(${baseHue}, 70%, 50%)`,
    frosting: `hsl(${frostingHue}, 80%, 70%)`,
    decoration: `hsl(${decorationHue}, 90%, 60%)`,
    cherry: '#ff0040',
    candle: '#ffff00',
    candleBase: '#8B4513',
    flame: '#ff6600'
  }
}

function getCakePattern(hash) {
  const binary = hash.toString(2).padStart(64, '0')
  const layers = 2 + (hash % 3)
  const hasCandles = true
  const decorationPattern = binary.slice(1, 9)
  const cherryPattern = binary.slice(9, 13)

  return {
    layers,
    hasCandles,
    decorationPattern,
    cherryPattern,
    cakeType: hash % 4
  }
}

const CakeCanvas = forwardRef(({ seed, showCandles }, ref) => {
  const canvasRef = useRef(null)
  const [frameCount, setFrameCount] = useState(0)

  useImperativeHandle(ref, () => ({
    downloadImage(filename = 'cake.png') {
      const canvas = canvasRef.current
      const link = document.createElement('a')
      link.download = filename
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }))

  useEffect(() => {
    if (!seed.trim()) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const gridSize = 16
    const pixelSize = canvas.width / gridSize
    const hash = stringToHash(seed)
    const colors = hashToColors(hash)
    const pattern = getCakePattern(hash)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawPixelCake(ctx, gridSize, pixelSize, colors, pattern, frameCount)
  }, [seed, showCandles, frameCount])

  useEffect(() => {
    if (!seed.trim() || !showCandles) return

    const animationId = requestAnimationFrame(() => {
      setFrameCount(prev => prev + 1)
    })

    return () => cancelAnimationFrame(animationId)
  }, [frameCount, seed, showCandles])

  function drawPixelCake(ctx, gridSize, pixelSize, colors, pattern, frameCount) {
    const { layers, hasCandles, decorationPattern, cherryPattern, cakeType } = pattern

    drawCakeLayer(ctx, pixelSize, 12, 14, 2, 13, colors.base, colors.frosting)
    if (layers >= 2) {
      drawCakeLayer(ctx, pixelSize, 8, 11, 4, 11, colors.base, colors.frosting)
    }
    if (layers >= 3) {
      drawCakeLayer(ctx, pixelSize, 5, 7, 5, 10, colors.base, colors.frosting)
    }

    addDecorations(ctx, pixelSize, colors, decorationPattern, cherryPattern)

    if (hasCandles && showCandles) {
      addCandles(ctx, pixelSize, colors, layers, frameCount)
    }

    addSpecialEffects(ctx, pixelSize, colors, cakeType)
  }

  function drawCakeLayer(ctx, pixelSize, startRow, endRow, startCol, endCol, baseColor, frostingColor) {
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        ctx.fillStyle = baseColor
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize)
      }
    }
    for (let col = startCol; col <= endCol; col++) {
      ctx.fillStyle = frostingColor
      ctx.fillRect(col * pixelSize, (startRow - 1) * pixelSize, pixelSize, pixelSize)
    }
  }

  function addDecorations(ctx, pixelSize, colors, decorationPattern, cherryPattern) {
    const decorationPositions = [
      { row: 11, col: 4 }, { row: 11, col: 7 }, { row: 11, col: 10 },
      { row: 7, col: 5 }, { row: 7, col: 9 },
      { row: 4, col: 6 }, { row: 4, col: 8 }
    ]
    decorationPositions.forEach((pos, index) => {
      if (decorationPattern[index] === '1') {
        ctx.fillStyle = colors.decoration
        ctx.fillRect(pos.col * pixelSize, pos.row * pixelSize, pixelSize, pixelSize)
      }
    })
    const cherryPositions = [
      { row: 10, col: 6 }, { row: 10, col: 9 },
      { row: 6, col: 7 }, { row: 3, col: 7 }
    ]
    cherryPositions.forEach((pos, index) => {
      if (cherryPattern[index] === '1') {
        ctx.fillStyle = colors.cherry
        ctx.fillRect(pos.col * pixelSize, pos.row * pixelSize, pixelSize, pixelSize)
      }
    })
  }

  // ✅ You already have this working — untouched
  function addCandles(ctx, pixelSize, colors, layers, frameCount) {
    const frostingRows = { 1: 11, 2: 7, 3: 4 }
    const topFrostingRow = frostingRows[layers] || 4

    const candleCount = 2

    let topLayerStartCol, topLayerEndCol
    if (layers >= 3) {
      topLayerStartCol = 5
      topLayerEndCol = 10
    } else if (layers === 2) {
      topLayerStartCol = 4
      topLayerEndCol = 11
    } else {
      topLayerStartCol = 2
      topLayerEndCol = 13
    }

    const centerCol = Math.floor((topLayerStartCol + topLayerEndCol) / 2)
    const spacing = 2
    const startCol = centerCol - Math.floor((candleCount - 1) * spacing / 2) + 0.5

    for (let i = 0; i < candleCount; i++) {
      const col = startCol + (i * spacing)
      const candleBottomRow = topFrostingRow - 1
      const candleTopRow = candleBottomRow - 1

      ctx.fillStyle = colors.candleBase
      ctx.fillRect(col * pixelSize, candleTopRow * pixelSize, pixelSize, pixelSize)
      ctx.fillRect(col * pixelSize, candleBottomRow * pixelSize, pixelSize, pixelSize)

      const flameX = (col + 0.5) * pixelSize
      const flameY = (candleTopRow - 0.2) * pixelSize
      const flameSize = 0.4 + Math.abs(Math.sin((frameCount + i * 30) * 0.08)) * 0.2
      const flameRadius = pixelSize * flameSize

      ctx.save()
      ctx.shadowBlur = 15
      ctx.shadowColor = colors.flame
      ctx.fillStyle = colors.flame
      ctx.beginPath()
      ctx.arc(flameX, flameY, flameRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  function addSpecialEffects(ctx, pixelSize, colors, cakeType) {
    switch (cakeType) {
      case 0: addSparkles(ctx, pixelSize, colors); break
      case 1: addBorder(ctx, pixelSize, colors); break
      case 2: addHearts(ctx, pixelSize, colors); break
      case 3: addStars(ctx, pixelSize, colors); break
    }
  }

  function addSparkles(ctx, pixelSize, colors) {
    const sparklePositions = [
      { row: 1, col: 3 }, { row: 2, col: 12 },
      { row: 6, col: 2 }, { row: 9, col: 14 }
    ]
    sparklePositions.forEach(pos => {
      ctx.fillStyle = colors.candle
      ctx.fillRect(pos.col * pixelSize, pos.row * pixelSize, pixelSize, pixelSize)
    })
  }

  function addBorder(ctx, pixelSize, colors) {
    for (let col = 1; col <= 14; col++) {
      if (col % 2 === 0) {
        ctx.fillStyle = colors.decoration
        ctx.fillRect(col * pixelSize, 15 * pixelSize, pixelSize, pixelSize)
      }
    }
  }

  function addHearts(ctx, pixelSize, colors) {
    const heartPositions = [
      { row: 5, col: 3 }, { row: 8, col: 12 }
    ]
    heartPositions.forEach(pos => {
      ctx.fillStyle = '#ff69b4'
      ctx.fillRect(pos.col * pixelSize, pos.row * pixelSize, pixelSize, pixelSize)
    })
  }

  function addStars(ctx, pixelSize, colors) {
    const starPositions = [
      { row: 1, col: 2 }, { row: 3, col: 13 }, { row: 7, col: 1 }
    ]
    starPositions.forEach(pos => {
      ctx.fillStyle = '#00ffff'
      ctx.fillRect(pos.col * pixelSize, pos.row * pixelSize, pixelSize, pixelSize)
    })
  }

  return (
    <canvas
      ref={canvasRef}
      width={250}
      height={250}
      className="avatar-canvas"
    />
  )
})

export default CakeCanvas
