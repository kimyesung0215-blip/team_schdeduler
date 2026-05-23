import { getColor } from '../lib/colors'

// 하나의 30분 슬롯 셀
// - people: 이 슬롯을 체크한 인물 배열
// - isEditing: 현재 편집 중인 인물이 이 슬롯을 선택했는지
export function SlotCell({ slotKey, activePeople, isMySlot, isHalfHour,
  onMouseDown, onMouseEnter }) {

  const count = activePeople.length

  return (
    <div
      className={`relative select-none cursor-pointer border-slate-700
        ${isHalfHour ? 'border-b border-dashed' : 'border-b'}
        ${isMySlot ? 'ring-inset ring-1 ring-white/20' : ''}
        h-4 min-w-0`}
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

      {/* 중첩 숫자 배지 */}
      {count >= 2 && (
        <span className="absolute bottom-0 right-0.5 text-[8px] font-bold text-white/80 leading-none z-10">
          {count}
        </span>
      )}
    </div>
  )
}
