import { useCallback, useEffect } from 'react'
import { SlotCell } from './SlotCell'
import { useDrag } from '../hooks/useDrag'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const DAY_KEYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

// 00:00 ~ 23:30 → 48슬롯
const SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

export function ScheduleGrid({ people, schedules, activePerson, onSaveSlots }) {
  const mySlots = schedules[activePerson?.id] || new Set()

  const handleDragEnd = useCallback((slots) => {
    if (activePerson) onSaveSlots(activePerson.id, slots)
  }, [activePerson, onSaveSlots])

  const { localSlots, syncSlots, onMouseDown, onMouseEnter, onMouseUp } =
    useDrag(mySlots, handleDragEnd)

  // 다른 사람이 내 슬롯을 바꿀 경우 동기화 (실제로는 자기 것만 수정하므로 거의 없음)
  useEffect(() => { syncSlots(mySlots) }, [schedules, activePerson?.id])

  return (
    <div
      className="overflow-auto"
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchEnd={onMouseUp}
    >
      <div className="inline-grid min-w-full" style={{
        gridTemplateColumns: '3rem repeat(7, minmax(2.5rem, 1fr))'
      }}>
        {/* 헤더 */}
        <div className="sticky top-0 bg-slate-900 z-20" />
        {DAYS.map((d, i) => (
          <div key={i} className="sticky top-0 bg-slate-900 z-20 text-center text-xs
            font-semibold text-slate-300 py-1 border-b border-slate-700">
            {d}
          </div>
        ))}

        {/* 슬롯 rows */}
        {SLOTS.map((time, ti) => (
          <>
            {/* 시간 레이블 (정시만) */}
            <div key={`t-${ti}`} className="text-right pr-1 text-[9px] text-slate-500
              leading-none flex items-start justify-end pt-0.5"
              style={{ gridRow: ti + 2 }}>
              {ti % 2 === 0 ? time : ''}
            </div>

            {DAY_KEYS.map((dayKey, di) => {
              const slotKey = `${dayKey}-${time}`
              const activePeople = people.filter(p => {
                const s = p.id === activePerson?.id ? localSlots : schedules[p.id]
                return s?.has(slotKey)
              })
              const isMySlot = activePerson ? localSlots.has(slotKey) : false

              return (
                <SlotCell
                  key={slotKey}
                  slotKey={slotKey}
                  activePeople={activePeople}
                  isMySlot={isMySlot}
                  isHalfHour={ti % 2 === 1}
                  onMouseDown={onMouseDown}
                  onMouseEnter={onMouseEnter}
                />
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}
