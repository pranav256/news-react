import { TailSpin } from 'react-loader-spinner'

const Loading = () => {
  return (
    <div className="flex justify-center items-center">
    <TailSpin height="550" width="80" color="#4fa94d" ariaLabel="tail-spin-loading" radius="1" />
</div>
  )
}

export default Loading
