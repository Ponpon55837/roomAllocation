import React, { useState, useEffect } from 'react'
import CustomInputNumber from './CustomInputNumber'
import '../styles/RoomAllocation.css'

interface RoomAllocation {
  adult: number
  child: number
}

interface RoomAllocationProps {
  guest: number // 住客人數
  room: number // 房間數量
  onChange: (result: { adult: number; child: number }[]) => void // 當分配結果變化時呼叫的函數
}

const RoomAllocation: React.FC<RoomAllocationProps> = ({ guest, room, onChange }) => {
  const [roomAllocations, setRoomAllocations] = useState<RoomAllocation[]>([])
  const [totalAdults, setTotalAdults] = useState<number>(room)
  const [totalChildren, setTotalChildren] = useState<number>(0)

  // 初始化房間分配
  const initializeRoomAllocations = () => {
    if (room === 0) return

    // 初始每個房間的分配，每個房間有一位大人、零位小孩
    const initialRoomAllocations = Array.from({ length: room }, () => ({
      adult: 1,
      child: 0,
    }))

    setRoomAllocations(initialRoomAllocations)
    calculateTotalGuests(initialRoomAllocations)
  }

  // 處理房間分配變化
  const handleRoomChange = (index: number, type: keyof RoomAllocation, value: number) => {
    const newRoomAllocations = [...roomAllocations]
    newRoomAllocations[index][type] = value

    // 計算所有房間的總分配人數
    let totalAllocatedGuests = 0
    newRoomAllocations.forEach((allocation) => {
      totalAllocatedGuests += allocation.adult + allocation.child
    })

    // 計算剩餘可分配人數
    const remainingGuests = guest - totalAllocatedGuests

    // 確保分配不超過 guest 人數
    if (remainingGuests >= 0) {
      setRoomAllocations(newRoomAllocations)
      calculateTotalGuests(newRoomAllocations)
    }
  }

  // 計算所有房間的總分配人數
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

  useEffect(() => {
    initializeRoomAllocations()
  }, [guest, room])

  // 當分配結果變化時觸發 onChange 函數
  useEffect(() => {
    // 確保分配總人數不超過 guest 人數
    if (totalAdults + totalChildren <= guest) {
      onChange(roomAllocations)
    }
  }, [roomAllocations])

  return (
    <div className="container">
      <div className="headerContent">
        <label>住客人數: </label>
        <span>
          {guest}人/{room}房
        </span>
        <div className="labelForCount">尚未分配人數: {guest - totalAdults - totalChildren}</div>
      </div>
      {roomAllocations.map((allocation: { adult: number; child: number }, index: number) => (
        <div key={index}>
          <div className="roomCount">
            房間 {index + 1}: {allocation.adult + allocation.child} 人
          </div>

          <div className="filterDivContainer">
            <div className="filterLeftDiv">
              <div>大人</div>
              <div className="greyTd">年齡 20 +</div>
            </div>
            <div className="filterRightDiv">
              <CustomInputNumber
                min={1}
                max={4}
                step={1}
                name={`adult${index}`}
                value={allocation.adult}
                onChange={(event) =>
                  handleRoomChange(index, 'adult', parseFloat(event.target.value))
                }
                onBlur={(event) => {
                  handleRoomChange(index, 'adult', parseFloat(event.target.value))
                  // 每間房間至少一位大人
                  if (guest <= room) {
                    event.target.value = allocation.child.toFixed(1)
                  }
                }}
                disabled={
                  allocation.adult + allocation.child === 4 || totalAdults + totalChildren === guest
                }
              />
            </div>
          </div>

          <div className="filterDivContainer">
            <div className="filterLeftDiv">
              <div>小孩</div>
            </div>
            <div className="filterRightDiv">
              <div>
                <CustomInputNumber
                  min={0}
                  max={4}
                  step={1}
                  name={`child${index}`}
                  value={allocation.child}
                  onChange={(event) =>
                    handleRoomChange(index, 'child', parseFloat(event.target.value))
                  }
                  onBlur={(event) => {
                    handleRoomChange(index, 'child', parseFloat(event.target.value))
                    // 每間房間至少一位大人
                    if (guest <= room) {
                      event.target.value = allocation.child.toFixed(1)
                    }
                  }}
                  disabled={
                    allocation.adult + allocation.child === 4 ||
                    totalAdults + totalChildren === guest
                  }
                />
              </div>
            </div>
          </div>
          <hr className="hrDivider" style={{ display: room === index + 1 ? 'none' : 'default' }} />
        </div>
      ))}
    </div>
  )
}

export default RoomAllocation
