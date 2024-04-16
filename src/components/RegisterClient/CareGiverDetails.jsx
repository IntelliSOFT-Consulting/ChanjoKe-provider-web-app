import { useState, useEffect } from 'react';
import SearchTable from '../../common/tables/SearchTable';
import { v4 as uuidv4 } from 'uuid'
import ConfirmationDialog from '../../common/dialog/ConfirmationDialog'
import { Col, Row, Form, Input, Select } from 'antd'
import dayjs from 'dayjs';
import calculateAge from '../../utils/calculateAge';

export default function CaregiverDetails({ editCaregivers = [], updateCaregiverDetails, dateOfBirth, handleBack, nextPage }) {
  const caregiverTypes = [
    { id: 1, name: 'Father', value: 'Father' },
    { id: 2, name: 'Mother', value: 'Mother' },
    { id: 3, name: 'Guardian', value: 'Guardian' },
  ];

  const [caregivers, setCaregivers] = useState(editCaregivers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [caregiverToRemove, setCaregiverToRemove] = useState('')
  const [isOver18, setIsOver18] = useState(false)
  const [tHeaders, setTHeaders] = useState([
    {title: 'Caregiver Type', class: '', key: 'caregiverType'},
    {title: 'Caregiver Name', class: '', key: 'caregiverName'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
    {title: 'Actions', class: '', key: 'actions'},
  ])

  const [form] = Form.useForm()

  useEffect(() => {
    updateCaregiverDetails(caregivers)

    const date = dayjs(dateOfBirth).format('YYYY-MM-DD')
    const stringAge = calculateAge(date)
    const age = stringAge.match(/(\d+)\s*year/i)
    if (age === null) {
      setIsOver18(false)
    } else if (parseInt(age[1]) >= 18) {
      setIsOver18(true)
      setTHeaders([
        {title: 'Next of Kin Type', class: '', key: 'caregiverType'},
        {title: 'Next of Kin Name', class: '', key: 'caregiverName'},
        {title: 'Phone Number', class: '', key: 'phoneNumber'},
        {title: 'Actions', class: '', key: 'actions'},
      ])
    }
  }, [caregivers])

  const handleAction = (onActionBtn, data) => {
    if (onActionBtn === 'editCareGiver') {
      const arrayWithoutCaregiver = caregivers.filter((caregiver) => caregiver.id !== data.id)

      form.setFieldsValue({
        id: data.id || uuidv4(),
        caregiverName: data.caregiverName,
        caregiverType: data.caregiverType,
        phoneNumber: data.phoneNumber,
        actions: [
          { title: 'edit', btnAction: 'editCareGiver', class: 'text-blue-300' },
          { title: 'remove', btnAction: 'removeCareGiver', class: 'text-red-400' }
        ]
      })
      
      setCaregivers(arrayWithoutCaregiver)
    }

    if (onActionBtn === 'removeCareGiver') {
      setIsDialogOpen(true)
      setCaregiverToRemove(data.id)
    }
  }

  const handleAcceptRemoveCaregiver = () => {
    if (caregiverToRemove) {
      const arrayWithoutCaregiver = caregivers.filter((caregiver) => caregiver.id !== caregiverToRemove)
      setCaregivers(arrayWithoutCaregiver)
    }
  }

  const onFinish = (values) => {

    values.id = uuidv4()
    values.actions = [
      { title: 'edit', btnAction: 'editCareGiver', class: 'text-blue-300' },
      { title: 'remove', btnAction: 'removeCareGiver', class: 'text-red-400' }
    ]

    setCaregivers([...caregivers, values])
    form.resetFields()
  };

  const capitalizeInput = (e) => {
    const inputName = e.target.dataset?.name
    const value = e.target.value

    if (value) {
      const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());
      form.setFieldValue(inputName, capitalized)
    }
  }

  return (
    <>

      <ConfirmationDialog
        open={isDialogOpen}
        description="Are you sure you want to remove Caregiver?"
        confirmationData={caregiverToRemove}
        onClose={() => setIsDialogOpen(false)}
        onAccept={handleAcceptRemoveCaregiver}
        title="Remove Caregiver" />
      <h3 className="text-xl font-medium px-6">{isOver18 ? `Next of Kin Details`: `Caregiver Details`}</h3>

      <Form
        onFinish={onFinish}
        layout="vertical"
        form={form}
        autoComplete="off">
        <Row className='mt-5 px-6' gutter={16}>

          <Col className="gutter-row" span={8}>
            <Form.Item
              name="caregiverType"
              label={
                <div>
                  <span className="font-bold">{isOver18 ? 'Next of Kin': 'Caregiver'} Type</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input the caregiver/next of kin type!',
                },
              ]}>
              <Select size='large'>
                {caregiverTypes.map((option) => (
                  <Select.Option value={option.value}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col className="gutter-row" span={8}>
            <Form.Item
              name="caregiverName"
              label={
                <div>
                  <span className="font-bold">{isOver18 ? 'Next of Kin': 'Caregiver'} Name</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input the caregiver name!',
                },
              ]}>
                <Input
                  placeholder="eg John Doe"
                  autoComplete="off"
                  data-name="caregiverName"
                  onChange={(e) => capitalizeInput(e)}
                  className='block w-full rounded-md py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400' />
            </Form.Item>
          </Col>

          <Col className="gutter-row" span={8}>
            <Form.Item
              name="phoneNumber"
              label={
                <div>
                  <span className="font-bold">Phone Number</span>
                </div>
              }
              rules={[
                {
                  required: true,
                  message: 'Please input the phone number!',
                },
                {
                  pattern: /^(\+?)([0-9]{7,10})$/,
                  message: 'Please enter a valid phone number!',
                },
              ]}>
                <Input
                  prefix={<span className='flex'>+254</span>}
                  placeholder="0700 000000"
                  autoComplete="off"
                  maxLength={10}
                  className='flex w-full rounded-md py-3 text-sm text-[#707070] ring-1 ring-inset ring-[#4E4E4E] placeholder:text-gray-400' />
            </Form.Item>

            <div className="w-full grid justify-items-end">
            <button
              htmlType="submit"
              className="ml-4 justify-self-end flex-shrink-0 rounded-md bg-[#163C94] border border-[#163C94] outline outline-[#163C94] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163C94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C94]">
              Add
            </button>
            </div>

            
          </Col>
        </Row>

      </Form>
      

      {
        caregivers.length > 0 &&
          <SearchTable
            headers={tHeaders}
            onActionBtn={handleAction}
            data={caregivers} />
      }

      <hr className='mt-5 mb-5 mx-10' />

      <div className="px-4 mx-3 py-4 sm:px-6 flex justify-end">
        <button
          onClick={handleBack}
          className="ml-4 flex-shrink-0 rounded-md outline outline-[#163C94] px-3 py-2 text-sm font-semibold text-[#163C94] shadow-sm hover:bg-[#163C94] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Back
        </button>
        <button
          onClick={() => {
            updateCaregiverDetails(caregivers)
            nextPage()
          }}
          disabled={caregivers && caregivers.length > 0 ? false : true}
          className={caregivers && caregivers.length > 0 ? "bg-[#163C94] tooltip border-[#163C94] outline-[#163C94] hover:bg-[#163C94] focus-visible:outline-[#163C94] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" : "bg-[#9cb7e3] tooltip border-[#9cb7e3] outline-[#9cb7e3] hover:bg-[#9cb7e3] focus-visible:outline-[#9cb7e3] ml-4 flex-shrink-0 rounded-md border outline  px-5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"}>
          Next
          { caregivers.length < 1 && <span className='tooltipleft'>
            Click on add to add the caregiver
            </span> }
        </button>      
      </div> 
    </>
  );
}