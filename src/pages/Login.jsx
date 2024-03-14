import { Link } from 'react-router-dom'
import ChanjoKE from '../assets/chanjoke-img.png'
import MOHLogo from '../assets/moh-logo.png'
import { useNavigate } from 'react-router-dom'
import { Form, Input } from 'antd'
import usePost from '../api/usePost'
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export default function Login() {

  const navigate = useNavigate()

  const onFinish = (values) => {
    console.log('Success:', values);
    localStorage.setItem('token', JSON.stringify(values))
    navigate('/')
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
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

        <h1 className='text-4xl text-[#163C94] text-center'>Login to your account</h1>

        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
                message: 'Field cannot be empty',
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
            name="password"
            className='w-full'
            rules={[
              {
                required: true,
                message: 'Field cannot be empty',
              },
              {
                min: 8,
                message: 'Password must be at least 8 characters long',
              },
            ]}>
            <Input.Password
              prefix={<LockOutlined
              className="site-form-item-icon" />}
              type="password"
              placeholder='Password'/>
          </Form.Item>

          <div className='text-right mx-10 text-[#707070] mt-3'>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div></div>
            <button
              type="primary"
              htmlType="submit"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
              <span className="text-sm font-semibold leading-6">
                Login
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