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

function padTo<T>(array: T[], length: number, padWith: T): T[] {
    while (array.length < length) {
        array.push(padWith)
    }
    return array
}

const up = ([score, board]: Game): Game => {
    const newBoard = board.map(
        (row: Row): Row => {
            const newRow = row
                .filter(mNum => mNum.hasSomething)
                .reduce((acc: number[], x: Maybe<number>): number[] => {
                    return x.map((num) => {
                        const last = acc.pop()
                        const val = !!last ? last === num ? [last + num] : [last, num] : [num];
                        return acc.concat(val)
                    }).withDefault(acc)
            }, [])
            return padTo(newRow, 4, undefined).map(x => Maybe.of(x))
        }
    )
    return [
        score,
        newBoard
    ] as Game
}

const down = ([score, board]: Game): Game => {
    const newBoard = board.map(
        (row: Row): Row => {
            const newRow = row
                .filter(mNum => mNum.hasSomething)
                .reduce((acc: number[], x: Maybe<number>): number[] => {
                    return x.map((num) => {
                        const last = acc.pop()
                        const val = !!last ? last === num ? [last + num] : [last, num] : [num];
                        return acc.concat(val)
                    }).withDefault(acc)
            }, [])
            return padTo(newRow, 4, undefined).map(x => Maybe.of(x))
        }
    )
    return [
        score,
        newBoard
    ] as Game
}

const left = ([score, board]: Game): Game => {
    const newBoard = board.map(
        (row: Row): Row => {
            const newRow = row
                .filter(mNum => mNum.hasSomething)
                .reduce((acc: number[], x: Maybe<number>): number[] => {
                    return x.map((num) => {
                        const last = acc.pop()
                        const val = !!last ? last === num ? [last + num] : [last, num] : [num];
                        return acc.concat(val)
                    }).withDefault(acc)
            }, [])
            return padTo(newRow, 4, undefined).map(x => Maybe.of(x))
        }
    )
    return [
        score,
        newBoard
    ] as Game

}

const right = ([score, board]: Game): Game => {
    const newBoard = board.map(
        (row: Row): Row => {
            const newRow = row
                .reverse()
                .filter(mNum => mNum.hasSomething)
                .reduce((acc: number[], x: Maybe<number>): number[] => {
                    return x.map((num) => {
                        const last = acc.pop()
                        const val = !!last ? last === num ? [last + num] : [last, num] : [num];
                        return acc.concat(val)
                    }).withDefault(acc)
                }, [])
                .reverse()
            return padTo(newRow, 4, undefined).map(x => Maybe.of(x))
        }
    )
    return [
        score,
        newBoard
    ] as Game
}

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