import stateMock from './state-mock.json'

export type GameState = typeof stateMock

export type Player = GameState['Player1']

export type Ball = GameState['Ball']

export enum GamePlayState {
  StartState = 0,
  PlayState = 1,
  GameOverState = 2,
}
