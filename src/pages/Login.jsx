import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Login
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Login with username and password
        </p>

        <Link
          type="button"
          to={`/`}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm mt-5">
          Login
        </Link>
      </div>
    </div>
  )
}