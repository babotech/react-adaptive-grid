import {List, Map} from 'immutable'
import React, {Component, PropTypes} from 'react'

import TestUtils from 'react-addons-test-utils'

import contextify from 'react-contextify'
import expect from 'expect'
import mockery from 'mockery'

class ItemMock extends Component {
    render() {
        return <div />
    }
}


describe(`react-adaptive-grid`, () => {

    describe(`Row`, () => {
        let Row, WithContext

        before(() => {
            mockery.enable({
                warnOnUnregistered: false
            })

            mockery.registerMock(`./Item`, ItemMock);
            ({default: Row} = require(`../src/Row`))

            WithContext = contextify({
                offsetLeft: PropTypes.number
            }, ({offsetLeft}) => ({
                offsetLeft
            }))(Row)
        })

        after(() => {
            mockery.disable()
            mockery.deregisterAll()
        })

        it(`should render items`, () => {
            const item = Map()
            const props = {
                row: Map({
                    items: List([
                        item
                    ])
                })
            }

            const grid = TestUtils
                .renderIntoDocument(
                    <Row {...props} />
                )

            const items = TestUtils.scryRenderedComponentsWithType(grid, ItemMock)

            expect(items.length).toEqual(1)
            expect(items[ 0 ].props).toEqual({
                item
            })
        })

        it(`should set height`, () => {
            const height = 100
            const offsetLeft = 100
            const props = {
                row: Map({
                    items: List(),
                    height
                }),
                offsetLeft
            }

            const grid = TestUtils
                .renderIntoDocument(
                    <WithContext {...props} />
                )

            const divs = TestUtils.scryRenderedDOMComponentsWithTag(grid, `div`)
            const {style} = divs[ 0 ]

            expect(style.height).toEqual(`${height}px`)
            expect(style.marginLeft).toEqual(`${-offsetLeft}px`)
        })
    })
})