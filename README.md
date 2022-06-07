# react-visual-window

> React components for fast and efficiently rendering large lists

Heavily inspired by [`react-window`](https://npmjs.com/package/react-window)

React window works by only rendering *part* of a large data set (just enough to fill the viewport). This helps address some common performance bottlenecks:
1. It reduces the amount of work (and time) required to render the initial view and to process updates.
2. It reduces the memory footprint by avoiding over-allocation of DOM nodes.

[![Coverage Status](https://badgen.net/coveralls/c/github/numero33/react-visual-window/master)](https://coveralls.io/github/numero33/react-visual-window?branch=master)
[![NPM registry](https://badgen.net/npm/v/react-visual-window)](https://npmjs.com/react-visual-window)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/react-visual-window)](https://bundlephobia.com/package/react-visual-window)
[![NPM license](https://badgen.net/npm/license/react-visual-window)](LICENSE.md) 

## Install

```bash
# Yarn
yarn add react-visual-window

# NPM
npm install --save react-visual-window
```

## Usage

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

## License

MIT © [n33pm](https://github.com/n33pm)