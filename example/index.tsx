import "react-app-polyfill/ie11"
import * as React from "react"
import * as ReactDOM from "react-dom"
import VisualWindow, {VisualWindowChildProps} from "../src"

interface IData {
    odd: boolean
}

const data = new Array(1000).fill(true).map(
    (_, x) =>
        ({
            odd: x % 2 !== 0,
        } as IData),
)

const Row = React.forwardRef<HTMLDivElement, VisualWindowChildProps>((props, ref) => {
    const {data, index, style} = props
    return (
        <div ref={ref} style={style}>
            <div>
                Row {index} - odd: {(data as IData[])[index].odd ? `true` : `false`}
            </div>
        </div>
    )
})

const App = () => {
    return (
        <div>
            <VisualWindow defaultItemHeight={18} itemData={data} className="tableClass">
                {Row}
            </VisualWindow>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
