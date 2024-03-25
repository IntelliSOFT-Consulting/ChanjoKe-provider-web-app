import ChanjoKE from '../assets/login bg.png'
import MOHLogo from '../assets/moh-logo.png'
import { useNavigate } from 'react-router-dom'
import { Form, Input } from 'antd'
import { useState } from 'react'
import { useApiRequest } from '../api/useApiRequest'
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import LoadingIcon from '../common/icons/loadingIcon'

export default function ForgotPassword() {

  const [loading, setLoading] = useState(false)
  const { get } = useApiRequest()
  const navigate = useNavigate()

  const onFinish = async (values) => {

    setLoading(true)
    const response = await get(`/auth/provider/reset-password?idNumber=${values?.idNumber}&email=${values?.email}`)

    if (response) {
      setLoading(false)
      console.log({ response })
      // On success, how to reset password...
      // localStorage.setItem('authorization', JSON.stringify(response))
      // navigate('/')
    }

    else {
      setLoading(false)
    }
  }
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

        <h1 className='text-4xl text-[#163C94] text-center'>Enter your email address</h1>
        
        <Form
          onFinish={onFinish}
          autoComplete="off"
          layout='vertical'
          className='mt-20 w-full max-w-64 px-40'>
          <Form.Item
            name="idNumber"
            className='w-full'
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please enter ID number',
              },
              {
                min: 5,
                message: 'ID Number is too short',
              },
            ]}>
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder='ID Number' />
          </Form.Item>

          <Form.Item
            name="email"
            className='w-full'
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please enter email',
              },
              {
                type: 'email',
                message: 'Please enter valid email address',
              },
            ]}>
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder='Email' />
          </Form.Item>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div></div>
            <button
              type="primary"
              htmlType="submit"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
              {loading && <span>
                <LoadingIcon className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
              </span>}
              <span className="text-sm font-semibold leading-6">
                Reset Password
              </span>
            </button>
          </div>
        </Form>
      </div>
    </div>
      </div>
    </div>
  )
}