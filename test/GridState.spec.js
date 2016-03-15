import {List, Map} from 'immutable'

import expect from 'expect'
import expectImmutable from 'expect-immutable'
import mockery from 'mockery'
import rndoam from 'rndoam/lib/withImmutable'

expect.extend(expectImmutable)

describe(`react-adaptive-grid`, () => {

    describe(`GridState`, () => {
        let GridState

        const calcVisibleGridSpy = expect.createSpy()
        const calcGridSpy = expect.createSpy()
        const insertItemsSpy = expect.createSpy()

        beforeEach(() => {
            mockery.enable({
                warnOnUnregistered: false

            })
            mockery.registerMock(`./gridCalculations`, {
                calcGrid: calcGridSpy,
                calcVisibleGrid: calcVisibleGridSpy,
                insertItems: insertItemsSpy
            });

            ({default: GridState} = require(`../src/GridState`))
        })

        afterEach(() => {
            mockery.deregisterAll()
            mockery.disable()

            calcVisibleGridSpy.reset()
            calcGridSpy.reset()
            insertItemsSpy.reset()
        })


        it(`should initialize with default values`, () => {
            const gridState = new GridState()

            expect(gridState.additionalHeight).toEqual(0)
            expect(gridState.containerWidth).toEqual(0)
            expect(gridState.containerHeight).toEqual(0)
            expect(gridState.minWidth).toEqual(0)
            expect(gridState.more).toEqual(false)
            expect(gridState.offset).toEqual(0)
            expect(gridState.offsetLeft).toEqual(0)
            expect(gridState.padding).toEqual(0)
            expect(gridState.grid).toEqualImmutable(Map({
                rows: List(),
                height: 0
            }))
        })

        it(`should update offset`, () => {
            const gridState = new GridState()
            const offset = rndoam.number()

            gridState.updateOffset(offset)

            expect(gridState.offset).toEqual(offset)
        })

        it(`should calculate grid`, () => {
            const gridState = new GridState()

            const items = rndoam.list()
            const containerWidth = rndoam.number()
            const containerHeight = rndoam.number()
            const offset = rndoam.number()

            gridState.updateGrid(items, containerWidth, containerHeight, offset, true)

            expect(gridState.containerWidth).toEqual(containerWidth)
            expect(gridState.containerHeight).toEqual(containerHeight)
            expect(gridState.offset).toEqual(offset)
            expect(gridState.more).toEqual(true)

            expect(calcGridSpy.calls.length).toEqual(1)
        })

        it(`should get initial state`, () => {
            const padding = rndoam.number()
            const gridState = new GridState({padding})
            const offset = rndoam.number()
            const height = rndoam.number()
            const rows = List([
                Map({
                    top: offset
                })
            ])

            calcVisibleGridSpy.andReturn(Map({
                rows,
                height
            }))

            expect(gridState.getState())
                .toEqual({
                    offset,
                    rows,
                    height,
                    padding
                })
            expect(calcVisibleGridSpy.calls.length).toEqual(1)
        })

        it(`should not display last row if loading expected`, () => {
            const gridState = new GridState({
                more: true
            })
            gridState.getState()

            const {arguments: args} = calcVisibleGridSpy.calls[ 0 ]
            expect(args[ args.length - 1 ]).toEqual(true)
        })

        it(`should insert items and update more`, () => {
            const gridState = new GridState({
                more: true
            })
            const items = rndoam.list()

            gridState.insertItems(items, false)

            expect(gridState.more)
                .toEqual(false)

            expect(insertItemsSpy.calls.length).toEqual(1)
        })
    })
})