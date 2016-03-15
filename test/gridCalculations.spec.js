/* eslint-disable no-magic-numbers */

import {List, Map} from 'immutable'

import {calcGrid, calcGridRow, calcVisibleGrid, insertItems} from '../src/gridCalculations'

import expect from 'expect'
import expectImmutable from 'expect-immutable'

expect.extend(expectImmutable)

describe(`react-adaptive-grid`, () => {

    describe(`gridCalculations`, () => {

        describe(`calcGridRow->`, () => {

            it(`should return a list width exact width`, () => {
                const items = List([
                    Map({
                        height: 100,
                        width: 250
                    }),
                    Map({
                        height: 150,
                        width: 300
                    }),
                    Map({
                        height: 200,
                        width: 200
                    })
                ])

                const containerWidth = 1100
                const top = 100
                const additionalHeight = 130
                const minWidth = 200

                expect(calcGridRow(top, items, containerWidth, additionalHeight, minWidth))
                    .toEqualImmutable(
                        Map({
                            extraItems: List(),
                            row: Map({
                                items: List([
                                    Map({
                                        origHeight: 100,
                                        origWidth: 250,
                                        height: 200,
                                        width: 500
                                    }),
                                    Map({
                                        origHeight: 150,
                                        origWidth: 300,
                                        height: 200,
                                        width: 400
                                    }),
                                    Map({
                                        origHeight: 200,
                                        origWidth: 200,
                                        height: 200,
                                        width: 200
                                    })
                                ]),
                                top,
                                height: 330
                            })
                        })
                    )
            })

            it(`should pop extra items`, () => {
                const items = List([
                    Map({
                        height: 100,
                        width: 250
                    }),
                    Map({
                        height: 150,
                        width: 300
                    }),
                    Map({
                        height: 200,
                        width: 200
                    }),
                    Map({
                        height: 200,
                        width: 150
                    })
                ])

                const containerWidth = 900
                const top = 100
                const additionalHeight = 130
                const minWidth = 300

                expect(calcGridRow(top, items, containerWidth, additionalHeight, minWidth))
                    .toEqualImmutable(
                        Map({
                            extraItems: List([
                                Map({
                                    height: 200,
                                    width: 200
                                }),
                                Map({
                                    height: 200,
                                    width: 150
                                })
                            ]),
                            row: Map({
                                items: List([
                                    Map({
                                        origHeight: 100,
                                        origWidth: 250,
                                        height: 200,
                                        width: 500
                                    }),
                                    Map({
                                        origHeight: 150,
                                        origWidth: 300,
                                        height: 200,
                                        width: 400
                                    })
                                ]),
                                top,
                                height: 330
                            })
                        })
                    )
            })

            it(`should calculate row taking in account offset left`, () => {
                const items = List([
                    Map({
                        height: 200,
                        width: 250
                    }),
                    Map({
                        height: 200,
                        width: 300
                    }),
                    Map({
                        height: 200,
                        width: 200
                    })
                ])

                const containerWidth = 850
                const top = 100
                const additionalHeight = 130
                const offsetLeft = 50
                const minWidth = 200

                expect(calcGridRow(top, items, containerWidth, additionalHeight, minWidth, offsetLeft))
                    .toEqualImmutable(
                        Map({
                            extraItems: List(),
                            row: Map({
                                items: List([
                                    Map({
                                        origHeight: 200,
                                        origWidth: 250,
                                        height: 200,
                                        width: 250
                                    }),
                                    Map({
                                        origHeight: 200,
                                        origWidth: 300,
                                        height: 200,
                                        width: 300
                                    }),
                                    Map({
                                        origHeight: 200,
                                        origWidth: 200,
                                        height: 200,
                                        width: 200
                                    })
                                ]),
                                top,
                                height: 330
                            })
                        })
                    )
            })

            it(`should only lead items to the same height`, () => {
                const items = List([
                    Map({
                        height: 100,
                        width: 250
                    }),
                    Map({
                        height: 200,
                        width: 200
                    }),
                    Map({
                        height: 300,
                        width: 300
                    })
                ])

                const containerWidth = 900
                const top = 100
                const additionalHeight = 130
                const offsetLeft = 50
                const minWidth = 200

                expect(calcGridRow(top, items, containerWidth, additionalHeight, minWidth, offsetLeft, false))
                    .toEqualImmutable(
                        Map({
                            extraItems: List(),
                            row: Map({
                                items: List([
                                    Map({
                                        origHeight: 100,
                                        origWidth: 250,
                                        height: 200,
                                        width: 500
                                    }),
                                    Map({
                                        origHeight: 200,
                                        origWidth: 200,
                                        height: 200,
                                        width: 200
                                    }),
                                    Map({
                                        origHeight: 300,
                                        origWidth: 300,
                                        height: 200,
                                        width: 200
                                    })
                                ]),
                                top,
                                height: 330
                            })
                        })
                    )
            })

            it(`should pop extra items while leading to min width`, () => {
                const items = List([
                    Map({
                        height: 100,
                        width: 250
                    }),
                    Map({
                        height: 200,
                        width: 200
                    }),
                    Map({
                        height: 300,
                        width: 300
                    })
                ])

                const containerWidth = 800
                const top = 100
                const additionalHeight = 130
                const offsetLeft = 50
                const minWidth = 200

                expect(calcGridRow(top, items, containerWidth, additionalHeight, minWidth, offsetLeft, false))
                    .toEqualImmutable(
                        Map({
                            extraItems: List([
                                Map({
                                    height: 300,
                                    width: 300
                                })
                            ]),
                            row: Map({
                                items: List([
                                    Map({
                                        origHeight: 100,
                                        origWidth: 250,
                                        height: 200,
                                        width: 500
                                    }),
                                    Map({
                                        origHeight: 200,
                                        origWidth: 200,
                                        height: 200,
                                        width: 200
                                    })
                                ]),
                                top,
                                height: 330
                            })
                        })
                    )
            })
        })

        describe(`calcGrid->`, () => {
            it(`should fit items into 1100px`, () => {
                const items = List([
                    Map({
                        height: 100,
                        width: 250
                    }),
                    Map({
                        height: 150,
                        width: 300
                    }),
                    Map({
                        height: 200,
                        width: 200
                    })
                ])

                const containerWidth = 1100
                const additionalHeight = 130
                const minWidth = 200

                expect(calcGrid(items, additionalHeight, containerWidth, minWidth))
                    .toEqualImmutable(Map({
                        rows: List([
                            Map({
                                items: List([
                                    Map({
                                        origHeight: 100,
                                        origWidth: 250,
                                        height: 200,
                                        width: 500
                                    }),
                                    Map({
                                        origHeight: 150,
                                        origWidth: 300,
                                        height: 200,
                                        width: 400
                                    }),
                                    Map({
                                        origHeight: 200,
                                        origWidth: 200,
                                        height: 200,
                                        width: 200
                                    })
                                ]),
                                top: 0,
                                height: 330
                            })
                        ]),
                        height: 330
                    }))
            })


            it(`should fit two rows into 1100px with correct top values`, () => {
                const items = List([
                    Map({
                        height: 100,
                        width: 250
                    }),
                    Map({
                        height: 150,
                        width: 300
                    }),
                    Map({
                        height: 200,
                        width: 200
                    }),
                    Map({
                        height: 100,
                        width: 250
                    }),
                    Map({
                        height: 150,
                        width: 300
                    }),
                    Map({
                        height: 200,
                        width: 200
                    })
                ])
                const containerWidth = 1100
                const additionalHeight = 130

                expect(calcGrid(items, additionalHeight, containerWidth).size)
                    .toEqual(2)
            })

            it(`should calculate right tops`, () => {
                const items = List([
                    Map({
                        height: 10,
                        width: 10
                    }),
                    Map({
                        height: 10,
                        width: 10
                    }),
                    Map({
                        height: 10,
                        width: 10
                    })
                ])
                const containerWidth = 10
                const additionalHeight = 130
                const minWidth = 10
                const grid = calcGrid(items, additionalHeight, containerWidth, minWidth)

                expect(grid.get(`rows`).reduce((acc, item) => [ ...acc, item.get(`top`) ], []))
                    .toEqual([ 0, 140, 280 ])
                expect(grid.get(`height`))
                    .toEqual(420)
            })

            it(`should fit items taking into account min. width limit`, () => {
                const items = List([
                    Map({
                        height: 200,
                        width: 100
                    }),
                    Map({
                        height: 200,
                        width: 200
                    }),
                    Map({
                        height: 200,
                        width: 300
                    })
                ])

                const containerWidth = 600
                const additionalHeight = 130
                const minWidth = 200

                expect(calcGrid(items, additionalHeight, containerWidth, minWidth))
                    .toEqualImmutable(
                        Map({
                            rows: List([
                                Map({
                                    items: List([
                                        Map({
                                            origHeight: 200,
                                            origWidth: 100,
                                            height: 400,
                                            width: 200
                                        }),
                                        Map({
                                            origHeight: 200,
                                            origWidth: 200,
                                            height: 400,
                                            width: 400
                                        })
                                    ]),
                                    top: 0,
                                    height: 530
                                }),
                                Map({
                                    items: List([
                                        Map({
                                            origHeight: 200,
                                            origWidth: 300,
                                            height: 200,
                                            width: 300
                                        })
                                    ]),
                                    top: 530,
                                    height: 330
                                })
                            ]),
                            height: 860
                        })
                    )
            })

            it(`should calculate grid taking into account padding`, () => {
                const items = List([
                    Map({
                        height: 100,
                        width: 100
                    }),
                    Map({
                        height: 100,
                        width: 100
                    })
                ])

                const additionalHeight = 0
                const containerWidth = 300
                const padding = 100
                const minWidth = 100
                const offsetLeft = 0

                expect(calcGrid(items, additionalHeight, containerWidth, minWidth, offsetLeft, padding, padding))
                    .toEqualImmutable(
                        Map({
                            rows: List([
                                Map({
                                    items: List([
                                        Map({
                                            origHeight: 100,
                                            origWidth: 100,
                                            height: 100,
                                            width: 100
                                        })
                                    ]),
                                    top: 100,
                                    height: 100
                                }),
                                Map({
                                    items: List([
                                        Map({
                                            origHeight: 100,
                                            origWidth: 100,
                                            height: 100,
                                            width: 100
                                        })
                                    ]),
                                    top: 200,
                                    height: 100
                                })
                            ]),
                            height: 300
                        })
                    )
            })
        })

        describe(`calcVisibleGrid->`, () => {
            it(`should render only 1 row`, () => {
                const grid = Map({
                    rows: List([
                        Map({
                            items: List(),
                            top: 0,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 140,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 280,
                            height: 140
                        })
                    ]),
                    height: 420
                })
                const visibleAreaHeight = 140
                const offset = 140

                expect(calcVisibleGrid(grid, visibleAreaHeight, offset))
                    .toEqualImmutable(Map({
                        rows: List([
                            Map({
                                items: List(),
                                top: 140,
                                height: 140
                            })
                        ]),
                        shouldLoad: false,
                        height: 420
                    }))
            })

            it(`should render only 2 rows`, () => {
                const grid = Map({
                    rows: List([
                        Map({
                            items: List(),
                            top: 0,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 140,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 280,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 420,
                            height: 140
                        })
                    ]),
                    height: 560
                })
                const visibleAreaHeight = 240
                const offset = 140

                expect(calcVisibleGrid(grid, visibleAreaHeight, offset))
                    .toEqualImmutable(Map({
                        rows: List([
                            Map({
                                items: List(),
                                top: 140,
                                height: 140
                            }),
                            Map({
                                items: List(),
                                top: 280,
                                height: 140
                            })
                        ]),
                        shouldLoad: false,
                        height: 560
                    }))
            })

            it(`should render rows if partially visible`, () => {
                const grid = Map({
                    rows: List([
                        Map({
                            items: List(),
                            top: 0,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 140,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 280,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 420,
                            height: 140
                        })
                    ]),
                    height: 560
                })
                const visibleAreaHeight = 240
                const offset = 130

                expect(calcVisibleGrid(grid, visibleAreaHeight, offset))
                    .toEqualImmutable(Map({
                        rows: List([
                            Map({
                                items: List(),
                                top: 0,
                                height: 140
                            }),
                            Map({
                                items: List(),
                                top: 140,
                                height: 140
                            }),
                            Map({
                                items: List(),
                                top: 280,
                                height: 140
                            })
                        ]),
                        shouldLoad: false,
                        height: 560
                    }))
            })

            it(`should exclude last row`, () => {
                const grid = Map({
                    rows: List([
                        Map({
                            items: List(),
                            top: 0,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 140,
                            height: 140
                        }),
                        Map({
                            items: List(),
                            top: 280,
                            height: 140
                        })
                    ]),
                    height: 420
                })
                const visibleAreaHeight = 240
                const offset = 130

                expect(calcVisibleGrid(grid, visibleAreaHeight, offset, true))
                    .toEqualImmutable(Map({
                        rows: List([
                            Map({
                                items: List(),
                                top: 0,
                                height: 140
                            }),
                            Map({
                                items: List(),
                                top: 140,
                                height: 140
                            })
                        ]),
                        shouldLoad: true,
                        height: 280
                    }))
            })
        })

        describe(`insertItems->`, () => {
            it(`should insert items`, () => {
                const initialGrid = Map({
                    rows: List([
                        Map({
                            items: List(),
                            top: 0,
                            height: 140
                        }),
                        Map({
                            items: List([
                                Map({
                                    origWidth: 200,
                                    origHeight: 200
                                })
                            ]),
                            top: 140,
                            height: 140
                        })
                    ]),
                    height: 280
                })

                const additionalHeight = 0
                const containerWidth = 400

                const items = List([
                    Map({
                        width: 200,
                        height: 200
                    }),
                    Map({
                        width: 200,
                        height: 200
                    })
                ])

                expect(insertItems(initialGrid, items, additionalHeight, containerWidth))
                    .toEqualImmutable(Map({
                        rows: List([
                            Map({
                                items: List(),
                                top: 0,
                                height: 140
                            }),
                            Map({
                                items: List([
                                    Map({
                                        width: 200,
                                        height: 200,
                                        origWidth: 200,
                                        origHeight: 200
                                    }),
                                    Map({
                                        width: 200,
                                        height: 200,
                                        origWidth: 200,
                                        origHeight: 200
                                    })
                                ]),
                                top: 140,
                                height: 200
                            }),
                            Map({
                                items: List([
                                    Map({
                                        width: 200,
                                        height: 200,
                                        origWidth: 200,
                                        origHeight: 200
                                    })
                                ]),
                                top: 340,
                                height: 200
                            })
                        ]),
                        height: 540
                    }))
            })
        })
    })
})
