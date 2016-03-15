# React Adaptive Grid [![Build Status](https://travis-ci.org/babotech/react-adaptive-grid.svg?branch=master)](https://travis-ci.org/babotech/react-adaptive-grid)

## Installation

```
npm install --save react-adaptive-grid
```

## Features

*  *windowing* - render only visible items
*  relative positioning - all items position relative each other
*  scale items in proportion

## Usage
```javascript
import Grid from 'react-adaptive-grid'

// Regular array or Immutable.js List
const items = List([
    Map({id:1, foo: 'bar', width: 200, height: 300}),
    ...
])

// Your component must accept 'data' prop.
const ItemComponent = ({data, width, height, additionalHeight}) => (
    ...
)

const props = {
    ItemComponent,
    items,
    minWidth: 200
}

...
<Grid {...props}/>
```

## Infinite scroll

```javascript
const props = {
    ItemComponent,
    items,
    minWidth,
    load: () => ( /* load more items */ ),
    more: Boolean, // has more
    loading: Boolean
}

<Grid {...props} />
```

## Example

[Watch here](http://babotech.github.io/react-adaptive-grid/)

## License

**MIT**