# Team Scheduler — AGENTS.md

## 프로젝트 개요
팀원들의 가능한 시간을 시각적으로 겹쳐 확인하는 스케줄 조율 앱.
- 일주일 × 30분 단위 그리드
- 다중 인물 반투명 레이어 중첩
- Firebase Firestore 실시간 동기화
- PWA (오프라인 지원, Android 설치 가능)

## 기술 스택
- React 18 + Vite
- Tailwind CSS
- Firebase Firestore (실시간 동기화)
- GitHub Pages 배포 (gh-pages)

## 핵심 설계 결정
→ docs/decisions.md 참고

## Firebase 주의사항
- 드래그 중 매 슬롯마다 write 금지 → 드래그 끝날 때 batch write
- Security Rules: rooms/{roomId} allow read, write: if true (링크 공유 방식)
- API 키는 .env.local에 보관, 레포에는 .env.example만 커밋

## 폴더 구조
```
src/
  components/
    ScheduleGrid.jsx     # 7×48 그리드 + 드래그 로직
    PersonPanel.jsx      # 인물 추가/선택 패널
    RoomHeader.jsx       # 방 이름 + 링크 공유 버튼
    SlotCell.jsx         # 개별 슬롯 셀 (색상 레이어 합성)
  hooks/
    useSchedule.js       # Firestore 실시간 리스너
    useDrag.js           # 드래그 상태 관리
  lib/
    firebase.js          # Firebase 초기화
    colors.js            # 인물별 색상 팔레트
```

## 개발 명령어
```bash
npm install
npm run dev        # 로컬 개발
npm run build      # 빌드
npm run deploy     # GitHub Pages 배포
```

## 알려진 패턴 / 함정
- GitHub Pages 배포 시 vite.config.js에 base: '/repo-name/' 필수
- PWA manifest의 start_url, scope도 '/repo-name/'으로 맞춰야 함
