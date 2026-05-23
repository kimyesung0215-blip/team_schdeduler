import { useState, useCallback, useRef } from 'react'

// 드래그로 슬롯을 칠하는 로직
// - 드래그 시작 시 add/remove 모드 결정 (이미 칠해진 칸이면 지우기)
// - 드래그 중에는 로컬 상태만 업데이트
// - 드래그 끝날 때 onDragEnd(slotsSet) 콜백으로 batch write 트리거
export function useDrag(initialSlots, onDragEnd) {
  const [localSlots, setLocalSlots] = useState(initialSlots || new Set())
  const isDragging = useRef(false)
  const mode = useRef('add') // 'add' | 'remove'

  // 외부에서 slots가 바뀌면 동기화 (다른 사람이 수정 시)
  const syncSlots = useCallback((newSlots) => {
    if (!isDragging.current) {
      setLocalSlots(new Set(newSlots))
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
      return next
    })
  }, [])

  const onMouseEnter = useCallback((slotKey) => {
    if (!isDragging.current) return
    setLocalSlots(prev => {
      const next = new Set(prev)
      if (mode.current === 'add') next.add(slotKey)
      else next.delete(slotKey)
      return next
    })
  }, [])

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    setLocalSlots(prev => {
      onDragEnd(prev) // Firestore batch write
      return prev
    })
  }, [onDragEnd])

  return { localSlots, syncSlots, onMouseDown, onMouseEnter, onMouseUp }
}
