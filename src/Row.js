import React, {Component} from 'react'

import Item from './Item'

const defaultRowStyle = {
    position: `relative`,
    width: `100%`,
    marginLeft: 0,
    display: `flex`
}

class Row extends Component {

    render() {
        const {row, offsetLeft} = this.props

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

export default Row