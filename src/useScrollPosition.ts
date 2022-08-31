import {MutableRefObject, useLayoutEffect, useEffect, useState} from 'react'

type ElementRef = MutableRefObject<HTMLElement | null>
const isBrowser = typeof window !== `undefined`
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const getScrollPosition = ({element}: {element?: HTMLElement}) => {
    if (!isBrowser) return {x: 0, y: 0}
    if (element) return {x: element.scrollLeft, y: element.scrollTop}
    return {x: window.scrollX, y: window.scrollY}
}

export interface useScrollPositionProps {
    element?: ElementRef
    wait?: number
}

export interface useScrollPositionReturn {
    x: number
    y: number
}

export default function useScrollPosition({element, wait}: useScrollPositionProps): useScrollPositionReturn {
    const useElement = element?.current ?? undefined
    const [position, setPosition] = useState({} as useScrollPositionReturn)

    let throttleTimeout: number | null = null

    const callBack = () => {
        setPosition(getScrollPosition({element: useElement}))
        throttleTimeout = null
    }

    useIsomorphicLayoutEffect(() => {
        if (!isBrowser) return undefined

        const handleScroll = () => {
            if (throttleTimeout === null && wait) throttleTimeout = window.setTimeout(callBack, wait)
            else callBack()
        }

        const container = useElement ?? window
        container?.addEventListener('scroll', handleScroll, {passive: true})

        return () => {
            container?.removeEventListener('scroll', handleScroll)
            if (throttleTimeout) clearTimeout(throttleTimeout)
        }
    }, [useElement])

    return position
}
