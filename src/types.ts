import stateMock from './state-mock.json'

export type GameState = typeof stateMock

export type Player = GameState['Player1']

export type Ball = GameState['Ball']
