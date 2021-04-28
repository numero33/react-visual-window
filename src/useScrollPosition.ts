import {useEffect, useState} from "react"

const getPosition = (isClient: boolean) => {
    return {
        scrollY: isClient ? window.scrollY : undefined,
    }
}

export default function useScrollPosition() {
    const isClient = typeof window === "object"

    const [scrollPosition, setScrollPosition] = useState(getPosition(isClient))

    useEffect(() => {
        if (!isClient) return undefined

        function handleScroll() {
            setScrollPosition(getPosition(isClient))
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [isClient])

    return scrollPosition
}
