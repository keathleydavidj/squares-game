import { Stream, MemoryStream } from 'xstream'
import { VNode, DOMSource } from '@cycle/dom'
import { Maybe } from 'maybe-not'

export type Sources = {
    DOM: DOMSource
    game: MemoryStream<Game>
}

export type Sinks = {
    DOM: Stream<VNode>
}

export type GameBoard = Maybe<number>[][]
export type Row = Maybe<number>[]
export type Cell = Maybe<number>

export type Game = [number, GameBoard]
export type State = Stream<Game>

export interface Actions {
    moveFn$: Stream<([score, GameBoard]: Game) => Game>
}