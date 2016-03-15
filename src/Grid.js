import React, {Component} from 'react'

import {List} from 'immutable'
import Row from './Row'

const defaultContentStyle = {
    position: `relative`,
    width: `100%`,
    height: 0
}

const defaultScrollHelperStyle = {
    display: `block`,
    position: `relative`,
    width: `100%`,
    height: 0
}

class Grid extends Component {

    render() {
        const {
            height,
            rows = List(),
            offset,
            padding
            } = this.props

        const contentStyle = {
            ...defaultContentStyle,
            height,
            paddingLeft: padding,
            paddingRight: padding
        }

        const scrollHelperStyle = {
            ...defaultScrollHelperStyle,
            height: offset
        }

        return (
            <div style={contentStyle}>
                <div style={scrollHelperStyle}/>
                {rows.map((row, index) => (
                    <Row key={index} row={row}/>
                )).toArray()}
            </div>
        )
    }
}

export default Grid