import {Iterable, List, Map, fromJS} from 'immutable'
import {calcGrid, calcVisibleGrid, insertItems} from './gridCalculations'

class GridState {

    constructor({
        additionalHeight = 0,
        containerWidth = 0,
        containerHeight = 0,
        minWidth = 0,
        more = false,
        offset = 0,
        offsetLeft = 0,
        padding = 0
        } = {}) {

        this.additionalHeight = additionalHeight
        this.containerWidth = containerWidth
        this.containerHeight = containerHeight
        this.minWidth = minWidth
        this.more = more
        this.offset = offset
        this.offsetLeft = offsetLeft
        this.padding = padding
        this.grid = Map({
            rows: List(),
            height: 0
        })
    }

    getState() {
        const visibleGrid = calcVisibleGrid(this.grid, this.containerHeight, this.offset, this.more)

        return Map({
            offset: visibleGrid.getIn([ `rows`, 0, `top` ]) || 0,
            ...visibleGrid.toObject()
        })
    }

    updateOffset(offset) {
        this.offset = offset
    }

    updateGrid(items, containerWidth, containerHeight, offset, more) {
        this.containerWidth = containerWidth
        this.containerHeight = containerHeight
        this.offset = offset
        this.more = more

        const initialItems = Iterable.isIterable(items) ? items : fromJS(items)

        this.grid = calcGrid(initialItems, this.additionalHeight, this.containerWidth, this.minWidth, this.offsetLeft, this.padding)
    }

    insertItems(items, more) {
        this.more = more

        const itemsToInsert = Iterable.isIterable(items) ? items : fromJS(items)

        this.grid = insertItems(this.grid, itemsToInsert, this.additionalHeight, this.containerWidth, this.minWidth, this.offsetLeft, this.padding)
    }
}

export default GridState