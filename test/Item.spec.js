import {List, Map} from 'immutable'
import React, {Component, PropTypes} from 'react'

import Item from '../src/Item'
import TestUtils from 'react-addons-test-utils'

import contextify from 'react-contextify'
import expect from 'expect'
import rndoam from 'rndoam/lib/withImmutable'

describe(`react-adaptive-grid`, () => {
    describe(`Item`, () => {
        class ItemComponentMock extends Component {
            render() {
                return <div />
            }
        }

        const WithContext = contextify({
            ItemComponent: PropTypes.func,
            additionalHeight: PropTypes.number,
            items: PropTypes.object,
            offsetLeft: PropTypes.number
        }, ({ItemComponent, additionalHeight, items, offsetLeft}) => ({
            ItemComponent,
            additionalHeight,
            items,
            offsetLeft
        }))(Item)

        it(`should receive item props from the context`, () => {

            const props = {
                ItemComponent: ItemComponentMock,
                additionalHeight: rndoam.number(),
                items: List(),
                offsetLeft: rndoam.number()
            }

            const tree = TestUtils.renderIntoDocument(
                <WithContext {...props} />
            )

            const item = TestUtils.findRenderedComponentWithType(tree, Item)

            expect(item.context).toEqual(props)
        })

        it(`should transfer props into the ItemComponent`, () => {
            const width = rndoam.number()
            const height = rndoam.number()

            const itemFromGrid = Map({
                id: 2,
                width,
                height
            })

            const itemData = Map({
                id: 2,
                foo: `bar`
            })

            const items = List([
                Map({
                    id: 1
                }),
                itemData,
                Map({
                    id: 3
                })
            ])

            const props = {
                ItemComponent: ItemComponentMock,
                additionalHeight: rndoam.additionalHeight,
                item: itemFromGrid,
                items
            }

            const tree = TestUtils.renderIntoDocument(
                <WithContext {...props} />
            )

            const item = TestUtils.findRenderedComponentWithType(tree, ItemComponentMock)

            expect(item.props.data).toEqual(itemData)
            expect(item.props.additionalHeight).toEqual(props.additionalHeight)
            expect(item.props.height).toEqual(height)
            expect(item.props.width).toEqual(width)
        })
    })
})