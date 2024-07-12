import { Button, Card } from "antd";
import useInputTable from "../../hooks/InputTable";
import { useEffect, useState } from "react";
import useVaccination from "../../hooks/useVaccination";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  btnPrimary: {
    backgroundColor: '#163C94',
    borderColor: '#163C94',
    color: 'white',
    '&:hover': {
      backgroundColor: '#163C94 !important',
      borderColor: '#163C94',
      color: 'white !important',
    },
  },
})

export default function StockCount() {

  const [vaccineOptions, setVaccineOptions] = useState([])

  const { getAllVaccines } = useVaccination()

  const classes = useStyles()

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const vaccines = await getAllVaccines()
        if (Array.isArray(vaccines)) {
          const formattedVaccines = vaccines.map((vaccine) => ({
            value: vaccine.vaccineName,
            label: vaccine.vaccineName
          }))
          setVaccineOptions(formattedVaccines)
        } else {
          console.error("Vaccine data is not an Array", vaccines)
        }
      } catch (error) {
        console.log("Error fetching vaccines: ", error)
      }
    }

    fetchVaccines()
  }, [getAllVaccines])

  const columns = [
    {
      title: 'Vaccine/Diluents',
      dataIndex: 'vaccine',
      type: 'select',
      options: vaccineOptions,
    },
    {
      title: 'Batch Number',
      dataIndex: 'batchNumber',
      type: 'select',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      type: 'date',
      disabled: true,
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'quantity',
      type: 'number',
      disabled: true,
    },
    {
      title: 'Physical Count',
      dataIndex: 'physicalCount',
      type: 'number',
    },
    {
      title: 'VVM Status',
      dataIndex: 'vvmStatus',
      type: 'select',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      type: 'remove',
    }
  ]

  const { InputTable } = useInputTable({ columns })

  return (
    <>
      <Card
        className="mt-5"
        title={<div className="text-xl font-semibold">Stock Count</div>}
        actions={[
          <div className="flex justify-end px-6">
            <Button
              type="primary"
              className="mr-4"
              ghost
            >
              Cancel
            </Button>
            <Button
              className={classes.btnPrimary}
            >
              Submit
            </Button>
          </div>
        ]}
      >
        <div className="p-5">
          <InputTable />
        </div>
      </Card>
    </>
  )
}