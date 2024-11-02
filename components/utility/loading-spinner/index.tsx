import s from "./loading-spinner.module.scss"

const LoadingSpinner = () => {
  return (
    <div className={s.spinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export { LoadingSpinner }
