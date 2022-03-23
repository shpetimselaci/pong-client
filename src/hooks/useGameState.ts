import { useEffect, useRef } from 'react'

import {
  CloseState,
  GameState,
  keysToEbitenKeyCodes,
  allowedKeys,
  KeyState,
  EbitenKeyCodes,
} from '../types'
import ws from '../utils/websocket'
import defaultState from '../state-mock.json'
import { isEqual } from 'lodash'

const useGameState = () => {
  const gameStateRef = useRef<GameState>(defaultState)

  const setup = () => {
    // timeout to make the apperance nicer as if you are connecting to play

    ws.connect()
    document.addEventListener('keydown', ({ key }) => {
      const keycode = keysToEbitenKeyCodes[key as typeof allowedKeys[number]]
      const isPlayersKeyCode =
        gameStateRef.current.KeyPads.includes(keycode) ||
        keycode === EbitenKeyCodes.SPACE
      if (
        allowedKeys.includes(key as typeof allowedKeys[number]) &&
        isPlayersKeyCode
      ) {
        ws.send({
          action: KeyState.DOWN,
          key: keycode,
        })
      }
    })

    document.addEventListener('keyup', ({ key }) => {
      const keycode = keysToEbitenKeyCodes[key as typeof allowedKeys[number]]
      const isPlayersKeyCode =
        gameStateRef.current.KeyPads.includes(keycode) ||
        keycode === EbitenKeyCodes.SPACE
      if (
        allowedKeys.includes(key as typeof allowedKeys[number]) &&
        isPlayersKeyCode
      ) {
        ws.send({
          action: KeyState.UP,
          key: keycode,
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
      }, 300)
    })
  useEffect(() => {
    mockLoadingState().then(() => setup())
  }, [])
  return gameStateRef
}

export default useGameState
