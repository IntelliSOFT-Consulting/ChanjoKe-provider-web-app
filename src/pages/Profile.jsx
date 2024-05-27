import { Descriptions } from 'antd'
import { useSelector } from 'react-redux'

export default function Profile() {
  const { user } = useSelector((state) => state.userInfo)
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-xl font-semibold py-2 sm:px-6">Profile</div>
      <div className="px-4 py-5 sm:p-6">
        <Descriptions
          column={3}
          className="w-full"
          layout="vertical"
          bordered={false}
          labelStyle={{ fontWeight: 'bold', color: '#163C94' }}
          size="small"
        >
          <Descriptions.Item label="Name">{`${user?.firstName} ${user?.lastName}`}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            {user?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Facility Attached">
            {user?.facilityName}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  )
}
