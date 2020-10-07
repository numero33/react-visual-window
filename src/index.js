// @flow

import {useRef, useState, useMemo, createElement, useEffect} from "react"
import PropTypes from "prop-types"
import useScrollPosition from "./useScrollPosition"

const VisualWindow = props => {
    const {children, defaultItemHeight, itemCount, className, itemData, detectHeight} = props

    const [measurements, setMeasurement] = useState({})

    const ref = useRef(null)
    const childRef = useRef(new Map()).current
    const {position: scrollPosition} = useScrollPosition()

    useEffect(() => {
        if (!detectHeight && Object.keys(measurements).length > 0) setMeasurement({})
    }, [detectHeight, measurements])
    useEffect(() => {
        setMeasurement({})
    }, [itemData])

    const height = useMemo(() => defaultItemHeight * itemCount + Object.values(measurements).reduce((sum, val) => (sum += val.height - defaultItemHeight), 0), [defaultItemHeight, itemCount, measurements])

    const itemRenderCount = useMemo(() => (defaultItemHeight === 0 ? 0 : Math.min(Math.ceil(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / defaultItemHeight), itemCount)), [defaultItemHeight, itemCount])

    const startItem = useMemo(() => {
        if (ref.current === null && itemCount === 0) return 0

        const windowOffset = ref.current.getBoundingClientRect().top
        if (windowOffset > 0) return 0

        let tmpOffset = windowOffset
        let start = 0
        if (Object.keys(measurements).length > 0) {
            for (; start < itemCount && tmpOffset < 0; start++) tmpOffset += measurements[start] !== undefined ? measurements[start].height : defaultItemHeight
            start--
        } else start = Math.floor(Math.abs(windowOffset) / defaultItemHeight)

        const max = Math.max(itemCount - itemRenderCount, 0)

        return Math.min(Math.max(start, 0), max)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, scrollPosition, defaultItemHeight, itemCount, itemRenderCount, measurements])

    const calcChildren = useMemo(() => {
        const output = []
        for (let i = startItem; i < itemRenderCount + startItem; i++) {
            let addRef = {}

            if (typeof children === "object") {
                addRef = {
                    ref: x => {
                        if (x === null) childRef.delete(i)
                        else childRef.set(i, x)
                    },
                }
            }
            output.push(
                createElement(children, {
                    index: i,
                    data: itemData,
                    style: {
                        width: "100%",
                        height: detectHeight ? "auto" : defaultItemHeight,
                    },
                    key: i,
                    ...addRef,
                }),
            )
        }

        const measurementCorrection = Object.keys(measurements).reduce((sum, val) => (val < startItem ? sum + measurements[val].height - defaultItemHeight : sum), 0)

        return createElement(
            "div",
            {
                style: {
                    position: "absolute",
                    top: startItem * defaultItemHeight + measurementCorrection,
                    width: "100%",
                },
            },
            output,
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startItem, defaultItemHeight, itemRenderCount, children, itemData, detectHeight])

    useEffect(() => {
        if (!detectHeight) return () => {}

        const observer = new MutationObserver(() => {
            for (const [i, c] of childRef.entries()) {
                const bounding = c.getBoundingClientRect()
                if (bounding.height !== defaultItemHeight && (measurements[i] === undefined || measurements[i].height !== bounding.height)) setMeasurement(x => ({...x, [i]: bounding}))
                if (bounding.height === defaultItemHeight && measurements[i] !== undefined) {
                    setMeasurement(x => {
                        const tmp = {...x}
                        delete tmp[i]
                        return tmp
                    })
                }
            }
        })
        if (ref.current)
            observer.observe(ref.current, {
                attributes: false,
                childList: true,
                subtree: true,
            })

        return () => observer.disconnect()
    }, [childRef, defaultItemHeight, measurements, detectHeight])

    return createElement(
        "div",
        {
            ref,
            style: {position: "relative", height},
            className,
        },
        itemCount > 0 && itemRenderCount > 0 && calcChildren,
    )
}

VisualWindow.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    defaultItemHeight: PropTypes.number.isRequired,
    itemCount: PropTypes.number.isRequired,
    className: PropTypes.string,
    itemData: PropTypes.array,
    detectHeight: PropTypes.bool,
}

VisualWindow.defaultProps = {
    detectHeight: true,
}

export default VisualWindow
