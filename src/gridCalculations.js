import {List, Map, is} from 'immutable'

const scaleItemsToContainerWidth = (items, containerWidth, offsetLeft) => {
    const calculatedContainerWidth = containerWidth - (items.size - 1) * offsetLeft
    const sumWidth = items.reduce((acc, item) => acc + item.get(`width`), 0)
    const widthScaleFactor = calculatedContainerWidth / sumWidth
    return items.map(item => item.withMutations(i =>
        i.update(`height`, h => h * widthScaleFactor).update(`width`, w => w * widthScaleFactor)
    ))
}

const scaleItemsToMinWidth = (items, minWidth) => {
    const minWidthItem = items.sortBy(item => item.get(`width`)).first()

    if (minWidthItem.get(`width`) < minWidth) {
        const k = minWidth / minWidthItem.get(`width`)

        items = items.map(item =>
            item.withMutations(i =>
                i.update(`width`, w => w * k)
                    .update(`height`, h => h * k)
            )
        )
    }

    return items
}

export const calcGridRow = (top, items, containerWidth, additionalHeight, minWidth, offsetLeft = 0, fullWidth = true) => {
    let extraItems = List()
    const minHeight = items.minBy(item => item.get(`height`)).get(`height`)

    let calculatedItems = items.map(item => item.withMutations(i => {
        const k = minHeight / item.get(`height`)
        const origWidth = i.get(`width`)
        const origHeight = i.get(`height`)

        return i
            .set(`origHeight`, origHeight)
            .set(`origWidth`, origWidth)
            .set(`height`, minHeight)
            .update(`width`, w => k * w)
    }))

    if (fullWidth) {
        calculatedItems = scaleItemsToContainerWidth(calculatedItems, containerWidth, offsetLeft)

        while (calculatedItems.some(i => i.get(`width`) < minWidth)) {
            extraItems = extraItems.unshift(items.last())
            items = items.pop()

            calculatedItems = calculatedItems.pop()

            calculatedItems = scaleItemsToContainerWidth(calculatedItems, containerWidth, offsetLeft)
        }
    } else {
        calculatedItems = scaleItemsToMinWidth(calculatedItems, minWidth)
        while (calculatedItems.reduce((acc, item) => acc + item.get(`width`), 0) > containerWidth) {
            extraItems = extraItems.unshift(items.last())
            items = items.pop()

            calculatedItems = calculatedItems.pop()

            calculatedItems = scaleItemsToMinWidth(calculatedItems, minWidth)
        }
    }

    return Map({
        row: Map({
            items: calculatedItems,
            top,
            height: calculatedItems.first().get(`height`) + additionalHeight
        }),
        extraItems
    })
}

export const calcGrid = (items, additionalHeight, containerWidth, minWidth, offsetLeft, padding = 0, initialTop = 0) => {
    const actualContainerWidth = containerWidth - padding * 2

    let width = 0
    let top = initialTop
    let itemsInRow = List()
    let rows = List()

    items.forEach(item => {
        width += item.get(`width`)

        if (width > actualContainerWidth && itemsInRow.size) {
            width = item.get(`width`)

            const calcGridRowResult = calcGridRow(top, itemsInRow, actualContainerWidth, additionalHeight, minWidth, offsetLeft)

            rows = rows.push(calcGridRowResult.get(`row`))

            top += calcGridRowResult.getIn([ `row`, `height` ])

            itemsInRow = calcGridRowResult.get(`extraItems`)
        }

        itemsInRow = itemsInRow.push(item)
    })

    while (itemsInRow.size) {
        const calcGridRowResult = calcGridRow(top, itemsInRow, actualContainerWidth, additionalHeight, minWidth, offsetLeft)
        rows = rows.push(calcGridRowResult.get(`row`))

        top += calcGridRowResult.getIn([ `row`, `height` ])

        itemsInRow = calcGridRowResult.get(`extraItems`)
    }

    if (rows.size) {
        rows = rows.update(rows.size - 1, row => {
            top -= row.get(`height`)
            const origItems = row.get(`items`)
                .map(item =>
                    item.update(it =>
                        it.withMutations(i =>
                            i.set(`width`, i.get(`origWidth`))
                                .set(`height`, i.get(`origHeight`))
                        )
                    )
                )

            const updatedRow = calcGridRow(top, origItems, actualContainerWidth, additionalHeight, minWidth, offsetLeft, false).get(`row`)

            top += updatedRow.get(`height`)
            return updatedRow
        })
    }
    return Map({
        rows,
        height: rows.reduce((acc, item) => acc + item.get(`height`), 0) + initialTop
    })
}

export const calcVisibleGrid = (grid, visibleAreaHeight, offset, excludeLast = false) => {

    let visibleGrid = grid.update(`rows`, r => {
        let acc = List()
        r.some((it) => {
            const top = it.get(`top`)
            const height = it.get(`height`)


            if (top >= offset) {
                if (top >= offset + visibleAreaHeight) {
                    return true
                }

                acc = acc.push(it)
            } else if (top + height > offset) {
                acc = acc.push(it)
            }

            return false
        })
        return acc
    })

    const shouldLoad = is(visibleGrid.getIn([ `rows`, -1 ]), grid.getIn([ `rows`, -1 ]))

    if (grid.get(`rows`).size &&
        excludeLast) {
        const lastHeight = grid.getIn([ `rows`, -1, `height` ])

        if (shouldLoad) {
            visibleGrid = visibleGrid.update(`rows`, r => r.skipLast(1))
        }

        visibleGrid = visibleGrid.update(`height`, h => h - lastHeight)
    }


    return visibleGrid.set(`shouldLoad`, shouldLoad)
}

export const insertItems = (grid, items, additionalHeight, containerWidth, minWidth, offsetLeft, padding = 0) => {
    const lastRow = grid.getIn([ `rows`, -1 ])

    const itemsToCalc = lastRow
        .get(`items`)
        .map(i => i
            .update(`width`, () => i.get(`origWidth`))
            .update(`height`, () => i.get(`origHeight`)))
        .concat(items)

    return calcGrid(itemsToCalc, additionalHeight, containerWidth, minWidth, offsetLeft, padding, grid.get(`height`) - lastRow.get(`height`))
        .update(g =>
            g.update(`rows`,
                r => grid
                    .get(`rows`)
                    .skipLast(1)
                    .concat(r)))
}