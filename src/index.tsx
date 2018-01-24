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
    Sinks
} from './types'

function padTo<T>(array: T[], length: number, padWith: T): T[] {
    while (array.length < length) {
        array.push(padWith)
    }
    return array
}

const up = (game: Game): Game => {
    const {board, score} = game
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
    return {
        board: newBoard,
        score,
        ...game
    } as Game
}

const down = (game: Game): Game => {
    const {board, score} = game
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
    return {
        board: newBoard,
        score,
        ...game
    } as Game
}

const left = (game: Game): Game => {
    const {board, score} = game
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
    return {
        board: newBoard,
        score,
        ...game
    } as Game
}

const right = (game: Game): Game => {
    const {board, score} = game
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
    return {
        board: newBoard,
        score,
        ...game
    } as Game
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

function model({moveFn$}: Actions, game$: MemoryStream<Game>): MemoryStream<Game> {
    return moveFn$.map(f => game$.map(game => f(game))).flatten()
}

function renderBoard(board: GameBoard): VNode {
    return (
        <div className="game">
        {board.map(row => 
            <div className="row">
            {row.map(cell => 
                <span className="cell">value: {cell.withDefault(0)} </span>
            )}
            </div>
        )}
        </div>
    )
}

function view(state$: MemoryStream<Game>): Stream<VNode> {
    return state$.map(({board, score}) => {
        return (
            <div className="main">
                <h1>2048</h1>
                <p>Score: {score}</p>
                {renderBoard(board)}
                <button className="btn-left">Left</button>
                <button className="btn-right">Right</button>
            </div>
        )
    })
}

function main(sources: Sources): Sinks {
    const actions = intent(sources.DOM)
    const state$ = model(actions, sources.game)
    const vdom$ = view(state$)
    const sinks = { DOM: vdom$ }
    return sinks
}
const initGame = [
    [ 2, null, 2, null ],
    [ null, null, null, null ],
    [ 2, null, null, null ],
    [ null, 2, 2, 2 ]
].map(row => row.map(num => Maybe.of(num))) as GameBoard

const drivers = {
    DOM: makeDOMDriver('#app'),
    game: xs.of({
        board: initGame,
        score: 0
    } as Game)
}

run(main, drivers)