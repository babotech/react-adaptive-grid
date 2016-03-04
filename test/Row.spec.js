import React, {Component} from 'react'
import {List, Map} from 'immutable'

import TestUtils from 'react-addons-test-utils'

import expect from 'expect'
import mockery from 'mockery'

class ItemMock extends Component {
    render() {
        return <div />
    }
}


describe(`react-ingrid`, () => {

    describe(`Row`, () => {
        let Row

        before(() => {
            mockery.enable({
                warnOnUnregistered: false
            })

            mockery.registerMock(`./Item`, ItemMock);
            ({default: Row} = require(`../src/Row`))

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

        it(`should set height and offsetLeft`, () => {
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
                    <Row {...props} />
                )

            const divs = TestUtils.scryRenderedDOMComponentsWithTag(grid, `div`)
            const {style} = divs[ 0 ]

            expect(style.height).toEqual(`${height}px`)
            expect(style.marginLeft).toEqual(`${-offsetLeft}px`)
        })
    })
})