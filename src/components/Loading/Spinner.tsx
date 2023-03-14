import "./spinner.scss"

type Props = {
  msg: string
}

function Spinner({ msg }: Props) {
  return (
    <div className="ring">
      { msg }
      <span className="ball"></span>
    </div>

  )
}

export default Spinner
