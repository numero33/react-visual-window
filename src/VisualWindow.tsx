import {useRef, useState, useMemo, createElement, useEffect, useCallback} from "react"
import useScrollPosition from "./useScrollPosition"

interface VisualWindowProps {
    children: React.FunctionComponent
    defaultItemHeight: number
    itemData: Array<unknown>
    className?: string
    detectHeight?: boolean
}

interface VisualWindowChildProps<T> {
    index: number
    data: Array<unknown>
    style: React.CSSProperties
    ref?: React.Ref<T>
}

export function VisualWindow({children, defaultItemHeight, className, itemData, detectHeight = true}: VisualWindowProps) {
    const itemCount = useMemo(() => itemData.length, [itemData])

    const [measurements, setMeasurement] = useState<{[k: number]: DOMRect}>({})

    const ref = useRef<HTMLDivElement>(null)
    const childRef = useRef(new Map<number, HTMLElement>()).current
    const {scrollY: scrollPosition} = useScrollPosition()

    const checkMeasurements = useCallback(() => {
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
    }, [childRef, defaultItemHeight, measurements])

    useEffect(() => {
        if (!detectHeight && Object.keys(measurements).length > 0) setMeasurement({})
    }, [detectHeight, measurements])
    useEffect(() => {
        if (detectHeight) checkMeasurements()
    }, [checkMeasurements, detectHeight, itemData])

    const height = useMemo(() => defaultItemHeight * itemCount + Object.values(measurements).reduce((sum, val) => (sum += val.height - defaultItemHeight), 0), [defaultItemHeight, itemCount, measurements])

    const itemRenderCount = useMemo(() => (defaultItemHeight === 0 ? 0 : Math.min(Math.ceil(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / defaultItemHeight), itemCount)), [defaultItemHeight, itemCount])

    const startItem = useMemo(() => {
        if (ref.current === null || itemCount === 0) return 0

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
    }, [ref, scrollPosition, defaultItemHeight, itemCount, itemRenderCount, measurements])

    const calcChildren = useMemo(() => {
        const output = []
        for (let i = startItem; i < itemRenderCount + startItem; i++) {
            let addRef = {}

            if (typeof children === "object") {
                addRef = {
                    ref: (x: HTMLElement) => {
                        if (x === null) childRef.delete(i)
                        else childRef.set(i, x)
                    },
                }
            }
            output.push(
                createElement<VisualWindowChildProps<HTMLElement>>(children, {
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

        const measurementCorrection = Object.keys(measurements).reduce((sum, val: unknown) => ((val as number) < startItem ? sum + measurements[val as number].height - defaultItemHeight : sum), 0)

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
        if (!detectHeight || !ref.current) return () => {}

        const observer = new MutationObserver(() => checkMeasurements())
        observer.observe(ref.current, {
            attributes: false,
            childList: true,
            subtree: true,
        })
        return () => observer.disconnect()
    }, [detectHeight, checkMeasurements])

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
