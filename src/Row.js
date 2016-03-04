import React, {Component, PropTypes} from 'react'

import Item from './Item'

const defaultRowStyle = {
    position: `relative`,
    width: `100%`,
    marginLeft: 0,
    display: `flex`
}

class Row extends Component {

    render() {
        const {row} = this.props
        const {offsetLeft} = this.context

        const rowStyle = {
            ...defaultRowStyle,
            height: row.get(`height`),
            marginLeft: -offsetLeft
        }

        return (
            <div style={rowStyle}>
                {row
                    .get(`items`)
                    .map((item, index) => (
                        <Item key={index} item={item}/>
                    ))
                    .toArray()}
            </div>
        )
    }
}

Row.contextTypes = {
    offsetLeft: PropTypes.number
}

export default Row