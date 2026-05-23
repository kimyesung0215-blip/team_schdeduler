# 설계 결정 기록

## 2025 — 초기 설계

### DB: Firebase Firestore 선택
- 대안: Supabase, Gist 폴링, URL 인코딩
- 이유: GitHub Pages + 실시간 동기화 조합에서 설정 최소화
- 트레이드오프: 무료 한도(읽기 50k/일, 쓰기 20k/일) 존재

### 드래그 최적화: batch write 방식
- 드래그 중에는 로컬 상태만 업데이트
- mouseup / touchend 시점에 변경된 슬롯 전체를 한 번에 Firestore write
- 이유: 슬롯마다 write하면 드래그 한 번에 수십 회 쓰기 발생 → 한도 초과 위험

### 동기화 단위: 인물별 문서
- rooms/{roomId}/people/{personId} — 인물 정보 (이름, 색상)
- rooms/{roomId}/schedules/{personId} — 해당 인물의 슬롯 데이터
- 이유: 인물별로 독립 문서 → 충돌 없음 (각자 자기 문서만 수정)

### 색상 중첩: CSS rgba 레이어
- 각 인물의 활성 슬롯을 rgba(r,g,b,0.45)로 절대 위치 겹침
- 우측 하단 숫자 배지: 해당 슬롯에 체크한 인물 수 표시
- 이유: 별도 합성 계산 없이 CSS만으로 시각적 중첩 표현 가능

### 방(Room) 식별: nanoid 랜덤 ID
- URL: /rooms/:roomId
- 이유: 로그인 없이 링크 공유만으로 팀원 초대 가능

### PWA
- vite-plugin-pwa 사용
- start_url, scope → '/team-scheduler/' (GitHub Pages 서브패스)
- 오프라인: Firestore 내장 캐시로 자동 처리
