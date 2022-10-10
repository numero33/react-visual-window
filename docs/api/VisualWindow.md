---
title: "VisualWindow"
permalink: /visual-window/
nav_order: 2
---

# `VisualWindow`

## API

```typescript
function VisualWindow(
    children: unknown,
    defaultItemHeight: number,
    itemData: Array<unknown>,
    className?: string,
    detectHeight?: boolean,
    overhang?: number,
): JSX.Element

```

## Basic

```jsx
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
            >
                {Row}
            </VisualWindow>
        </div>
    );
}
```