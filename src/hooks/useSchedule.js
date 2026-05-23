import { useEffect, useState, useCallback } from 'react'
import {
  doc, collection, onSnapshot,
  setDoc, updateDoc, writeBatch, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getColor } from '../lib/colors'
import { nanoid } from 'nanoid'

export function useSchedule(roomId) {
  const [people, setPeople] = useState([])       // [{ id, name, colorIndex }]
  const [schedules, setSchedules] = useState({}) // { personId: Set<slotKey> }
  const [loading, setLoading] = useState(true)

  // 실시간 리스너: people
  useEffect(() => {
    if (!roomId) return
    const unsub = onSnapshot(
      collection(db, 'rooms', roomId, 'people'),
      (snap) => {
        const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        arr.sort((a, b) => a.createdAt - b.createdAt)
        setPeople(arr)
        setLoading(false)
      }
    )
    return unsub
  }, [roomId])

  // 실시간 리스너: schedules (모든 인물)
  useEffect(() => {
    if (!roomId) return
    const unsub = onSnapshot(
      collection(db, 'rooms', roomId, 'schedules'),
      (snap) => {
        const result = {}
        snap.docs.forEach(d => {
          result[d.id] = new Set(d.data().slots || [])
        })
        setSchedules(result)
      }
    )
    return unsub
  }, [roomId])

  // 인물 추가
  const addPerson = useCallback(async (name) => {
    const id = nanoid(8)
    const colorIndex = people.length
    await setDoc(doc(db, 'rooms', roomId, 'people', id), {
      name,
      colorIndex,
      createdAt: Date.now()
    })
    // 빈 스케줄 문서 초기화
    await setDoc(doc(db, 'rooms', roomId, 'schedules', id), { slots: [] })
    return id
  }, [roomId, people.length])

  // 슬롯 batch write (드래그 끝날 때 호출)
  const saveSlots = useCallback(async (personId, slotsSet) => {
    await updateDoc(doc(db, 'rooms', roomId, 'schedules', personId), {
      slots: Array.from(slotsSet)
    })
  }, [roomId])

  return { people, schedules, loading, addPerson, saveSlots }
}
