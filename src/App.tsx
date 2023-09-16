import './styles/App.css'
import RoomAllocation from './components/RoomAllocation'

const App = () => {
  return (
    <RoomAllocation
      guest={10}
      room={4}
      onChange={(roomAllocations) => console.log(roomAllocations)}
    />
  )
}

export default App
