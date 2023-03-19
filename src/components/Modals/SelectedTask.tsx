import { motion } from "framer-motion"
import { SubmitHandler, useForm } from "react-hook-form"
import Backdrop from "../Backdrop/Backdrop"
import "./modal.scss"
import { IoMdClose } from "react-icons/io"
import { slideIn } from "../../utils/motion"
import Button from "../Button/Button/Button"
import { categories, FirestoreTask, priorities, Task } from "../../constants"

type Props = {
  handleClose: () => void,
  updateTask: (task: FirestoreTask) => void,
  deleteTask: (id?: string) => void,
  task: Task | null
}

type FormData = {
  task: string,
  category: string,
  priority: string
}

function SelectedTask({ handleClose, task, updateTask, deleteTask }: Props) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      task: task?.task,
      category: task?.category,
      priority: task?.priority
    }
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if(!task) return
    updateTask({...data, id: task.id})
  }

  const categoryElements = categories.map(category => 
    <div className="category flex" key={category}>
      <input 
        type="radio" 
        id="category"
        className="radio-input"
        value={category}
        {...register("category", { required: true })}
      />
      <label htmlFor="category">{category}</label>
    </div>
  )
  
  const prioritiesElements = priorities.map(priority => 
    <div className="priority flex" key={priority}>
      <input 
        type="radio" 
        id="priority"
        className="radio-input"
        value={priority}
        {...register("priority", { required: true })}
      />
      <label htmlFor="priority">{priority}</label>
    </div>
  )

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        variants={slideIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="modal"
        onClick={e => e.stopPropagation()}
      >
        <IoMdClose 
          className="close-modal"
          size={30}
          onClick={handleClose}
        />

        <h1 className="titling fs-500 fw-bold">
          Task
        </h1>

        <form className="form grid" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-box">
            <input 
              id="task"
              type="text" 
              {...register("task", { required: true })}
              autoComplete="off"
              className={`form-input not-empty`}
            />
            <label className="form-label" htmlFor="task">
              Task
            </label>
          </div>
          
          <div className="input-box">
            <p className="sub-titling fw-bold">
              Category
            </p>

            <div className="categories flex">
              {categoryElements}
            </div>
          </div>

          <div className="input-box">
            <p className="sub-titling fw-bold">
              Priority
            </p>

            <div className="priorities flex">
              {prioritiesElements}
            </div>
          </div>
          
          <div className="task-btns flex">
            <Button 
              type="submit"
              text="Update"
              borderColor="accent"
            />
            <Button 
              text="Delete"
              borderColor="red"
              onClick={() => deleteTask(task?.id)}
            />
          </div>
        </form>
      </motion.div>
    </Backdrop>
  )
}

export default SelectedTask