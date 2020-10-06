import {useEffect, useState} from "react"

const getPosition = isClient => {
    return {
        position: isClient ? window.scrollY : undefined,
    }
}

export default function useScrollPosition() {
    const isClient = typeof window === "object"

    const [scrollPosition, setScrollPosition] = useState(getPosition(isClient))

    useEffect(() => {
        if (!isClient) return false

        function handleScroll() {
            setScrollPosition(getPosition(isClient))
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [isClient])

    return scrollPosition
}
