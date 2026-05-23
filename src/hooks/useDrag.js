import { useState, useCallback, useRef } from 'react'

export function useDrag(initialSlots, onDragEnd) {
  const [localSlots, setLocalSlots] = useState(initialSlots || new Set())
  const isDragging = useRef(false)
  const mode = useRef('add')
  const currentSlots = useRef(new Set(initialSlots || []))
  const onDragEndRef = useRef(onDragEnd)
  onDragEndRef.current = onDragEnd

  const syncSlots = useCallback((newSlots) => {
    if (!isDragging.current) {
      const s = new Set(newSlots)
      currentSlots.current = s
      setLocalSlots(s)
    }
  }, [])

  const onMouseDown = useCallback((slotKey) => {
    isDragging.current = true
    setLocalSlots(prev => {
      const next = new Set(prev)
      if (next.has(slotKey)) {
        mode.current = 'remove'
        next.delete(slotKey)
      } else {
        mode.current = 'add'
        next.add(slotKey)
      }
      currentSlots.current = next
      return next
    })
  }, [])

  const onMouseEnter = useCallback((slotKey) => {
    if (!isDragging.current) return
    setLocalSlots(prev => {
      const next = new Set(prev)
      if (mode.current === 'add') next.add(slotKey)
      else next.delete(slotKey)
      currentSlots.current = next
      return next
    })
  }, [])

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    onDragEndRef.current(currentSlots.current)
  }, [])

  return { localSlots, syncSlots, onMouseDown, onMouseEnter, onMouseUp }
}
