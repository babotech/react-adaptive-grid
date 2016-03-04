import React, {Component, PropTypes} from 'react'

import {List} from 'immutable'
import TestUtils from 'react-addons-test-utils'

import expect from 'expect'
import mockery from 'mockery'
import rndoam from 'rndoam'

describe(`react-adaptive-grid`, () => {

    describe(`AdaptiveGrid`, () => {
        let AdaptiveGrid

        class DisplayMock extends Component {
            render() {
                return <div />
            }
        }

        before(() => {
            mockery.enable({
                warnOnUnregistered: false
            })

            mockery.registerMock(`./Display`, DisplayMock);
            ({default: AdaptiveGrid} = require(`../src/AdaptiveGrid`))
        })

        after(() => {
            mockery.disable()
            mockery.deregisterAll()
        })

        it(`should transfer props into the context`, () => {
            DisplayMock.contextTypes = {
                ItemComponent: PropTypes.func
            }

            try {
                const props = {
                    ItemComponent: rndoam.noop()
                }

                const tree = TestUtils.renderIntoDocument(
                    <AdaptiveGrid {...props} />
                )

                const display = TestUtils.findRenderedComponentWithType(tree, DisplayMock)

                expect(display.context).toEqual(props)

            } finally {
                DisplayMock.contextTypes = {}
            }
        })

        it(`should transfer props into the Display component`, () => {
            const props = {
                ItemComponent: rndoam.noop(),
                minWidth: rndoam.number(),
                padding: rndoam.number(),
                offsetLeft: rndoam.number(),
                items: rndoam.array(),
                more: true
            }

            const tree = TestUtils.renderIntoDocument(
                <AdaptiveGrid {...props} />
            )

            const display = TestUtils.findRenderedComponentWithType(tree, DisplayMock)

            const {ItemComponent, ...expectedProps} = props

            expect(display.props).toEqual(expectedProps)
        })
    })
})