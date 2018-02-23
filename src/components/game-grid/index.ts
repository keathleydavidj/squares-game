import xs, { MemoryStream } from 'xstream'
import { run } from '@cycle/run'
import * as R from 'ramda'
import { 
    DOMSource, 
    VNode,
    makeDOMDriver,
    div,
    h1,
    p,
    button,
    span
} from '@cycle/dom';

type Grid = number[][]

const generateGrid = (gridSize: number): Grid => {
    const arr = [...Array(gridSize)]
    const row: number[] = arr.fill(0).map((x, i) => i * 2)
    const grid: number[][] = arr.fill(row)
    return grid
}

const padTo = <T>(length: number, padWith: T) => (array: T[]): T[] => {
    while (array.length < length) {
        array.push(padWith)
    }
    return array
}

const padTo4WithZeros = padTo(4, 0)

const foldRow = (a: number[]) => R.unfold(
    ([fst, snd, i]: number[]): false | [number, [number, number, number]] => {
        let sum = fst === snd ? fst + snd : fst;
        let result: [number, number, number] = fst === snd ? [a[i+1], a[i+2], i+2] : [sum, a[i+1], i+1]
        return a.length <= i ? false : [sum, result]
    }, [a[0], a[1], 1])

// const foldRow = (row: number[]): number[] => 
//     row.filter(x => x > 0)
//     .reduce((arr, y) => {
//         const x = R.last(arr)
//         const value = x != undefined ?
//             x == y ? [x + y] : [x, y] : [y]
//         return arr.concat(value)
//     }, new Array() as number[])

const mirrorGrid = (grid: Grid): Grid => {
    let newGrid: Grid = [[],[],[],[]]
    grid.forEach((row, idx) =>
        row.forEach((x, idx1) => 
            newGrid[idx1][idx] = x))
    return newGrid
}   
const mkFlippedReducer = (fn: (grid: Grid) => Grid) =>
    R.compose(mirrorGrid, fn, mirrorGrid)

const leftReducer = R.compose(padTo4WithZeros, foldRow)
const left = (grid: Grid): Grid => grid.map(leftReducer)
const up = mkFlippedReducer(left)

const reverseRow = (row: number[]): number[] => row.reverse()
const rightReducer = R.compose(reverseRow, padTo4WithZeros, foldRow, reverseRow)
const right = (grid: Grid): Grid => grid.map(rightReducer)
const down = mkFlippedReducer(right)

const insertRandomElement = (grid: Grid): Grid =>
    grid.map((row: number[], i: number) => 
        row.map((value: number, j: number) => [value, [i,j]])
            .filter(([val]) => val === 0))

export default function GameGrid(sources: { DOM: DOMSource }): { DOM: MemoryStream<VNode> } {
    const up$ = sources.DOM.select('.btn-up').events('click').mapTo(up)
    const down$ = sources.DOM.select('.btn-down').events('click').mapTo(down)
    const left$ = sources.DOM.select('.btn-left').events('click').mapTo(left)
    const right$ = sources.DOM.select('.btn-right').events('click').mapTo(right)
    const gameMove$ = xs.merge(up$, down$, left$, right$)
    const state$ = gameMove$.fold((state, reducer) => reducer(state), generateGrid(4))

    const vdom$ = state$.map(state => {
        return div('.main', [], [
            h1('2048'),
            p('Score: N/A'),
            p('High Score: N/A'),
            div('.game-container', [
                div('.grid-container', state.map(row =>
                    div('.grid-row', row.map(cell =>
                        span('.grid-element', `value: ${cell}`)
                    ))
                ))
            ]),
            button('.btn-up', 'Up'),
            button('.btn-down', 'Down'),
            button('.btn-left', 'Left'),
            button('.btn-up', 'Right')
        ])
    })
    return {
        DOM: vdom$
    }
}

// const drivers = {
//     DOM: makeDOMDriver('#app')
// } 
// const main = GameGrid
// run(main, {
//     DOM: <DOMSource>makeDOMDriver('#app')
// })

export { left, right, up, down }