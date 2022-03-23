import { useEffect, useRef } from 'react'

import { CloseState, GameState } from '../types'
import ws from '../utils/websocket'
import defaultState from '../state-mock.json'
import { isEqual } from 'lodash'

enum KeyState {
  UP = 0,
  DOWN = 1,
}

enum EbitenKeyCodes {
  S = 28,
  W = 32,
  UP = 102,
  DOWN = 42,
  SPACE = 100,
}

const allowedKeys = ['s', 'w', 'S', 'W', ' ', 'ArrowUp', 'ArrowDown'] as const
const keysToEbitenKeyCodes: Record<typeof allowedKeys[number], number> = {
  S: EbitenKeyCodes.S,
  s: EbitenKeyCodes.S,
  W: EbitenKeyCodes.W,
  w: EbitenKeyCodes.W,
  ArrowDown: EbitenKeyCodes.DOWN,
  ArrowUp: EbitenKeyCodes.UP,
  ' ': EbitenKeyCodes.SPACE,
}

const useGameState = () => {
  const gameStateRef = useRef<GameState>(defaultState)

  const setup = () => {
    // timeout to make the apperance nicer as if you are connecting to play

    ws.connect()
    document.addEventListener('keydown', ({ key }) => {
      if (allowedKeys.includes(key as typeof allowedKeys[number])) {
        ws.send({
          action: KeyState.DOWN,
          key: keysToEbitenKeyCodes[key as typeof allowedKeys[number]],
        })
      }
    })

    document.addEventListener('keyup', ({ key }) => {
      if (allowedKeys.includes(key as typeof allowedKeys[number])) {
        ws.send({
          action: KeyState.UP,
          key: keysToEbitenKeyCodes[key as typeof allowedKeys[number]],
        })
      }
    })

    ws.onMessage<string>((event) => {
      const data: GameState | CloseState = JSON.parse(event.data)
      if ((data as CloseState).Text) {
        gameStateRef.current.Placeholder = `${(data as CloseState).Text}`
      } else if (!isEqual(gameStateRef.current, data as GameState)) {
        gameStateRef.current = data as GameState
      }
    })

    ws.onListener('error', (err) => {
      console.log(err)
      gameStateRef.current.Placeholder =
        'Something wrong happened!\n Refresh site'
    })
  }

  const mockLoadingState = () =>
    new Promise((resolve) => {
      const timer = window.setInterval(() => {
        const { Placeholder } = gameStateRef.current

        if (
          Placeholder.includes('Connecting') &&
          !Placeholder.includes('...')
        ) {
          gameStateRef.current.Placeholder = `${Placeholder}.`
          return
        } else if (Placeholder.includes('Connecting...')) {
          gameStateRef.current.Placeholder = `Game ready!`
        } else {
          console.log(gameStateRef.current.Placeholder)
          resolve(timer)

          window.clearInterval(timer)
        }
      }, 1000)
    })
  useEffect(() => {
    mockLoadingState().then(() => setup())
  }, [])
  return gameStateRef
}

export default useGameState
