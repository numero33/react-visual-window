import {useRef, useState, useMemo, createElement, useEffect, useCallback} from 'react'
import useScrollPosition from './useScrollPosition'

export interface VisualWindowProps {
    children: unknown
    defaultItemHeight: number
    itemData: Array<unknown>
    className?: string
    detectHeight?: boolean
    overhang?: number
}

export interface VisualWindowChildProps {
    index: number
    data: Array<unknown>
    style: React.CSSProperties
}

export default function VisualWindow({children, defaultItemHeight, className, itemData, detectHeight = true, overhang = 0}: VisualWindowProps) {
    const itemCount = useMemo(() => itemData?.length ?? 0, [itemData])

    const [measurements, setMeasurement] = useState<{
        [k: number]: {
            width: number
            height: number
        }
    }>({})

    const mainRef = useRef<HTMLDivElement>(null)
    const childRef = useRef(new Map<number, HTMLElement>()).current
    const {scrollY: scrollPosition} = useScrollPosition()

    const checkMeasurements = useCallback(() => {
        for (const [i, c] of childRef.entries()) {
            const bounding = c.getBoundingClientRect()
            if (bounding.height === 0 || bounding.width === 0) continue

            if (bounding.height !== defaultItemHeight && measurements?.[i]?.height !== bounding?.height)
                setMeasurement(x => ({...x, [i]: {width: bounding.width, height: bounding.height}}))
            if (bounding.height === defaultItemHeight && measurements[i] !== undefined) {
                setMeasurement(x => {
                    const tmp = {...x}
                    delete tmp[i]
                    return tmp
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultItemHeight])

    useEffect(() => checkMeasurements(), [checkMeasurements])

    useEffect(() => setMeasurement({}), [itemData])

    const height = useMemo(
        () => defaultItemHeight * itemCount + Object.values(measurements).reduce((sum, val) => (sum += val.height - defaultItemHeight), 0),
        [defaultItemHeight, itemCount, measurements],
    )

    const maxViewWindow = useMemo(() => Math.max(document?.documentElement?.clientHeight ?? 0, window?.innerHeight ?? 0), [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const windowOffset = useMemo(() => mainRef?.current?.getBoundingClientRect()?.top ?? 0, [scrollPosition, mainRef])

    const startItem = useMemo(() => {
        if (itemCount === 0) return 0

        let start = 0
        if (windowOffset < 0) {
            let tmpOffset = windowOffset

            if (Object.keys(measurements).length > 0) {
                for (; start < itemCount && tmpOffset < 0; start++) tmpOffset += measurements?.[start]?.height ?? defaultItemHeight
                start--
            } else start = Math.floor(Math.abs(windowOffset) / defaultItemHeight)

            start = Math.max(start - overhang, 0)
        }
        return start
    }, [windowOffset, defaultItemHeight, itemCount, measurements, overhang])

    const endItem = useMemo(() => {
        if (itemCount === 0) return 0

        let end = startItem
        let height = 0

        if (Object.keys(measurements).length > 0) {
            while (height <= maxViewWindow + (measurements?.[startItem]?.height ?? defaultItemHeight)) {
                height += measurements?.[end]?.height ?? defaultItemHeight
                end++
            }
        } else end = Math.ceil(maxViewWindow / defaultItemHeight) + startItem

        return Math.max(Math.min(end + overhang, itemCount - 1), 0)
    }, [startItem, defaultItemHeight, itemCount, measurements, maxViewWindow, overhang])

    const calcChildren = useMemo(() => {
        const output = []
        for (let i = startItem; i <= endItem; i++) {
            let addRef = {}

            if (typeof children === 'object') {
                addRef = {
                    ref: (x: HTMLElement) => {
                        if (x === null) childRef.delete(i)
                        else childRef.set(i, x)
                    },
                }
            }
            output.push(
                createElement<VisualWindowChildProps>(children as React.FunctionComponent, {
                    index: i,
                    data: itemData,
                    style: {
                        width: '100%',
                        height: detectHeight ? 'auto' : defaultItemHeight,
                    },
                    key: i,
                    ...addRef,
                }),
            )
        }

        const measurementCorrection = Object.keys(measurements).reduce(
            (sum, val: unknown) => ((val as number) < startItem ? sum + measurements[val as number].height - defaultItemHeight : sum),
            0,
        )

        return createElement(
            'div',
            {
                style: {
                    position: 'absolute',
                    top: startItem * defaultItemHeight + measurementCorrection,
                    width: '100%',
                },
            },
            output,
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startItem, endItem, children, itemData, detectHeight, defaultItemHeight])

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        if (!detectHeight || !mainRef.current) return () => {}

        const observer = new MutationObserver(() => checkMeasurements())
        observer.observe(mainRef.current, {
            attributes: false,
            childList: true,
            subtree: true,
        })
        return () => observer.disconnect()
    }, [detectHeight, checkMeasurements])

    return createElement(
        'div',
        {
            ref: mainRef,
            style: {position: 'relative', height},
            className,
        },
        itemCount > 0 && calcChildren,
    )
}
