import React, { useRef, useEffect } from 'react'

import useGameState from './hooks/useGameState'
import { Ball, GameState, Player } from './types'

let MAX_FPS = 60

const drawPlayerPaddle = (ctx: CanvasRenderingContext2D, paddle: Player) => {
  ctx.fillRect(paddle.X, paddle.Y, paddle.Width, paddle.Height)
  ctx.fillStyle = '#fff'
  ctx.closePath()
}

const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.beginPath()

  ctx.arc(ball.X, ball.Y, ball.Radius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'

  ctx.fill()
  ctx.closePath()
}

const Canvas: React.FC<
  React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >
> = (props) => {
  const gameStateRef = useGameState()
  const canvasRef: React.LegacyRef<HTMLCanvasElement> = useRef(null)
  const beRef = useRef(performance.now())
  const draw = (ctx?: CanvasRenderingContext2D | null, frameCount?: number) => {
    if (!ctx) {
      return
    }
    const now = performance.now()
    const interval = 1000 / MAX_FPS
    const diff = now - beRef.current
    if (diff > interval) {
      const currentFps = Math.round(1000 / (now - beRef.current))
      beRef.current = now - (diff % interval)
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillText(String(currentFps), 100, 100, 200)
      drawPlayerPaddle(ctx, gameStateRef.current.Player1)
      drawPlayerPaddle(ctx, gameStateRef.current.Player2)
      drawBall(ctx, gameStateRef.current.Ball)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    let frameCount = 0
    let animationFrameId: number

    //Our draw came here
    const render = () => {
      frameCount++

      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} {...props} width={800} height={600} />
}

export default Canvas
