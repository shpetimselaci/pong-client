import stateMock from './state-mock.json'

export type GameState = typeof stateMock

export type CloseState = { Text: string }
export type Player = GameState['Player1']

export type Ball = GameState['Ball']

export enum GamePlayState {
  StartState = 0,
  PlayState = 1,
  GameOverState = 2,
}

export enum KeyState {
  UP = 0,
  DOWN = 1,
}

export enum EbitenKeyCodes {
  S = 28,
  W = 32,
  UP = 102,
  DOWN = 42,
  SPACE = 100,
}

export const allowedKeys = [
  's',
  'w',
  'S',
  'W',
  ' ',
  'ArrowUp',
  'ArrowDown',
] as const
export const keysToEbitenKeyCodes: Record<typeof allowedKeys[number], number> =
  {
    S: EbitenKeyCodes.S,
    s: EbitenKeyCodes.S,
    W: EbitenKeyCodes.W,
    w: EbitenKeyCodes.W,
    ArrowDown: EbitenKeyCodes.DOWN,
    ArrowUp: EbitenKeyCodes.UP,
    ' ': EbitenKeyCodes.SPACE,
  }
