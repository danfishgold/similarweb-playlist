import React from 'react'

export default function useDelay(
  time: number,
): [(fn: () => void) => void, () => void] {
  const lastEvent = React.useRef<Date | null>(null)
  const timeout = React.useRef<NodeJS.Timeout | null>(null)

  const possiblyDelay = React.useCallback(
    (fn: () => void) => {
      if (!lastEvent.current) {
        fn()
      } else {
        const timeSinceLastEvent = Date.now() - lastEvent.current.getTime()
        if (timeSinceLastEvent >= time) {
          fn()
        } else {
          timeout.current = setTimeout(fn, time - timeSinceLastEvent)
        }
      }
    },
    [time],
  )

  const reset = React.useCallback(() => {
    timeout.current && clearTimeout(timeout.current)
    lastEvent.current = new Date()
  }, [timeout, lastEvent])

  return [possiblyDelay, reset]
}
