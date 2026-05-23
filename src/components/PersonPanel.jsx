import { useState } from 'react'
import { getColor } from '../lib/colors'

export function PersonPanel({ people, activePerson, onSelectPerson, onAddPerson }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  const handleAdd = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    await onAddPerson(trimmed)
    setName('')
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
        팀원
      </p>

      {people.map(person => {
        const color = getColor(person.colorIndex)
        const isActive = activePerson?.id === person.id
        return (
          <button
            key={person.id}
            onClick={() => onSelectPerson(person)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm
              transition-all text-left
              ${isActive
                ? 'bg-slate-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'}`}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color.solid }}
            />
            {person.name}
          </button>
        )
      })}

      {adding ? (
        <div className="flex gap-1 mt-1">
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="이름 입력"
            className="flex-1 bg-slate-700 text-white text-sm rounded px-2 py-1
              outline-none border border-slate-500 focus:border-slate-300"
          />
          <button onClick={handleAdd}
            className="text-xs bg-slate-500 hover:bg-slate-400 text-white px-2 rounded">
            추가
          </button>
          <button onClick={() => { setAdding(false); setName('') }}
            className="text-xs text-slate-400 hover:text-white px-1">
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-1 text-xs text-slate-400 hover:text-white border border-dashed
            border-slate-600 hover:border-slate-400 rounded-lg py-2 transition-colors">
          + 사람 추가
        </button>
      )}
    </div>
  )
}
