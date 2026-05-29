import { getColor } from '../lib/colors'

export function SlotCell({ slotKey, activePeople, isMySlot, isHalfHour,
  onMouseDown, onMouseEnter }) {
  const count = activePeople.length

  return (
    <div
      className={`relative select-none cursor-pointer
        ${isHalfHour ? 'border-b border-dashed border-slate-700/50' : 'border-b border-slate-700/80'}
        h-5 min-w-0`}
      onMouseDown={() => onMouseDown(slotKey)}
      onMouseEnter={() => onMouseEnter(slotKey)}
      onTouchStart={(e) => { e.preventDefault(); onMouseDown(slotKey) }}
      onTouchMove={(e) => {
        e.preventDefault()
        const touch = e.touches[0]
        const el = document.elementFromPoint(touch.clientX, touch.clientY)
        if (el?.dataset?.slot) onMouseEnter(el.dataset.slot)
      }}
      data-slot={slotKey}
    >
      {/* 각 인물의 반투명 레이어 */}
      {activePeople.map(person => (
        <div
          key={person.id}
          className="absolute inset-0"
          style={{ backgroundColor: getColor(person.colorIndex).rgba }}
        />
      ))}

      {/* 내 슬롯 테두리 강조 */}
      {isMySlot && (
        <div className="absolute inset-0 ring-inset ring-1 ring-white/30 pointer-events-none" />
      )}

      {/* 중첩 숫자 배지 */}
      {count >= 2 && (
        <span
          className="absolute bottom-0 right-0.5 text-[7px] font-black leading-none z-10
            drop-shadow-[0_0_2px_rgba(0,0,0,0.9)]"
          style={{ color: 'white' }}
        >
          {count}
        </span>
      )}
    </div>
  )
}