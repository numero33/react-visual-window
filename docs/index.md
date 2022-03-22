---
title: Home
permalink: /
nav_order: 1
---


# react-visual-window

React components for fast and efficiently rendering large lists
Heavily inspired by [`react-window`](https://npmjs.com/package/react-window)

Zero dependencies. Tiny footprint.

React window works by only rendering *part* of a large data set (just enough to fill the viewport). This helps address some common performance bottlenecks:
1. It reduces the amount of work (and time) required to render the initial view and to process updates.
2. It reduces the memory footprint by avoiding over-allocation of DOM nodes.

# Quick Start

Getting started with [react-visual-window](https://github.com/numero33/react-visual-window)

## Installation

```bash
# Yarn
yarn add react-visual-window

# NPM
npm install --save react-visual-window
```
## Quick Start

```javascript
import VisualWindow from "react-visual-window";

const data = new Array(1000).fill(true).map((_, x) => ({
    odd: x % 2 !== 0,
}));

const Row = forwardRef((props, ref) => {
    const { data, index, style } = props;
    return (
        <div ref={ref} style={style}>
            <div>
                Row {index} - odd: {data[index].odd ? `true` : `false`}
            </div>
        </div>
    );
});


export default function App() {
    return (
        <div className="App">
            <VisualWindow
                defaultItemHeight={18}
                itemData={data}
                className="tableClass"
            >
                {Row}
            </VisualWindow>
        </div>
    );
}
```