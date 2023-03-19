import { useAuth } from "../../context/AuthContext"
import Protect from "../../utils/Protect"
import { BiPlus } from "react-icons/bi"
import { FiUser } from "react-icons/fi"
import "./dashboard.scss"
import { useEffect, useState } from "react"
import Account from "../../components/Modals/Account"
import { AnimatePresence, motion } from "framer-motion"
import AddTask from "../../components/Modals/AddTask"
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "../../config/firebase"
import { filterTasksBy, FirestoreTask, Task } from "../../constants"
import Category from "../../components/Button/Category/Category"
import LoadingSkeleton from "../../components/LoadingSkeleton/LoadingSkeleton"
import { toast } from "react-hot-toast"
import SelectedTask from "../../components/Modals/SelectedTask"
import { fadeIn } from "../../utils/motion"

type Modal = {
  type: string,
  task: Task | null,
  show: boolean
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [taskCompletedCount, setTaskCompletedCount] = useState(() => {
    return parseInt(localStorage.getItem("taskCompleted") || "0")
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")

  const { user } = useAuth()
  const displayName = user?.displayName?.split(" ")[0]

  const [showModal, setShowModal] = useState<Modal>({
    type: "",
    task: null,
    show: false
  })

  function handleModal(type: string, task?: Task) {
    setShowModal(oldVal => ({
      task: task || null,
      type,
      show: !oldVal.type
    }))
  }

  function handleClose() {
    setShowModal({
      type: "",
      task: null,
      show: false
    });
  }

  function renderModal() {
    switch(showModal.type) {
      case "account":
        return <Account handleClose={handleClose} />
      case "addTask":
        return <AddTask 
          handleClose={handleClose} 
          addTask={addTask} 
        />
      case "task":
        return <SelectedTask 
          handleClose={handleClose} 
          updateTask={updateTask} 
          deleteTask={deleteTask} 
          task={showModal.task} 
        />
      default:
        return null
    }
  }

  function filterBy(by: string) {
    setActiveCategory(by)
    if (by !== "All") {
      setFilteredTasks(tasks.filter(
        task => task.category === by
      ))
      return
    }
    setFilteredTasks(tasks)
  }

  const categoryElements = filterTasksBy.map(filter => 
    <Category 
      key={filter} 
      text={filter}
      active={activeCategory === filter ? "active" : ""}
      onClick={() => filterBy(filter)} 
    />
    )

  const taskElements = filteredTasks.map(task => 
    <motion.div 
      layout
      key={task.id} 
      onClick={() => handleModal("task", task)} 
      className="task"
    >
      <div className="flex">
        <input 
          type="checkbox" 
          className="completed"
          onClick={(e) => handleCompleted(e, task.id)}
        />
        <label htmlFor="">{task.task}</label>
      </div>
    </motion.div>
    )

  useEffect(() => {
    const getTasks = async() => {
      setIsLoading(true)

      const q = query(collection(db, "tasks"), 
      where("uid", "==", user?.uid))
      const data = await getDocs(q)
      const yourTasks = data.docs.map(doc => ({
        id: doc.get("id"),
        uid: doc.get("uid"),
        task: doc.get("task"),
        category: doc.get("category"),
        priority: doc.get("priority"),
      }))

      setTasks(yourTasks)
      setFilteredTasks(yourTasks)

      setIsLoading(false)
    }

    getTasks()
  }, [])

  function addTask(newTask: FirestoreTask) {
    const { id, task, category, priority } = newTask
    const newTaskObj = {
      id,
      uid: user?.uid || "",
      task,
      category,
      priority,
    }

    setTasks(oldTasks => [...oldTasks, newTaskObj])
    setFilteredTasks(oldTasks => [...oldTasks, newTaskObj])
    toast.success("Task added")
    setDoc(doc(db, "tasks", id), newTaskObj)
      .catch(error => {
        console.log(error)
        toast.error("Oops, We couldn't save task.")
      })
  }

  function updateTask(newTask: FirestoreTask) {
    const { id, task, category, priority } = newTask
    const newTaskObj = {
      id,
      uid: user?.uid || "",
      task,
      category,
      priority,
    }
    setTasks(prevTasks => prevTasks.map(task => 
      task.id !== id ? { ...task } : newTaskObj))
    setFilteredTasks(prevTasks => prevTasks.map(task => 
      task.id !== id ? { ...task } : newTaskObj))
    handleClose()
    toast.success("Task updated")
  
    updateDoc(doc(db, "tasks", id), newTaskObj)
      .catch(error => {
        console.log(error)
        toast.error("Oops, We couldn't save task.")
      })
  }

  function handleCompleted(e: React.MouseEvent<HTMLInputElement>,
     id?: string) {
    e.stopPropagation()
    deleteTask(id, "Well done!")

    setTaskCompletedCount(prevCount => prevCount + 1)
    localStorage.setItem("taskCompleted", 
    JSON.stringify(taskCompletedCount))
  }

  async function deleteTask(id?: string, msg="Task deleted") {
    if (!id) return
    setFilteredTasks(prevTasks => prevTasks.filter(
      task => task.id !== id
    ))
    handleClose()
    toast.success(msg)

    deleteDoc(doc(db, "tasks", id))
      .catch(error => {
        console.log(error)
        toast.error("Couldn't delete task")
      })
  } 

  return (
    <Protect>
      <motion.div {...fadeIn}>
        <header className="header flex">
          <h1 className="fs-500 fw-bold">
            Hi, {displayName}
          </h1>

          <div className="config flex">
            <button 
              onClick={() => handleModal("addTask")} 
              className="add-task"
            >
              <BiPlus 
                size={30} 
              />
            </button> 
            <FiUser 
              className="user" 
              size={35} 
              onClick={() => handleModal("account")}
            />
          </div>
        </header>

        <div className="categories flex">
          {categoryElements}
        </div>

        <motion.div layout className="tasks flow">
          {isLoading ? <LoadingSkeleton /> : 
          filteredTasks.length ? taskElements : 
          <motion.p layout className="no-task">
            You don't have task to complete
          </motion.p>}
        </motion.div>

        <AnimatePresence
          initial={false}
          mode="wait"
        >
          {showModal.show && renderModal()}
        </AnimatePresence>

        <div className="task-completed-count fs-500 bg-grey">
          {taskCompletedCount}
        </div>
      </motion.div>
    </Protect>
  )
}

export default Dashboard