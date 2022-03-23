import React, { useRef, useEffect } from 'react'

import useGameState from './hooks/useGameState'
import { Ball, GamePlayState, GameState, Player } from './types'

let MAX_FPS = 60
let PADDING = 20
const drawPlayerPaddle = (ctx: CanvasRenderingContext2D, paddle: Player) => {
  ctx.fillRect(
    paddle.X + PADDING / 2,
    paddle.Y - paddle.Height / 2 + PADDING / 2,
    paddle.Width,
    paddle.Height
  )
  ctx.fillStyle = '#fff'
}

const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.beginPath()

  ctx.arc(ball.X + PADDING, ball.Y + PADDING / 2, ball.Radius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'

  ctx.fill()
  ctx.closePath()
}
const drawBorders = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 20
}

const GamePlayStateTexts: Partial<Record<GamePlayState, string>> = {
  [GamePlayState.StartState]: 'START GAME / PRESS SPACE',
  [GamePlayState.GameOverState]: 'GAME OVER / PRESS SPACE to restart',
}

const drawGameState = (ctx: CanvasRenderingContext2D, gameState: GameState) => {
  const textToRender = GamePlayStateTexts[gameState.State as GamePlayState]
  if (textToRender) {
    ctx.font = '20px Arial'

    ctx.fillStyle = 'whitesmoke'
    ctx.fillText(
      textToRender,
      ctx.canvas.width / 2 - textToRender.length * 5,
      200,
      400
    )
  }
}

const drawStats = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  fps: number
) => {
  ctx.font = '16px Arial'
  ctx.fillText(`Fps: ${fps}`, 50, 50, 400)
  ctx.fillText(`Level: ${gameState.Level}`, 110, 50, 400)
  ctx.fillText(`Rally: ${gameState.Rally}`, 175, 50, 400)
  ctx.fillText(`MaxScore: ${gameState.MaxScore}`, 240, 50, 400)
  ctx.fillText(`Player 1: ${gameState.Player1.Score}`, 350, 50, 400)
  ctx.fillText(`Player 2: ${gameState.Player2.Score}`, 430, 50, 400)
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

      drawBorders(ctx)
      drawPlayerPaddle(ctx, gameStateRef.current.Player1)
      drawPlayerPaddle(ctx, gameStateRef.current.Player2)
      drawBall(ctx, gameStateRef.current.Ball)
      drawStats(ctx, gameStateRef.current, currentFps)

      drawGameState(ctx, gameStateRef.current)
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

  return (
    <canvas
      ref={canvasRef}
      {...props}
      width={800 + PADDING}
      height={600 + PADDING}
    />
  )
}

export default Canvas
