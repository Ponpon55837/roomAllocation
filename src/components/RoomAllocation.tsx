import React, { useState, useEffect } from 'react'
import CustomInputNumber from './CustomInputNumber'

interface RoomAllocationProps {
  adultGuest: number
  childGuest: number
  room: number
  onChange: (result: { adult: number; child: number }[]) => void
}

const RoomAllocation: React.FC<RoomAllocationProps> = ({
  adultGuest,
  childGuest,
  room,
  onChange,
}) => {
  const [roomAllocations, setRoomAllocations] = useState<any>([])
  const [totalAdults, setTotalAdults] = useState(1)
  const [totalChildren, setTotalChildren] = useState(0)

  const initializeRoomAllocations = () => {
    if (room === 0) return

    const initialRoomAllocations = Array.from({ length: room }, () => ({
      adult: 1,
      child: 0,
    }))

    setRoomAllocations(initialRoomAllocations)
    calculateTotalGuests(initialRoomAllocations)
  }

  const handleRoomChange = (index: number, type: string, value: number) => {
    const newRoomAllocations = [...roomAllocations]
    newRoomAllocations[index][type] = value
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

  const isAllocationValid = () => {
    return totalAdults + totalChildren === adultGuest + childGuest
  }

  useEffect(() => {
    initializeRoomAllocations()
  }, [adultGuest, childGuest, room])

  useEffect(() => {
    if (isAllocationValid()) {
      onChange(roomAllocations)
    }
  }, [roomAllocations])

  return (
    <div>
      <div>
        <label>總人數: </label>
        <span>
          {totalAdults} 大人, {totalChildren} 小孩 (每房大人上限人數: {adultGuest}, 小孩上限人數:
          {childGuest})
        </span>
      </div>

      {roomAllocations.map((allocation: { adult: number; child: number }, index: number) => (
        <div key={index}>
          <div>
            <span>
              房間 {index + 1}: {allocation.adult + allocation.child} 人
            </span>
          </div>
          <div>
            <div style={{ display: 'inline-block' }}>
              <span>大人: {allocation.adult} 人</span>
              <CustomInputNumber
                min={1}
                max={adultGuest}
                step={1}
                name={`adult${index}`}
                value={allocation.adult}
                onChange={(event) =>
                  handleRoomChange(index, 'adult', parseFloat(event.target.value))
                }
                onBlur={(event) => console.log(event)}
                disabled={adultGuest + childGuest === room}
              />
            </div>

            <div style={{ display: 'inline-block' }}>
              <span>小孩: {allocation.child} 人</span>
              <CustomInputNumber
                min={0}
                max={childGuest}
                step={1}
                name={`child${index}`}
                value={allocation.child}
                onChange={(event) =>
                  handleRoomChange(index, 'child', parseFloat(event.target.value))
                }
                onBlur={(event) => console.log(event)}
                disabled={adultGuest + childGuest === room}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RoomAllocation
