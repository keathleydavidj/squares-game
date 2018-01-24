import { Maybe } from 'maybe-not'
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
    const newBoard = board.map(
        (row: Row): Row => {
            const newRow = row
                .reverse()
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
                        return val.concat(acc)
                    }).withDefault(acc)
                }, [])
            return padTo(newRow, 4, undefined).reverse().map(x => Maybe.of(x))
        }
    )
    return [
        score,
        newBoard
    ] as Game
}