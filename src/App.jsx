import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { useSchedule } from './hooks/useSchedule'
import { ScheduleGrid } from './components/ScheduleGrid'
import { PersonPanel } from './components/PersonPanel'
import { RoomHeader } from './components/RoomHeader'

// Hash-based routing: #/room/:roomId
function getRoomIdFromHash() {
  const match = window.location.hash.match(/^#\/room\/([a-zA-Z0-9_-]+)$/)
  return match ? match[1] : null
}

export default function App() {
  const [roomId, setRoomId] = useState(() => getRoomIdFromHash())
  const [activePerson, setActivePerson] = useState(null)

  // 방 없으면 새로 생성
  useEffect(() => {
    if (!roomId) {
      const id = nanoid(10)
      window.location.hash = `/room/${id}`
      setRoomId(id)
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      const id = getRoomIdFromHash()
      if (id) setRoomId(id)
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const { people, schedules, loading, addPerson, saveSlots } = useSchedule(roomId)

  // 새 사람 추가 시 자동 선택
  const handleAddPerson = async (name) => {
    const id = await addPerson(name)
    // 잠시 후 선택 (Firestore 리스너가 업데이트될 때까지)
    setTimeout(() => {
      setActivePerson(prev =>
        prev ? prev : { id, name, colorIndex: people.length }
      )
    }, 500)
  }

  // people 업데이트 시 activePerson 동기화
  useEffect(() => {
    if (activePerson) {
      const updated = people.find(p => p.id === activePerson.id)
      if (updated) setActivePerson(updated)
    }
  }, [people])

  if (!roomId) return null

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
      <RoomHeader roomId={roomId} />

      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-40 flex-shrink-0 border-r border-slate-700 overflow-y-auto">
          <PersonPanel
            people={people}
            activePerson={activePerson}
            onSelectPerson={setActivePerson}
            onAddPerson={handleAddPerson}
          />
        </aside>

        {/* 그리드 */}
        <main className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              불러오는 중...
            </div>
          ) : people.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3
              text-slate-500">
              <p className="text-sm">← 왼쪽에서 사람을 추가해보세요</p>
            </div>
          ) : !activePerson ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              편집할 사람을 선택하세요
            </div>
          ) : (
            <ScheduleGrid
              people={people}
              schedules={schedules}
              activePerson={activePerson}
              onSaveSlots={saveSlots}
            />
          )}
        </main>
      </div>

      {/* 하단 상태바 */}
      {activePerson && (
        <div className="px-4 py-2 border-t border-slate-700 text-xs text-slate-400
          flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: `hsl(${(activePerson.colorIndex * 47) % 360}, 70%, 60%)`
            }}
          />
          <span>{activePerson.name}의 시간표 편집 중</span>
        </div>
      )}
    </div>
  )
}
