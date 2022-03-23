import { useEffect, useRef } from 'react'

import { GameState } from '../types'
import Socket from '../utils/websocket'
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

  useEffect(() => {
    setTimeout(() => {
      // timeout to make the apperance nicer as if you are connecting to play
      const socket = new Socket()

      document.addEventListener('keydown', ({ key }) => {
        if (allowedKeys.includes(key as typeof allowedKeys[number])) {
          socket.send({
            action: KeyState.DOWN,
            key: keysToEbitenKeyCodes[key as typeof allowedKeys[number]],
          })
        }
      })

      document.addEventListener('keyup', ({ key }) => {
        if (allowedKeys.includes(key as typeof allowedKeys[number])) {
          socket.send({
            action: KeyState.UP,
            key: keysToEbitenKeyCodes[key as typeof allowedKeys[number]],
          })
        }
      })

      socket.onMessage<string>((event) => {
        const data: GameState = JSON.parse(event.data)
        if (!isEqual(gameStateRef.current, data)) {
          gameStateRef.current = data
        }
      })
    }, 1500)
  }, [])

  return gameStateRef
}

export default useGameState
