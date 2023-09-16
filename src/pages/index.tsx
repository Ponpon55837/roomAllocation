import RoomAllocation from '../components/RoomAllocation'
import '../styles/RoomAllocation.css'

const index = () => {
  return (
    <div className="container">
      <RoomAllocation
        guest={10}
        room={4}
        onChange={(roomAllocations) => console.log(roomAllocations)}
      />
    </div>
  )
}
export default index
