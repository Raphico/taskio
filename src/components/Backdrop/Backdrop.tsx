import { motion } from "framer-motion"
import { fadeIn } from "../../utils/motion"
import "./backdrop.scss"

type Props = {
  children: JSX.Element,
  onClick: () => void
}

function Backdrop({ children, onClick }: Props) {
  return (
    <motion.div 
      {...fadeIn}
      className="backdrop"
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export default Backdrop