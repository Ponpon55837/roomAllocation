import RoomAllocation from '../components/RoomAllocation'
import '../styles/RoomAllocation.css'

const index = () => {
  return (
    <div className="container">
      <RoomAllocation
        adultGuest={2}
        childGuest={1}
        room={2}
        onChange={(roomAllocations) => console.log(roomAllocations)}
      />
    </div>
  )
}
export default index
