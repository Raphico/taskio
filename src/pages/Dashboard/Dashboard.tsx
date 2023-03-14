import { useAuth } from "../../context/AuthContext"
import Protect from "../../utils/Protect"
import { BiPlus } from "react-icons/bi"
import { FiUser } from "react-icons/fi"
import "./dashboard.scss"

function Dashboard() {
  const { user } = useAuth()

  const displayName = user?.displayName?.split(" ")[0]
  return (
    <Protect>
      <div>
        <header className="header flex">
          <h1 className="fs-500 fw-bold">
            Hi, {displayName}
          </h1>

          <div className="flex">
            <button className="add-task">
              <BiPlus 
                size={30} 
              />
            </button>

            <FiUser className="user" size={35} />
          </div>
        </header>
      </div>
    </Protect>
  )
}

export default Dashboard
