import { Maybe } from 'maybe-not'
import * as R from 'ramda'
import { 
    Game,
    Row,
} from './types'

function padTo<T>(array: T[], length: number, padWith: T): T[] {
    while (array.length < length) {
        array.push(padWith)
    }
    return array
}

export const up = ([score, board]: Game): Game => {
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

export const down = ([score, board]: Game): Game => {
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

export const left = ([score, board]: Game): Game => {
    const newBoard = board.map(
        (row: Row): Row => {
            const newRow = row
                .filter(mNum => mNum.hasSomething)
                .reduce((acc: number[], x: Maybe<number>): number[] => {
                    return x.map((num) => {
                        const last = acc.pop()
                        let val = [num]
                        if (!!last && last === num) {
                            val = [last + num]
                            score += last + num
                        }
                        else if (!!last) {
                            val = [last, num]
                        }
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

export const right = ([score, board]: Game): Game => {
    const adjustScore = ( scoreUp: number ): number => { score += scoreUp; return scoreUp }
    const calcScore = (num1: number, num2: number): number[] =>
        num1 === num2 ? [adjustScore(num1 + num2)] : [num1, num2]
    const mCalcScore = Maybe.lift2(calcScore)
    const newBoard = board.map(
        (row: Row): Row => {
            const newRow = row
                .reverse()
                .filter(mNum => mNum.hasSomething)
                .reduce((acc: Maybe<number[]>, y: Maybe<number>): Maybe<number[]> => {
                    return acc.map((a: number[]) => a.concat(mCalcScore(Maybe.of(R.last(a)), y)))
                }, Maybe.just([]))
            return padTo(newRow, 4, Maybe.nothing<number>()).map(x => x.reverse())
        }
    )
    return [
        score,
        newBoard
    ] as Game
}