import { useState, useEffect } from 'react'
import Table from '../DataTable'
import { useApiRequest } from '../../api/useApiRequest'
import {
  Select,
  Input,
  Form,
  Button,
  Space,
  Modal,
  Card,
  message,
  Popconfirm,
  Tabs,
} from 'antd'
import {
  convertLocations,
  convertLocationToFhir,
  formatFacilitiesToTable,
} from '../../utils/formatter'
import { debounce, getOffset } from '../../utils/methods'
import { PlusIcon } from '@heroicons/react/24/solid'

export default function AddFacility() {
  const [visible, setVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('1')
  const [pageSize, setPageSize] = useState(0)
  const [counties, setCounties] = useState([])
  const [subCounties, setSubCounties] = useState([])
  const [wards, setWards] = useState([])
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const { get, put } = useApiRequest()

  const fetchLocations = async (query, name = null) => {
    const response = await get(query)

    if (response) {
      const locations = convertLocations(response)
      switch (name) {
        case null:
          setCounties(locations)
          localStorage.setItem('counties', JSON.stringify(locations))
          break
        case 'county':
          setSubCounties(locations)
          break
        case 'subCounty':
          setWards(locations)
          break
        default:
          break
      }
    }
  }

  const fetchSubCounties = async () => {
    const saved = localStorage.getItem('subCounties')
    if (!saved) {
      const response = await get(
        `/chanjo-hapi/fhir/Location?type:code=SUB-COUNTY&_count=5000`
      )
      if (response) {
        const converted = convertLocations(response)
        localStorage.setItem('subCounties', JSON.stringify(converted))
      }
    }
  }

  const fetchWards = async () => {
    const saved = localStorage.getItem('wards')
    if (!saved) {
      const response = await get(
        `/chanjo-hapi/fhir/Location?type:code=WARD&_count=5000`
      )
      if (response) {
        const converted = convertLocations(response)
        localStorage.setItem('wards', JSON.stringify(converted))
        setWards(converted)
        return
      }
    }
    setWards(JSON.parse(saved))
  }

  const fetchFacilities = async (name = null, archived = false) => {
    setLoading(true)
    const query = name ? `&name=${name}` : ''
    const archivedQuery = archived ? `&status=inactive` : '&status:not=inactive'
    const offset = getOffset(currentPage)
    const response = await get(
      `/chanjo-hapi/fhir/Location?type:code=FACILITY&_count=12&_total=accurate&_offset=${offset}${query}${archivedQuery}`
    )
    if (response) {
      setFacilities(formatFacilitiesToTable(response))
      setPageSize(response.total)

      form.resetFields()
      setVisible(false)
    }
    setLoading(false)
  }

  const fetchData = async () => {
    await fetchLocations('/chanjo-hapi/fhir/Location?partof=0&_count=50')
    await Promise.all([fetchSubCounties(), fetchWards()])
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchFacilities(null, activeTab === '2')
  }, [currentPage, activeTab])

  const columns = [
    {
      title: 'Facility Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'County',
      dataIndex: 'county',
      key: 'county',
    },
    {
      title: 'Sub-County',
      dataIndex: 'subCounty',
      key: 'subCounty',
    },
    {
      title: 'Ward',
      dataIndex: 'ward',
      key: 'ward',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'KHMFL Code',
      dataIndex: 'kmflCode',
      key: 'kmflCode',
    },
    {
      title: 'Ownership',
      dataIndex: 'ownership',
      key: 'ownership',
    },
    {
      title: <div className="flex justify-center">Actions</div>,
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            className="mx-0 p-0"
            type="link"
            onClick={() => {
              form.setFieldsValue(record)
              setVisible(record)
            }}
          >
            Update
          </Button>
          <Popconfirm
            title={
              record.status === 'inactive'
                ? 'Are you sure you want to restore this facility?'
                : 'Are you sure you want to archive this facility?'
            }
            onConfirm={() => handleArchive(record.kmflCode, record.status)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="mx-0 p-0" type="link" danger>
              {record.status === 'inactive' ? 'Restore' : 'Archive'}
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 100,
    },
  ]

  const handleChange = (name, value) => {
    if (name === 'county') {
      const countyKey = counties.find((county) => county.name === value)?.key
      form.setFieldsValue({ subCounty: null, ward: null })
      fetchLocations(`/chanjo-hapi/fhir/Location?partof=${countyKey}`, 'county')
    } else if (name === 'subCounty') {
      const subCountyKey = subCounties.find(
        (subCounty) => subCounty.name === value
      )?.key
      form.setFieldsValue({ ward: null })
      fetchLocations(
        `/chanjo-hapi/fhir/Location?partof=${subCountyKey}`,
        'subCounty'
      )
    }
  }

  const handleSave = async (values) => {
    const payload = convertLocationToFhir(values)
    const response = await put(
      `/chanjo-hapi/fhir/Location/${values.kmflCode}`,
      payload
    )
    if (response) {
      setVisible(false)
      message.success('Facility added successfully')
      await fetchFacilities(null, activeTab === '2')
    }
  }

  const handleArchive = async (code, status = 'active') => {
    const facility = await get(`/chanjo-hapi/fhir/Location/${code}`)
    const payload = {
      ...facility,
      status: status === 'active' ? 'inactive' : 'active',
    }

    const response = await put(`/chanjo-hapi/fhir/Location/${code}`, payload)
    if (response) {
      await fetchFacilities(null, activeTab === '2')
      message.success('Facility archived successfully')
    }
  }

  const handleSearch = debounce(
    (e) => fetchFacilities(e.target.value, activeTab === '2'),
    500
  )

  return (
    <div>
      <Card
        size="small"
        title={
          <div className="px-4 text-xl font-semibold py-2 sm:px-6">
            Admin Management - Add Facility
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
            Add Facility
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
            items={['Active Facilities', 'Archived Facilities'].map(
              (item, index) => ({
                key: (index + 1).toString(),
                label: item,
                children: (
                  <div>
                    <div className="my-2 flex">
                      <Form
                        onFinish={(values) => {
                          fetchFacilities(values.search, activeTab === '2')
                        }}
                        className="flex w-full items-center"
                      >
                        <Form.Item name="search" className="w-full mr-4">
                          <Input
                            allowClear
                            placeholder="Search Facility"
                            className="w-full ml-auto"
                            onChange={handleSearch}
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
                        id="facility"
                        columns={columns}
                        dataSource={facilities}
                        size="small"
                        loading={loading}
                        rowKey="kmflCode"
                        pagination={{
                          pageSize: 12,
                          showTotal: (total, range) =>
                            `${range[0]} - ${range[1]} of ${
                              pageSize - 1
                            } facilities`,
                          showSizeChanger: false,
                          defaultCurrent: 1,
                          current: currentPage,
                          total: pageSize - 1,
                          onChange: async (page) => {
                            setCurrentPage(page)
                          },
                        }}
                      />
                    </div>
                  </div>
                ),
              })
            )}
          />

          <Modal
            width={700}
            title="Add Facility"
            open={visible}
            onOk={() => form.submit()}
            onCancel={() => setVisible(false)}
            okText="Save Details"
          >
            <Form layout="vertical" form={form} onFinish={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                {/* Column 1 */}

                <Form.Item
                  label="Facility Name"
                  className="col-span-3"
                  name="name"
                  rules={[
                    { required: true, message: 'Facility Name is required' },
                  ]}
                >
                  <Input placeholder="Facility Name" />
                </Form.Item>

                <Form.Item
                  label="County"
                  name="county"
                  rules={[{ required: true, message: 'County is required' }]}
                >
                  <Select
                    placeholder="Select County"
                    allowClear
                    onSelect={(value) => handleChange('county', value)}
                    filterOption={(input, option) =>
                      option?.label
                        .toLowerCase()
                        ?.includes(input?.toLowerCase())
                    }
                    showSearch
                    options={counties?.map((subCounty) => ({
                      value: subCounty.name,
                      label: subCounty.name,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label="Sub-county"
                  name="subCounty"
                  rules={[
                    { required: true, message: 'Sub-county is required' },
                  ]}
                >
                  <Select
                    placeholder="Select Sub-county"
                    allowClear
                    onSelect={(value) => handleChange('subCounty', value)}
                    options={subCounties?.map((subCounty) => ({
                      value: subCounty.name,
                      label: subCounty.name,
                    }))}
                    filterOption={(input, option) =>
                      option?.label
                        .toLowerCase()
                        ?.includes(input?.toLowerCase())
                    }
                    showSearch
                  />
                </Form.Item>

                <Form.Item
                  label="Ward"
                  name="ward"
                  rules={[{ required: true, message: 'Ward is required' }]}
                >
                  <Select
                    placeholder="Select Ward"
                    allowClear
                    onSelect={(value) => handleChange('ward', value)}
                    options={wards?.map((ward) => ({
                      value: ward.name,
                      label: ward.name,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label="KHMFL Code"
                  name="kmflCode"
                  rules={[
                    { required: true, message: 'KHMFL Code is required' },
                  ]}
                >
                  <Input placeholder="KHMFL Code" />
                </Form.Item>

                <Form.Item
                  label="Level"
                  name="level"
                  rules={[{ required: true, message: 'Level is required' }]}
                >
                  <Select
                    placeholder="Select Level"
                    allowClear
                    options={[
                      { value: 'Level 1', label: 'Level 1' },
                      { value: 'Level 2', label: 'Level 2' },
                      { value: 'Level 3', label: 'Level 3' },
                      { value: 'Level 4', label: 'Level 4' },
                      { value: 'Level 5', label: 'Level 5' },
                      { value: 'Level 6', label: 'Level 6' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Ownership"
                  name="ownership"
                  rules={[{ required: true, message: 'Ownership is required' }]}
                >
                  <Select
                    placeholder="Select Ownership"
                    allowClear
                    options={[
                      {
                        value: 'Ministry of Health',
                        label: 'Ministry of Health',
                      },
                      { value: 'Private Practice', label: 'Private Practice' },
                      {
                        value: 'faith-based organization',
                        label: 'Faith Based Organization',
                      },
                      { value: 'Non-Governmental Organizations', label: 'NGO' },
                    ]}
                  />
                </Form.Item>
              </div>
            </Form>
          </Modal>
        </div>
      </Card>
    </div>
  )
}
