import {useRef, useState, useMemo, createElement, useEffect, useCallback, MutableRefObject} from 'react'
import useScrollPosition from './useScrollPosition'

export interface VisualWindowProps<T> {
    children: React.FunctionComponent<VisualWindowChildProps<T>>
    defaultItemHeight: number
    itemData: Array<T>
    className?: string
    innerClassName?: string
    detectHeight?: boolean
    overhang?: number
    container?: MutableRefObject<HTMLElement | null>
}

export interface VisualWindowChildProps<T = unknown> {
    index: number
    data: Array<T>
    style: React.CSSProperties
}

export default function VisualWindow<T>({
    children,
    defaultItemHeight,
    className,
    innerClassName,
    itemData,
    detectHeight = false,
    overhang = 0,
    container,
}: VisualWindowProps<T>) {
    const itemCount = useMemo(() => itemData?.length ?? 0, [itemData])

    const [measurements, setMeasurement] = useState<{
        [k: number]: {
            width: number
            height: number
        }
    }>({})

    const mainRef = useRef<HTMLDivElement>(null)
    const childRef = useRef(new Map<number, HTMLElement>()).current

    const {y: scrollPosition} = useScrollPosition({element: container, wait: 150})

    const checkMeasurements = useCallback(() => {
        setMeasurement(x => {
            for (const [i, c] of childRef.entries()) {
                const bounding = c.getBoundingClientRect()
                if (bounding.height === 0 || bounding.width === 0) continue
                if (bounding.height !== defaultItemHeight && x?.[i]?.height !== bounding?.height)
                    x = {...x, [i]: {width: bounding.width, height: bounding.height}}
                if (bounding.height === defaultItemHeight && x[i] !== undefined) delete x[i]
            }
            return x
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultItemHeight])

    useEffect(() => {
        if (detectHeight) checkMeasurements()
        else setMeasurement({})
    }, [itemData, detectHeight, checkMeasurements])

    const height = useMemo(
        () => defaultItemHeight * itemCount + Object.values(measurements).reduce((sum, val) => (sum += val.height - defaultItemHeight), 0),
        [defaultItemHeight, itemCount, measurements],
    )

    const currentContainer = container?.current ?? undefined
    const maxViewWindow = useMemo(
        () => currentContainer?.clientHeight ?? Math.max(document?.documentElement?.clientHeight ?? 0, window?.innerHeight ?? 0),
        [currentContainer],
    )

    const windowOffset = useMemo(() => {
        if (currentContainer) return -scrollPosition
        return mainRef?.current?.getBoundingClientRect()?.top ?? 0
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollPosition, mainRef, currentContainer])

    const startItem = useMemo(() => {
        if (itemCount === 0) return 0

        let start = 0
        if (windowOffset >= 0) return start

        let tmpOffset = windowOffset

        if (Object.keys(measurements).length > 0) {
            for (; start < itemCount && tmpOffset < 0; start++) tmpOffset += measurements?.[start]?.height ?? defaultItemHeight
            start--
        } else start = Math.floor(Math.abs(tmpOffset) / defaultItemHeight)

        return Math.max(start - overhang, 0)
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
                createElement<VisualWindowChildProps<T>>(children, {
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

        const measurementCorrection = Object.keys(measurements)
            .map(Number)
            .reduce((sum, val) => (val < startItem ? sum + measurements[val].height - defaultItemHeight : sum), 0)

        return createElement(
            'div',
            {
                style: {
                    position: 'absolute',
                    top: startItem * defaultItemHeight + measurementCorrection,
                    width: '100%',
                },
                className: innerClassName,
            },
            output,
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startItem, endItem, children, itemData, detectHeight])

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
