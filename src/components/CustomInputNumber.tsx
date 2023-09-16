import React, { useState, ChangeEvent, FocusEvent } from 'react'
import '../styles/Input.css'

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
    const newValue = parseFloat(event.target.value)
    setInputValue(newValue)
    onChange(event)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur(event)
  }

  const handleIncrement = () => {
    if (inputValue < max) {
      const newValue = Math.min(inputValue + step, max)
      setInputValue(newValue)
      onChange({
        target: { name, value: newValue } as unknown as HTMLInputElement,
      } as ChangeEvent<HTMLInputElement>)
    }
  }

  const handleDecrement = () => {
    if (inputValue > min) {
      const newValue = Math.max(inputValue - step, min)
      setInputValue(newValue)
      onChange({
        target: { name, value: newValue } as unknown as HTMLInputElement,
      } as ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="controlDiv">
      <button
        className="controlBtn"
        onClick={handleDecrement}
        disabled={inputValue === min}
        style={{
          color: inputValue === min ? '#DDD' : '#4FAAF2',
          borderColor: inputValue === min ? '#DDD' : '#4FAAF2',
        }}
      >
        -
      </button>
      <input
        type="number"
        name={name}
        value={inputValue}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        style={{
          color: disabled ? '#999' : '#000',
        }}
      />
      <button
        className="controlBtn"
        onClick={handleIncrement}
        disabled={disabled || inputValue >= max}
        style={{
          color: disabled ? '#DDD' : '#4FAAF2',
          borderColor: disabled ? '#DDD' : '#4FAAF2',
        }}
      >
        +
      </button>
    </div>
  )
}

export default CustomInputNumber
