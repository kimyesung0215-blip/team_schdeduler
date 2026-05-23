// 인물별 색상 팔레트 (rgba 투명도 포함)
export const PERSON_COLORS = [
  { solid: '#ef4444', rgba: 'rgba(239,68,68,0.45)' },    // 빨강
  { solid: '#3b82f6', rgba: 'rgba(59,130,246,0.45)' },   // 파랑
  { solid: '#22c55e', rgba: 'rgba(34,197,94,0.45)' },    // 초록
  { solid: '#f59e0b', rgba: 'rgba(245,158,11,0.45)' },   // 노랑
  { solid: '#a855f7', rgba: 'rgba(168,85,247,0.45)' },   // 보라
  { solid: '#ec4899', rgba: 'rgba(236,72,153,0.45)' },   // 핑크
  { solid: '#14b8a6', rgba: 'rgba(20,184,166,0.45)' },   // 청록
  { solid: '#f97316', rgba: 'rgba(249,115,22,0.45)' },   // 주황
]

export function getColor(index) {
  return PERSON_COLORS[index % PERSON_COLORS.length]
}
