import React, { useState, ChangeEvent, FocusEvent } from 'react'
import '../styles/CustomInputNumber.css'

const disabledColor = '#DDD'
const activeColor = '#4FAAF2'
const inputDefaultColor = '#000'

interface CustomInputNumberProps {
  min: number
  max: number
  step: number
  name: string
  value: number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: FocusEvent<HTMLInputElement>) => void
  disabled: boolean
}

const CustomInputNumber: React.FC<CustomInputNumberProps> = ({
  min = 0,
  max = 999,
  step = 1,
  name,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState<number>(value)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue = parseFloat(event.target.value)

    // 檢查新輸入值是否在範圍內
    if (isNaN(newValue)) {
      newValue = min // 如果輸入不是有效數字，將其設為最小值
    } else if (newValue < min) {
      newValue = min // 如果輸入低於最小值，將其設為最小值
    } else if (newValue > max) {
      newValue = max // 如果輸入超過最大值，將其設為最大值
    }

    setInputValue(newValue)
    onChange(event)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur(event)
  }

  // 增加人數時，若大於最大值，則設為最大值
  const handleIncrement = () => {
    if (inputValue < max) {
      const newValue = Math.min(inputValue + step, max)
      setInputValue(newValue)
      onChange({
        target: { name, value: newValue },
      } as unknown as ChangeEvent<HTMLInputElement>)
    }
  }

  // 減少人數時，若小於最小值，則設為最小值
  const handleDecrement = () => {
    if (inputValue > min) {
      const newValue = Math.max(inputValue - step, min)
      setInputValue(newValue)
      onChange({
        target: { name, value: newValue },
      } as unknown as ChangeEvent<HTMLInputElement>)
    }
  }

  // 判斷是否為最小值或最大值
  const isMinValue = inputValue === min
  const isMaxValue = inputValue >= max

  const buttonStyle = (disabledCheck: boolean) => {
    return {
      color: disabledCheck ? disabledColor : activeColor,
      borderColor: disabledCheck ? disabledColor : activeColor,
    }
  }

  const inputStyle = (disabledCheck: boolean) => {
    return {
      color: disabledCheck ? disabledColor : inputDefaultColor,
    }
  }

  return (
    <div className="controlDiv">
      <button
        className="controlBtn"
        onClick={handleDecrement}
        disabled={isMinValue}
        style={buttonStyle(isMinValue)}
      >
        -
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        {...{ name, min, max, step, disabled }}
        style={inputStyle(disabled)}
      />
      <button
        className="controlBtn"
        onClick={handleIncrement}
        disabled={disabled || isMaxValue}
        style={buttonStyle(disabled || isMaxValue)}
      >
        +
      </button>
    </div>
  )
}

export default CustomInputNumber
