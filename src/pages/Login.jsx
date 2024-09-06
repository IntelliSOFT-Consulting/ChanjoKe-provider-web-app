import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { Button, Form, Input, Select } from 'antd'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import MOHLogo from '../assets/moh-logo.png'
import { login } from '../redux/slices/userSlice'

const useStyles = createUseStyles({
  selector: {
    '& .ant-select-selector': {
      paddingLeft: '2rem !important',
    },
  },
})

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const classes = useStyles()

  const { user, loading } = useSelector((state) => state.userInfo)

  const locations = [
    { label: 'Facility', value: 'Facility' },
    { label: 'Outreach', value: 'Outreach' },
    { label: 'Campaign', value: 'Campaign' },
  ]

  const onFinish = async (values) => {
    dispatch(login(values))
    if (user?.access_token) {
      const dashboardRoles = ['ADMINISTRATOR', 'NATIONAL_SYSTEM_ADMINISTRATOR', 'COUNTY_SYSTEM_ADMINISTRATOR']
      if (dashboardRoles.includes(user?.practitionerRole)) {
        navigate('/dashboard')
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="grid md:grid-cols-2 h-full bg-[#f9fafb]">
      <div className="hidden md:block md:h-screen w-full login-bg" />

      <div>
        <div className="md:collapse flex flex-wrap text-center px-4 sm:flex-nowrap sm:px-6 lg:px-8 bg-[#163C94] text-white shadow py-4">
          OpenCHANJO
        </div>

        <div className="mx-auto flex flex-col w-full px-4 sm:px-6 lg:px-8 mt-32">
          <div className="mx-auto  px-10 w-full">
            <img
              className="h-24 mx-auto"
              src={MOHLogo}
              alt="Ministry of Health"
            />

            <h1 className="text-4xl text-[#163C94] text-center">
              Login to your account
            </h1>

            <Form
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              className="mt-20 w-full px-16 flex flex-col"
            >
              <Form.Item
                name="idNumber"
                className="w-full"
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
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="ID Number"
                />
              </Form.Item>

              <Form.Item
                name="password"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: 'Please enter password',
                  },
                  {
                    min: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <MapPinIcon
                    width={20}
                    height={20}
                    style={{ left: '11px !important' }}
                  />
                </div>
                <Form.Item
                  name="location"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: 'Please select your location',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Location"
                    className={classes.selector}
                    allowClear
                    options={locations}
                  />
                </Form.Item>
              </div>

              <div className="text-right mx-10 text-[#707070] mt-3">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="ml-auto mt-4"
                size="large"
              >
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
