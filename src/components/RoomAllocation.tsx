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
      alert('每間房間最多4人')
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

  const handleBlur = (index: number, type: string, event: React.FocusEvent<HTMLInputElement>) => {
    // 在 onBlur 事件中驗證大人和小孩的總和是否超過4
    const inputValue = parseFloat(event.target.value)
    const totalAdults = type === 'adult' ? inputValue : roomAllocations[index].adult
    const totalChildren = type === 'child' ? inputValue : roomAllocations[index].child

    if (totalAdults + totalChildren > 4) {
      alert('每間房間最多4人')
      // 如果總和超過4，調整輸入的值
      const adjustedValue =
        type === 'adult' ? 4 - roomAllocations[index].child : 4 - roomAllocations[index].adult
      event.target.value = adjustedValue.toFixed(1)
    }
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
                onBlur={(event) => handleBlur(index, 'adult', event)}
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
                  onBlur={(event) => handleBlur(index, 'child', event)}
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
