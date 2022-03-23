import React, { useRef, useEffect } from 'react'

import useGameState from './hooks/useGameState'
import { Ball, GamePlayState, GameState, Player } from './types'

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
  ctx.fillText(`Rally: ${gameState.Rally}`, 190, 50, 400)
  ctx.fillText(`MaxScore: ${gameState.MaxScore}`, 290, 50, 400)
  ctx.fillText(`Player 1: ${gameState.Player1.Score}`, 510, 50, 400)
  ctx.fillText(`Player 2: ${gameState.Player2.Score}`, 610, 50, 400)
  ctx.fillText(`PaddleSpeed: ${gameState.Player2.Speed}`, 50, 80, 400)
  ctx.fillText(`XVelocity: ${gameState.Ball.XVelocity}`, 200, 80, 400)
  ctx.fillText(`YVelocity: ${gameState.Ball.XVelocity}`, 320, 80, 400)
}

const draw = (
  prevFrameTimeStampRef: React.MutableRefObject<number>,
  gameState: GameState,
  ctx?: CanvasRenderingContext2D | null
) => {
  if (!ctx) {
    return
  }
  const now = performance.now()
  const diff = now - prevFrameTimeStampRef.current
  const currentFps = Math.round(1000 / diff)
  prevFrameTimeStampRef.current = now
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  drawBorders(ctx)
  drawPlayerPaddle(ctx, gameState.Player1)
  drawPlayerPaddle(ctx, gameState.Player2)
  drawBall(ctx, gameState.Ball)
  drawStats(ctx, gameState, currentFps)

  drawGameState(ctx, gameState)
}

const Canvas: React.FC<
  React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >
> = (props) => {
  const gameStateRef = useGameState()
  const canvasRef: React.LegacyRef<HTMLCanvasElement> = useRef(null)
  const prevFrameTimeStampRef = useRef(performance.now())

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    let animationFrameId: number

    //Our draw came here
    const render = () => {
      draw(prevFrameTimeStampRef, gameStateRef.current, context)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
