import { useState } from 'react'

export function RoomHeader({ roomId }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/team-scheduler/#/room/${roomId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
      <div>
        <h1 className="text-white font-bold text-sm">팀 스케줄러</h1>
        <p className="text-slate-400 text-xs mt-0.5">방 ID: {roomId}</p>
      </div>
      <button
        onClick={handleCopy}
        className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600
          text-slate-200 transition-colors"
      >
        {copied ? '✓ 복사됨' : '링크 공유'}
      </button>
    </div>
  )
}
