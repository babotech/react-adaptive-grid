import {List, Map} from 'immutable'
import React, {Component, PropTypes} from 'react'

const defaultItemStyle = {
    display: `inline-block`,
    position: `relative`,
    marginLeft: 0
}

const getDataPridicate = item => i => item.get(`id`) === i.get(`id`)

class Item extends Component {
    render() {
        const {item = Map()} = this.props
        const {ItemComponent, additionalHeight, items, offsetLeft} = this.context

        const itemStyle = {
            ...defaultItemStyle,
            marginLeft: offsetLeft
        }

        const data = items.find(getDataPridicate(item))

        const props = {
            additionalHeight,
            data,
            height: item.get(`height`),
            width: item.get(`width`)
        }

        return (
            <div style={itemStyle}>
                <ItemComponent {...props} />
            </div>
        )
    }
}

Item.contextTypes = {
    ItemComponent: PropTypes.func,
    offsetLeft: PropTypes.number,
    items: PropTypes.instanceOf(List),
    additionalHeight: PropTypes.number
}

export default Item