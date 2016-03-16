import {List, Map, is} from 'immutable'
import {calcGrid, calcGridExcludeLastRow, calcVisibleGrid, insertItems} from './gridCalculations'

class GridState {

    constructor({
        additionalHeight = 0,
        containerWidth = 0,
        containerHeight = 0,
        minWidth = 0,
        more = false,
        offset = 0,
        offsetLeft = 0,
        padding = 0,
        grid = Map({
            rows: List(),
            height: 0
        })
        } = {}) {

        this.additionalHeight = additionalHeight
        this.containerWidth = containerWidth
        this.containerHeight = containerHeight
        this.minWidth = minWidth
        this.more = more
        this.offset = offset
        this.offsetLeft = offsetLeft
        this.padding = padding
        this.grid = grid
    }

    getState() {
        const grid = this.more ? calcGridExcludeLastRow(this.grid) : this.grid

        const visibleGrid = calcVisibleGrid(grid, this.containerHeight, this.offset)

        const loadMoreAllowed = is(grid.getIn([ `rows`, -1 ]), visibleGrid.getIn([ `rows`, -1 ]))

        return {
            loadMoreAllowed,
            offset: visibleGrid.getIn([ `rows`, 0, `top` ]) || 0,
            padding: this.padding,
            ...visibleGrid.toObject()
        }
    }

    updateOffset(offset) {
        this.offset = offset
    }

    updateGrid(items, containerWidth, containerHeight, offset, more) {
        this.containerWidth = containerWidth
        this.containerHeight = containerHeight
        this.offset = offset
        this.more = more

        this.grid = calcGrid(items, this.additionalHeight, this.containerWidth, this.minWidth, this.offsetLeft, this.padding, this.padding)
    }

    insertItems(items, more) {
        this.more = more

        this.grid = insertItems(this.grid, items, this.additionalHeight, this.containerWidth, this.minWidth, this.offsetLeft, this.padding)
    }
}

export default GridState