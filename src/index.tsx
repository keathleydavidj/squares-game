import xs, { Stream, MemoryStream } from 'xstream'
import 'snabbdom-jsx'
import { run } from '@cycle/run'
import { DOMSource, makeDOMDriver, VNode } from '@cycle/dom'
import { Maybe } from 'maybe-not'
import * as R from 'ramda'
import { 
    Actions,
    Game,
    GameBoard,
    Row,
    Sources,
    Sinks,
    State
} from './types'
import { up, down, right, left } from './transforms'

function intent(domSource: DOMSource): Actions {
    const upFn$ = domSource .select('.btn-up') .events('click') .mapTo(up)

    const downFn$ = domSource .select('.btn-down') .events('click') .mapTo(down)

    const leftFn$ = domSource .select('.btn-left') .events('click') .mapTo(left)

    const rightFn$ = domSource .select('.btn-right') .events('click') .mapTo(right)

    // const undo$ = DOM //     .select('.btn-undo') //     .events('click')

    const moveFn$ = xs.merge(upFn$, downFn$, leftFn$, rightFn$)

    return { 
        moveFn$,
    }
}

function model({moveFn$}: Actions): State {
    const initialState = [ 
        0,
        [
            [ 2, null, 2, null ],
            [ null, null, null, null ],
            [ 2, null, null, null ],
            [ null, 2, 2, 2 ]
        ].map(row => row.map(num => Maybe.of(num))) as GameBoard,
    ] as Game

    const gameState$ = moveFn$.fold((state, reducer) => reducer(state), initialState)
    return gameState$   
}

function renderBoard(board: GameBoard): VNode {
    return (
        <div className="game-container">
            <div className="grid-container">
            {board.map(row => 
                <div className="grid-row">
                {row.map(cell => 
                    <span className="grid-element">value: {cell.withDefault(0)} </span>
                )}
                </div>
            )}
            </div>
        </div>
    )
}

function view(state$: State): Stream<VNode> {
    return state$.map(([score, board]) => {
        return (
            <div className="main">
                <h1>2048</h1>
                <p>Score: {score}</p>
                <p>High Score: Not yet implemented</p>
                {renderBoard(board)}
                <button className="btn-up">Up</button>
                <button className="btn-down">Down</button>
                <button className="btn-left">Left</button>
                <button className="btn-right">Right</button>
            </div>
        )
    })
}

function main(sources: Sources): Sinks {
    const actions = intent(sources.DOM)
    const state$ = model(actions)
    const vdom$ = view(state$)
    const sinks = { DOM: vdom$ }
    return sinks
}

const drivers = {
    DOM: makeDOMDriver('#app')
}

run(main, drivers)