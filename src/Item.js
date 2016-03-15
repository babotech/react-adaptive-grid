import React, {Component, PropTypes} from 'react'

const defaultItemStyle = {
    display: `inline-block`,
    position: `relative`,
    marginLeft: 0
}

class Item extends Component {
    render() {
        const {item} = this.props
        const {ItemComponent, additionalHeight, offsetLeft} = this.context

        const itemStyle = {
            ...defaultItemStyle,
            marginLeft: offsetLeft
        }

        return (
            <div style={itemStyle}>
                <ItemComponent data={item} additionalHeight={additionalHeight}/>
            </div>
        )
    }
}

Item.contextTypes = {
    ItemComponent: PropTypes.func,
    offsetLeft: PropTypes.number,
    additionalHeight: PropTypes.number
}

export default Item