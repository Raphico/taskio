import "./button.scss"

type Props = {
  text: string,
  borderColor: string,
  onClick?: () => void,
  type?: "button" | "submit"
}

function Button({ text, borderColor, onClick, type="button" }: Props) {
  return (
    <button 
      onClick={onClick}
      type={type}
      className={`btn border-${borderColor} fw-bold text-secondary`}
    >
      {text}
    </button>
  )
}

export default Button