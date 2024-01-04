import { Link } from 'react-router-dom'
import ChanjoKE from '../assets/chanjoke-img.png'
import MOHLogo from '../assets/moh-logo.png'
import TextInput from '../common/forms/TextInput'

export default function Login() {
  return (
    <div className="grid md:grid-cols-2 h-full bg-[#f9fafb]">
      <nav className="hidden md:block">
        <img src={ChanjoKE} className="h-screen" alt="Chanjo KE Jumbo" />
      </nav>

      <div>
        <div className="md:collapse flex flex-wrap text-center px-4 sm:flex-nowrap sm:px-6 lg:px-8 bg-[#163C94] text-white shadow py-4">
          ChanjoKE
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
      <div className="mx-auto max-w-3xl px-10">
        <img
          className="h-24 mx-auto"
          src={MOHLogo}
          alt="Ministry of Health"/>

        <h1 className='text-4xl text-[#163C94] text-center'>Login to your account</h1>

        <form className='mt-5 max-w-96'>
          <TextInput
            inputType="email"
            inputName="email"
            inputId="email"
            leadingIcon="true"
            leadingIconName="mail"
            inputPlaceholder="Username"/>

          <br />

          <TextInput
            inputType="password"
            inputName="password"
            inputId="password"
            leadingIcon="true"
            leadingIconName="lock"
            inputPlaceholder="Password"/>

          <div className='text-right mx-10 text-[#707070] mt-3'>
            <Link to="/registration">Forgot password?</Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div></div>
            <a
            href='/'
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
              <span className="text-sm font-semibold leading-6">
                Login
              </span>
            </a>
          </div>
        </form>
      </div>
    </div>
      </div>
    </div>
  )
}