# Freezable React Table

Simple React table with feature to freeze rows and columns. The component is built over `React`, `TypeScript` and `styled-components`.

## Features

- 0 dependencies, no css import necessary, no js, highly performant.
- 0, 1, or AS MANY sticky headers, left columns, right columns, footers as you want.
- Responsive table dimensions (wrap it in any size container and it will fill that container)
- Dynamic row height & column width (no need to specify fixed width/height in pixels)
- Table rows/columns resize as content resizes
- Custom cells
- Multiple tables per page
- Scrollbars that are smooth and visible at all times
- Native scrolling

## Example
```javascript
import React, {Component} from 'react';
import {FreezableTable, Row, Cell} from 'freezableReactTable';

export default class BasicExample extends Component {
  render() {
    return (
      <div>
        <div style={{width: '100%', height: '400px'}}>
          <FreezableTable>
            <Row>
              <Cell>Header 1</Cell>
              <Cell>Header 2</Cell>
            </Row>
            <Row>
              <Cell>Cell 1</Cell>
              <Cell>Cell 2</Cell>
            </Row>
          </StickyTable>
        </div>
      </div>
    );
  }
}
```

## Props

- sticky count
  - `stickyHeaderCount`: `int` - default: `1`
  - `leftStickyColumnCount`: `int` - default: `1`
  - `rightStickyColumnCount`: `int` - default: `0`
  - `stickyFooterCount`: `int` - default: `0`
- z-index
  - `headerZ`: `int` - default: `2` (sticky corners are the greater of their two sides + 1)
  - `leftColumnZ`: `int` - default: `2`
  - `rightColumnZ`: `int` - default: `2`
  - `footerZ`: `int` - default: `2`
- border
  - `borderWidth`: default: `'2px'`
  - `borderColor`: default: `'#e5e5e5'`
- `wrapperRef`: default: `undefined`, value: `React ref` - a reference you can use for the wrapper element that has scroll events on it

Disable sticky header:

```javascript
<FreezableTable stickyHeaderCount={0}>
```

Disable sticky column:

```javascript
<FreezableTable leftStickyColumnCount={0}>
```

Disable borders:

```javascript
<FreezableTable borderWidth={0}>
```
