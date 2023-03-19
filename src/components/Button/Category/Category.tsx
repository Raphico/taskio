import "./category.scss"

type Props = {
  text: string,
  active: string,
  onClick: () => void
}

function Category({ text, onClick, active }: Props) {
  return (
    <button
      className={`category-btn bg-grey 
      text-secondary ${active}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Category