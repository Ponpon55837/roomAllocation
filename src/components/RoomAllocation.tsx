import React, { useState, useEffect } from 'react'
import CustomInputNumber from './CustomInputNumber'
import '../styles/RoomAllocation.css'

interface RoomAllocation {
  adult: number
  child: number
}

interface RoomAllocationProps {
  guest: number
  room: number
  onChange: (result: { adult: number; child: number }[]) => void
}

const RoomAllocation: React.FC<RoomAllocationProps> = ({ guest, room, onChange }) => {
  const [roomAllocations, setRoomAllocations] = useState<RoomAllocation[]>([])
  const [totalAdults, setTotalAdults] = useState<number>(room)
  const [totalChildren, setTotalChildren] = useState<number>(0)

  const initializeRoomAllocations = () => {
    if (room === 0) return

    const initialRoomAllocations = Array.from({ length: room }, () => ({
      adult: 1,
      child: 0,
    }))

    setRoomAllocations(initialRoomAllocations)
    calculateTotalGuests(initialRoomAllocations)
  }

  const handleRoomChange = (index: number, type: keyof RoomAllocation, value: number) => {
    const newRoomAllocations = [...roomAllocations]
    newRoomAllocations[index][type] = value

    const totalGuestsInRoom = newRoomAllocations[index].adult + newRoomAllocations[index].child
    const isOverCapacity = totalGuestsInRoom > 4
    const isAdultZero = newRoomAllocations[index].adult === 0

    if (isOverCapacity || isAdultZero) {
      if (isOverCapacity) {
        newRoomAllocations[index][type] =
          type === 'adult'
            ? 4 - newRoomAllocations[index].child
            : 4 - newRoomAllocations[index].adult
      }

      if (isAdultZero) {
        newRoomAllocations[index].adult = 1
      }
    }

    setRoomAllocations(newRoomAllocations)
    calculateTotalGuests(newRoomAllocations)
  }

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

  useEffect(() => {
    if (totalAdults + totalChildren === guest) {
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
