import {describe, it} from 'mocha'
import {expect} from 'chai'
import { Maybe } from 'maybe-not'
import {Game, GameBoard} from '../src/types'
import {up, down, left, right} from '../src/transforms'

const boardToMaybe = (board: number[][]): GameBoard => {
    return board.map(row => row.map(x => Maybe.of(x)))
}

describe('Basic transforms', function() {
    it('should be true', function() {
        expect(true).to.equal(true)
    })

    describe('Left', function() {
        it('should work', function() {
            let state = left([ 0, boardToMaybe([
                [null, null, 2, 2],
                [2, null, null, 2]
            ])])

            expect(state).to.deep.equal([ 8, boardToMaybe([[4, null, null, null], [4, null, null, null]])])
        })
    })

    describe.skip('Right', function() {
        it('should also work', function() {
            let state = right([ 0, boardToMaybe([
                [null, null, 2, 2],
                [2, null, null, 2]
            ])])
            
            expect(state).to.deep.equal([ 8, boardToMaybe([[null, null, null, 4], [null, null, null, 4]])])
        })
        it('should also work again', function() {
            let state = right([ 0, boardToMaybe([
                [1, null, 2, 2],
                [2, null, null, 2]
            ])])
            
            expect(state).to.deep.equal([ 8, boardToMaybe([[null, null, 1, 4], [null, null, null, 4]])])
        })
    })
})