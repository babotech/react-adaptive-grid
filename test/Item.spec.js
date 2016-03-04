import React, {Component, PropTypes} from 'react'

import Item from '../src/Item'
import TestUtils from 'react-addons-test-utils'

import contextify from 'react-contextify'
import expect from 'expect'
import rndoam from 'rndoam'

describe(`react-adaptive-grid`, () => {
    describe(`Item`, () => {
        class ItemComponentMock extends Component {
            render() {
                return <div />
            }
        }

        const WithContext = contextify({
            ItemComponent: PropTypes.func,
            offsetLeft: PropTypes.number
        }, ({ItemComponent, offsetLeft}) => ({
            ItemComponent,
            offsetLeft
        }))(Item)

        it(`should receive item props from the context`, () => {

            const props = {
                ItemComponent: ItemComponentMock,
                offsetLeft: rndoam.number()
            }

            const tree = TestUtils.renderIntoDocument(
                <WithContext {...props} />
            )

            const item = TestUtils.findRenderedComponentWithType(tree, Item)

            expect(item.context).toEqual(props)
        })

        it(`should transfer props into the ItemComponent`, () => {
            const props = {
                ItemComponent: ItemComponentMock,
                item: rndoam.object()
            }

            const tree = TestUtils.renderIntoDocument(
                <WithContext {...props} />
            )

            const item = TestUtils.findRenderedComponentWithType(tree, ItemComponentMock)

            expect(item.props.data).toEqual(props.item)
        })
    })
})