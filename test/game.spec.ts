import {describe, it} from 'mocha'
import {expect} from 'chai'
import {left, right, up, down} from '../src/components/game-grid/index'

describe('unit | game', function() {
    it('should fold row down as expected', function() {
        const row = [[ 2, 2, 4, 4 ]]
        const expected = [[ 4, 8, 0, 0]]
        expect(left(row)).to.deep.equal(expected)
    })
    it('should fold row down as expected', function() {
        const row = [[ 2, 2, 4, 4 ]]
        const expected = [[ 0, 0, 4, 8 ]]
        expect(right(row)).to.deep.equal(expected)
    })
    it('should fold row down as expected', function() {
        const row = [[2, 0, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [4, 0, 0, 0]]
        const expected = [[4, 0, 0, 0], [8, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        expect(up(row)).to.deep.equal(expected)
    })
    it('should fold row down as expected', function() {
        const row = [[2, 0, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [4, 0, 0, 0]]
        const expected = [[0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 0], [8, 0, 0, 0]]
        expect(down(row)).to.deep.equal(expected)
    })
})