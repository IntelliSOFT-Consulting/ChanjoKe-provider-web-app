import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Modal, Space, Tabs, Popconfirm } from 'antd'
import Table from '../DataTable'
import { PlusIcon } from '@heroicons/react/24/solid'
import { usePractitioner } from '../../hooks/usePractitioner'
import AddUser from './AddUser'
import moment from 'moment'

export default function Users() {
  const [activeTab, setActiveTab] = useState('1')
  const [visible, setVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState([])
  const [practitionerData, setPractitionerData] = useState(null)

  const {
    fetchPractitioners,
    handleSearch,
    loading,
    practitioners,
    archivedPractitioners,
    total: pageSize,
    archivedTotal,
    handleArchivePractitioner,
  } = usePractitioner({ pageSize: 12 })

  useEffect(() => {
    fetchPractitioners(null, activeTab === '1', currentPage)
  }, [currentPage, activeTab])

  const formatPractitionersToTable = (practitioners) => {
    return practitioners.map((practitioner) => {
      return {
        key: practitioner.resource.id,
        name: `${practitioner.resource.name[0]?.given?.join(' ')} ${
          practitioner.resource.name[0]?.family
        }`,
        createdAt: moment(practitioner.resource.meta?.lastUpdated).format(
          'DD-MM-YYYY'
        ),
        id: practitioner.resource.id,
      }
    })
  }

  useEffect(() => {
    if (activeTab === '1') {
      setUsers(formatPractitionersToTable(practitioners))
    } else {
      setUsers(formatPractitionersToTable(archivedPractitioners))
    }
  }, [practitioners, activeTab, archivedPractitioners])

  const handleArchive = async (id) => {
    await handleArchivePractitioner(id, activeTab !== '1')
    fetchPractitioners(null, activeTab === '1', currentPage)
  }

  const columns = [
    {
      title: 'Date Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setVisible(record)
            }}
          >
            Update
          </Button>
          <Popconfirm
            title={`Are you sure you want to ${
              activeTab === '1' ? 'archive' : 'unarchive'
            } this user?`}
            onConfirm={() => handleArchive(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              {activeTab === '1' ? 'Archive' : 'Unarchive'}
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 200,
    },
  ]
  return (
    <Card
      size="small"
      title={
        <div className="px-4 text-xl font-semibold py-2 sm:px-6">
          Admin Management - Add User
        </div>
      }
      className="mt-10"
      extra={
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          className="rounded-md outline bg-[#163C94] flex items-center"
          icon={<PlusIcon className="text-white w-5 h-5 font-semibold" />}
        >
          Add User
        </Button>
      }
    >
      <div className="px-4 py-5 sm:p-6">
        <Tabs
          defaultActiveKey="1"
          onChange={(key) => {
            setActiveTab(key)
            setCurrentPage(1)
          }}
          items={['Active Users', 'Archived Users'].map((item, index) => ({
            key: (index + 1).toString(),
            label: item,
            children: (
              <div>
                <div className="my-2 flex">
                  <Form
                    onFinish={(values) => {
                      fetchPractitioners(
                        values.search,
                        activeTab === '1',
                        currentPage
                      )
                    }}
                    className="flex w-full items-center"
                  >
                    <Form.Item name="search" className="w-full mr-4">
                      <Input
                        allowClear
                        placeholder="Search User"
                        className="w-full ml-auto"
                        onChange={(e) => {
                          handleSearch(e.target.value, activeTab === '1')
                        }}
                        size="large"
                        autocomplete="off"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" size="large">
                        Search
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
                <div className="overflow-x-auto">
                  <Table
                    columns={columns}
                    dataSource={users}
                    size="small"
                    loading={loading}
                    rowKey="id"
                    pagination={{
                      pageSize: 12,
                      showTotal: (total, range) =>
                        `${range[0]} - ${range[1]} of ${
                          activeTab === '1' ? pageSize : archivedTotal
                        } users`,
                      showSizeChanger: false,
                      defaultCurrent: 1,
                      current: currentPage,
                      total: activeTab === '1' ? pageSize : archivedTotal,
                      onChange: async (page) => {
                        setCurrentPage(page)
                      },
                    }}
                  />
                </div>
              </div>
            ),
          }))}
        />
      </div>

      <Modal
        title="Add User"
        open={visible}
        onCancel={() => {
          setPractitionerData(null)
          setVisible(false)
        }}
        footer={null}
        width={800}
      >
        <AddUser
          setVisible={setVisible}
          visible={visible}
          setPractitionerData={setPractitionerData}
          practitionerData={practitionerData}
          fetchPractitioners={fetchPractitioners}
          activeTab={activeTab}
          currentPage={currentPage}
        />
      </Modal>
    </Card>
  )
}
