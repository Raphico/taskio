export default (errorMsg: string) => {
  const error = errorMsg.slice(5).split("-").join(" ")
  if (error === "internal error")  {
    return "Please, check your connection"
  } else {
    return error
  }
}