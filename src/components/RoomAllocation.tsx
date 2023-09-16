import React, { useState, useEffect } from 'react'
import CustomInputNumber from './CustomInputNumber'
import '../styles/RoomAllocation.css'

interface RoomAllocationProps {
  guest: number
  room: number
  onChange: (result: { adult: number; child: number }[]) => void
}

const RoomAllocation: React.FC<RoomAllocationProps> = ({ guest, room, onChange }) => {
  const [roomAllocations, setRoomAllocations] = useState<any>([])
  const [totalAdults, setTotalAdults] = useState<number>(room) // 初始值為房間數
  const [totalChildren, setTotalChildren] = useState<number>(0)

  // 初始化房間內含有大人與小孩陣列
  const initializeRoomAllocations = () => {
    if (room === 0) return

    const initialRoomAllocations = Array.from({ length: room }, () => ({
      adult: 1,
      child: 0,
    }))

    setRoomAllocations(initialRoomAllocations)
    // 計算大人與小孩總人數
    calculateTotalGuests(initialRoomAllocations)
  }

  const handleRoomChange = (index: number, type: string, value: number) => {
    const newRoomAllocations = [...roomAllocations]
    newRoomAllocations[index][type] = value

    // 確保每間房間大人加上小孩不超過4人
    const totalGuestsInRoom = newRoomAllocations[index].adult + newRoomAllocations[index].child
    if (totalGuestsInRoom > 4) {
      // 如果超過4人，將值設為4並更新state
      newRoomAllocations[index][type] =
        type === 'adult' ? 4 - newRoomAllocations[index].child : 4 - newRoomAllocations[index].adult
    }

    // 確保每間房間至少有1位大人
    if (newRoomAllocations[index].adult === 0) {
      newRoomAllocations[index].adult = 1
    }

    setRoomAllocations(newRoomAllocations)
    calculateTotalGuests(newRoomAllocations)
  }

  // 計算大人與小孩總人數
  const calculateTotalGuests = (allocations: { adult: number; child: number }[]) => {
    let adults = 0
    let children = 0

    allocations.forEach((allocation) => {
      adults += allocation.adult
      children += allocation.child
    })

    setTotalAdults(adults)
    setTotalChildren(children)
  }

  const isAllocationValid = () => {
    return totalAdults + totalChildren === guest
  }

  // 初始化房間內含有大人與小孩陣列
  useEffect(() => {
    initializeRoomAllocations()
  }, [guest, room])

  // 當房間內含有大人與小孩陣列更新時，檢查是否符合條件
  useEffect(() => {
    if (isAllocationValid()) {
      onChange(roomAllocations)
    }
  }, [roomAllocations])

  return (
    <div>
      <div>
        <label>住客人數: </label>
        <span>
          {guest}人/{room}房
        </span>
      </div>

      <div>
        <label>尚未分配人數: {guest - totalAdults - totalChildren}</label>
      </div>
      {roomAllocations.map((allocation: { adult: number; child: number }, index: number) => (
        <div key={index}>
          <div>
            <span>
              房間 {index + 1}: {allocation.adult + allocation.child} 人
            </span>
          </div>
          <div className=".container" style={{ display: 'inline-flex', width: '100%' }}>
            <div className=".leftDiv" style={{ width: '50%', float: 'left' }}>
              <div style={{ display: 'inline-block' }}>大人: {allocation.adult} 人</div>
              <div style={{ display: 'inline-block' }}>小孩: {allocation.child} 人</div>
            </div>

            <div className=".rightDiv" style={{ width: '50%', float: 'right' }}>
              <CustomInputNumber
                min={1}
                max={4}
                step={1}
                name={`adult${index}`}
                value={allocation.adult}
                onChange={(event) =>
                  handleRoomChange(index, 'adult', parseFloat(event.target.value))
                }
                onBlur={(event) => console.log(event)}
                disabled={
                  allocation.adult + allocation.child === 4 || totalAdults + totalChildren === guest
                }
              />
              <CustomInputNumber
                min={0}
                max={4}
                step={1}
                name={`child${index}`}
                value={allocation.child}
                onChange={(event) =>
                  handleRoomChange(index, 'child', parseFloat(event.target.value))
                }
                onBlur={(event) => console.log(event)}
                disabled={
                  allocation.adult + allocation.child === 4 || totalAdults + totalChildren === guest
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RoomAllocation
