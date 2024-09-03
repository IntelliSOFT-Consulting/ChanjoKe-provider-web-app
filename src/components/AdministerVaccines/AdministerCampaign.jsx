import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Tag,
  notification,
} from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import moment from 'moment'

import Loading from '../../common/spinners/LoadingArrows'
import { uniqueVaccineOptions } from '../../data/vaccineData'
import useCampaign from '../../hooks/useCampaigns'
import useEncounter from '../../hooks/useEncounter'
import useInventory from '../../hooks/useInventory'
import useObservations from '../../hooks/useObservations'
import useVaccination from '../../hooks/useVaccination'
import { formatInventoryToTable } from '../StockManagement/helpers/inventoryFormatter'
import {
  createImmunizationResource,
  getBodyWeight,
} from './administerController'
import { checkIfVaccineIsAlreadyAdministered } from './helpers/campaignHelper'

const AdministerCampaign = () => {
  const [inventory, setInventory] = useState(null)
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()

  const { campaign, fetchCampaign } = useCampaign()
  const { getDetailedInventoryItems, batchItems, updateInventory } =
    useInventory()
  const {
    createImmunization,
    getRecommendations,
    immunizations,
    getImmunizations,
    recommendations,
  } = useVaccination()
  const { createEncounter } = useEncounter()
  const { getLatestObservation, createObservation } = useObservations()

  const { user } = useSelector((state) => state.userInfo)
  const navigate = useNavigate()
  const { clientID } = useParams()

  const campaignStore = localStorage.getItem('campaign')
    ? JSON.parse(localStorage.getItem('campaign'))
    : null

  const checkExpiry = (campaignItem) => {
    const today = moment().format('YYYY-MM-DD')
    const expiryDate = moment(campaignItem?.period?.ed).format('YYYY-MM-DD')

    if (today > expiryDate) {
      return navigate('/campaigns')
    }
    return false
  }

  useEffect(() => {
    if (user?.location === 'Campaign' && campaignStore?.campaignID) {
      fetchCampaign(campaignStore?.campaignID)
      getWeight()
      getDetailedInventoryItems()
    }
  }, [campaignStore?.campaignID, user])

  useEffect(() => {
    if (batchItems) {
      setInventory(formatInventoryToTable(batchItems))
    }
  }, [batchItems])

  useEffect(() => {
    if (campaign) {
      checkExpiry(campaign)
      getDiseases()
      getRecommendations(clientID)
      getImmunizations(clientID)
    }
  }, [campaign, clientID])

  const getWeight = async () => {
    const observation = await getLatestObservation(clientID)
    const today = moment().format('YYYY-MM-DD')
    const observationDate =
      observation?.resource?.meta?.lastUpdated?.split('T')[0]

    if (observation && observationDate === today) {
      const weight = getBodyWeight(observation?.resource)
      form.setFieldsValue(weight)
    }
  }

  const getDiseases = () => {
    const diseasesInfo = campaign?.activity?.map(
      (activity) => activity?.detail?.productCodeableConcept
    )
    const diseasesList = diseasesInfo?.map(
      (disease) => disease?.coding?.[0]?.display
    )
    setDiseases(diseasesList)
  }

  const getVaccines = (index) => {
    const diseaseTarget = form.getFieldValue('vaccines')[index].diseaseTarget
    const vaccines = uniqueVaccineOptions
      ?.filter((vaccine) => vaccine.disease === diseaseTarget)
      .map((vaccine) => vaccine.label)
    const applicableVaccines = inventory?.filter((item) =>
      vaccines.includes(item.vaccine)
    )

    return applicableVaccines?.sort((a, b) =>
      dayjs(a.expiryDate).diff(dayjs(b.expiryDate))
    )
  }

  const handleFormSubmit = async (values) => {
    setLoading(true)

    try {
      const processedVaccines = values.vaccines.map((item) => {
        const [batchNumber, vaccine] = item.batchNumber.split('|')
        return { ...item, batchNumber, vaccine }
      })

      const data = checkIfVaccineIsAlreadyAdministered(
        recommendations,
        immunizations,
        processedVaccines
      )

      const vaccineResources = createImmunizationResource(
        {
          ...values,
          vaccines: processedVaccines,
          description: campaign?.title,
          site: campaignStore?.campaignSite,
        },
        data,
        clientID,
        user
      )

      await Promise.all(vaccineResources.map(createImmunization))

      const encounter = await createEncounter(
        clientID,
        user?.fhirPractitionerId,
        user?.orgUnit?.code?.split('/')[1]
      )

      await createObservation(values, clientID, encounter?.id)

      const items = await getDetailedInventoryItems()

      await Promise.all(
        items.map(async (vaccine) => {
          const batch = vaccine.extension.find(
            (ext) => ext.url === 'batchNumber'
          )
          const findBatch = processedVaccines.find(
            (v) => v.batchNumber === batch?.valueString
          )
          if (findBatch) {
            const updatedVaccine = {
              ...vaccine,
              extension: vaccine.extension.map((ext) =>
                ext.url === 'quantity'
                  ? {
                      ...ext,
                      valueQuantity: {
                        ...ext.valueQuantity,
                        value: ext.valueQuantity.value - 1,
                      },
                    }
                  : ext
              ),
            }
            return await updateInventory(updatedVaccine)
          }
        })
      )

      api.success({ message: 'Vaccine(s) administered successfully' })
      navigate(`/search/administerVaccine/${campaignStore.campaignSite}`, {
        replace: true,
      })
    } catch (error) {
      api.error({
        message: 'Failed to administer vaccine(s)',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const renderVaccineFields = (fields, { add, remove }) => (
    <div className="w-full">
      {fields.map((field, index) => (
        <div
          key={field.key}
          className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-10 relative pr-8"
        >
          <Form.Item
            name={[field.name, 'batchNumber']}
            label="Vaccine Batch"
            rules={[{ required: true, message: 'Please select batch number' }]}
          >
            <Select
              placeholder="Select Vaccine Batch"
              style={{ width: '100%' }}
            >
              {getVaccines(index)?.map((vaccine) => (
                <Select.Option
                  key={vaccine.batchNumber}
                  value={`${vaccine.batchNumber}|${vaccine.vaccine}`}
                >
                  <span className="mr-2">{vaccine.vaccine}</span>
                  <Tag color="blue">{vaccine.batchNumber}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={[field.name, 'diseaseTarget']}
            label="Disease Target"
          >
            <Input placeholder={field.diseaseTarget} disabled />
          </Form.Item>
          <Button
            onClick={() => remove(field.name)}
            className="absolute right-0 p-0 top-7"
            danger
            type="link"
            icon={<MinusCircleOutlined />}
          />
        </div>
      ))}
      {fields.length < diseases.length && (
        <div className="flex justify-end">
          <Select
            placeholder="Add Vaccine"
            onSelect={(value) => add({ diseaseTarget: value })}
          >
            {diseases
              .filter(
                (disease) =>
                  !form
                    .getFieldValue('vaccines')
                    .some((v) => v.diseaseTarget === disease)
              )
              .map((disease) => (
                <Select.Option key={disease} value={disease}>
                  {disease}
                </Select.Option>
              ))}
          </Select>
        </div>
      )}
    </div>
  )

  if (!diseases?.length) {
    return (
      <div className="flex justify-center items-center h-56">
        <Loading />
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-xl font-semibold py-2 sm:px-6">
        Administer Vaccine
      </div>
      {contextHolder}
      <Form
        className="px-4 py-5 sm:p-6"
        layout="vertical"
        form={form}
        onFinish={handleFormSubmit}
      >
        <div className="col-span-2 border-b mb-2">
          <Form.Item
            name="currentWeight"
            label="Current Weight"
            className="w-1/2 addon"
          >
            <InputNumber
              placeholder="Current Weight"
              controls={false}
              addonAfter={
                <Form.Item name="weightMetric" noStyle>
                  <Select defaultValue="kg" style={{ width: 70 }}>
                    <Select.Option value="kg">Kg</Select.Option>
                    <Select.Option value="g">g</Select.Option>
                  </Select>
                </Form.Item>
              }
            />
          </Form.Item>
        </div>

        <Form.List
          name="vaccines"
          initialValue={diseases?.map((disease) => ({
            diseaseTarget: disease,
          }))}
        >
          {renderVaccineFields}
        </Form.List>
      </Form>
      <div className="px-4 py-4 sm:px-6 flex justify-end">
        <Button onClick={() => navigate(-1)}>Cancel</Button>
        <Popconfirm
          title="Are you sure you want to administer?"
          onConfirm={() => form.submit()}
          okText="Yes"
          cancelText="No"
        >
          <Button
            loading={loading}
            disabled={loading}
            type="primary"
            className="ml-4 btn-success text-sm font-semibold"
          >
            Administer
          </Button>
        </Popconfirm>
      </div>
    </div>
  )
}

export default AdministerCampaign
