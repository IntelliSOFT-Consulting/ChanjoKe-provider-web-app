import { Descriptions } from 'antd'
import { useSelector } from 'react-redux'
import { titleCase } from '../utils/methods'

export default function Profile() {
  const { user } = useSelector((state) => state.userInfo)
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-xl font-semibold py-2 sm:px-6">Profile</div>
      <div className="px-4 py-5 sm:p-6">
        <Descriptions
          column={3}
          className="w-full"
          bordered={false}
          labelStyle={{ fontWeight: 'bold', color: '#163C94' }}
          size="small"
        >
          <Descriptions.Item label="Name">{`${user?.firstName || ''} ${user?.lastName || ''}`}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            {user?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="County">
            {titleCase(user?.countyName)}
          </Descriptions.Item>
          <Descriptions.Item label="Sub County">
            {titleCase(user?.subCountyName)}
          </Descriptions.Item>
          <Descriptions.Item label="Ward">
            {titleCase(user?.wardName)}
          </Descriptions.Item>
          <Descriptions.Item label="Facility Attached">
            {titleCase(user?.orgUnit?.name)}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {titleCase(user?.location)}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  )
}
