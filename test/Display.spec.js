/* eslint-disable no-magic-numbers */

import {Map, List} from 'immutable'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import expect from 'expect'
import mockery from 'mockery'
import rndoam from 'rndoam'

class GridMock extends Component {
    render() {
        return <div />
    }
}

const gridStateMock = {}

const gridStateFactoryMock = expect.createSpy()
    .andReturn(gridStateMock)

const createSetDisplayClientBoundingRect = (Display) => (displayClientBoundingRectMock) => {
    const spy = expect.spyOn(Display.prototype, `getDisplayBoundingClientRect`)
    spy.andReturn(displayClientBoundingRectMock)
    return spy.restore
}

const createSetContentClientBoundingRect = (Display) => (contentClientBoundingRectMock) => {
    const spy = expect.spyOn(Display.prototype, `getContentBoundingClientRect`)
    spy.andReturn(contentClientBoundingRectMock)
    return spy.restore
}

const simulateScroll = (node) => {
    const event = document.createEvent(`Event`)
    event.initEvent(`scroll`, true, true)
    node.dispatchEvent(event)
    return event
}

const simulateWindowResize = () => {
    const event = document.createEvent(`Event`)
    event.initEvent(`resize`, true, true)
    window.dispatchEvent(event)
    return event
}

describe(`react-ingrid`, () => {

    describe(`Display`, () => {
        let Display, setDisplayClientBoundingRect, setContentClientBoundingRect, mountNode

        before(() => {
            mockery.enable({
                warnOnUnregistered: false
            })

            mockery.registerMock(`./Grid`, GridMock)
            mockery.registerMock(`./gridStateFactory`, gridStateFactoryMock);
            ({default: Display} = require(`../src/Display`))

            setDisplayClientBoundingRect = createSetDisplayClientBoundingRect(Display)
            setContentClientBoundingRect = createSetContentClientBoundingRect(Display)

        })

        after(() => {
            mockery.disable()
            mockery.deregisterAll()
        })

        beforeEach(() => {
            mountNode = document.createElement(`div`)
            document.body.appendChild(mountNode)
            gridStateMock.getState = expect.createSpy()
                .andReturn({})
            gridStateMock.updateGrid = expect.createSpy()
            gridStateMock.updateOffset = expect.createSpy()
        })

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(mountNode)
            expect.restoreSpies()
        })

        it(`should set initial state`, () => {
            const props = {
                minWidth: rndoam.number(),
                additionalHeight: rndoam.number(),
                offsetLeft: rndoam.number(),
                padding: rndoam.number(),
                more: true
            }
            const state = rndoam.object()

            gridStateMock.getState.andReturn(state)

            const display = new Display(props)


            expect(gridStateFactoryMock.calls[ 0 ].arguments[ 0 ])
                .toEqual(props)

            expect(display.state).toEqual(state)
        })

        it(`should update state when component did mount`, () => {
            const props = {
                items: rndoam.array(),
                more: true
            }

            const containerWidth = 500
            const containerHeight = 200
            const offset = 200

            const restoreDisplay = setDisplayClientBoundingRect({
                top: 0,
                width: containerWidth,
                height: containerHeight
            })

            const restoreContent = setContentClientBoundingRect({
                top: -1 * offset
            })

            const state = rndoam.object()

            gridStateMock
                .getState
                .andReturn(state)

            TestUtils
                .renderIntoDocument(
                    <Display {...props} />
                )

            expect(gridStateMock.updateGrid.calls[ 0 ].arguments)
                .toEqual([
                    props.items,
                    containerWidth,
                    containerHeight,
                    offset,
                    true
                ])

            expect(gridStateMock.getState.calls.length)
                .toEqual(2)

            restoreDisplay()
            restoreContent()
        })

        it(`should transfer properties into the Grid component`, () => {

            const state = {
                offset: rndoam.number(),
                height: rndoam.number(),
                rows: rndoam.array()
            }

            gridStateMock
                .getState
                .andReturn(state)

            const display = TestUtils.renderIntoDocument(
                <Display />
            )

            const grid = TestUtils.findRenderedComponentWithType(display, GridMock)


            expect(grid.props)
                .toEqual({
                    ...state
                })
        })

        it(`should update state on scroll`, () => {

            const restoreDisplay = setDisplayClientBoundingRect({
                top: 0,
                width: 100,
                height: 100
            })

            const offset = 100

            const display = TestUtils.renderIntoDocument(
                <Display />
            )

            const restoreContent = setContentClientBoundingRect({
                top: -1 * offset
            })

            const state = rndoam.object()

            gridStateMock
                .getState
                .andReturn(state)

            simulateScroll(display.display)

            expect(display.state)
                .toEqual(state)

            expect(gridStateMock.updateOffset.calls[ 0 ].arguments[ 0 ])
                .toEqual(offset)

            restoreDisplay()
            restoreContent()
        })

        it(`should update state on window resize`, () => {

            const items = rndoam.array()

            const display = TestUtils.renderIntoDocument(
                <Display items={items} more={true}/>
            )

            const containerWidth = rndoam.number()
            const containerHeight = rndoam.number()
            const offset = rndoam.number()

            const restoreDisplay = setDisplayClientBoundingRect({
                top: 0,
                width: containerWidth,
                height: containerHeight
            })

            const restoreContent = setContentClientBoundingRect({
                top: -1 * offset
            })
            const state = rndoam.object()

            gridStateMock
                .getState
                .andReturn(state)

            simulateWindowResize()

            expect(gridStateMock.updateGrid.calls[ 1 ].arguments)
                .toEqual([
                    items,
                    containerWidth,
                    containerHeight,
                    offset,
                    true
                ])

            expect(display.state)
                .toEqual(state)

            restoreDisplay()
            restoreContent()
        })

        it(`should remove listener from the window after component was unmount`, () => {

            const spyAddListener = expect
                .spyOn(window, `addEventListener`)
                .andCallThrough()

            ReactDOM.render(
                <Display />,
                mountNode
            )

            expect(spyAddListener.calls.length).toEqual(1)

            const spyRemoveListener = expect
                .spyOn(window, `removeEventListener`)
                .andCallThrough()

            ReactDOM.unmountComponentAtNode(mountNode)

            expect(spyRemoveListener.calls.length).toEqual(1)

            expect(spyAddListener.calls[ 0 ].arguments[ 1 ]).toEqual(spyRemoveListener.calls[ 0 ].arguments[ 1 ])
        })
    })
})