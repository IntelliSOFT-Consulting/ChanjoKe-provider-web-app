import { useState } from "react";
import TextInput from "../common/forms/TextInput";
import SearchTable from "../common/tables/SearchTable";

export default function DefaulterTracing() {

  const [formData, setFormData] = useState({
    clientName: '',
    startDate: '',
    endDate: '',
    vaccineName: '',
  })
  const [defaulters, setDefaulters] = useState([
    { name: 'John Doe', uniqueID: 'XXX XXX', phoneNumber: '0700 000000', vaccinesMissed: 'Polio', dose: 4, scheduledDate: 'Jan 20/2024' },
    { name: 'John Doe', uniqueID: 'XXX XXX', phoneNumber: '0700 000000', vaccinesMissed: 'Polio', dose: 5, scheduledDate: 'Jan 20/2024' },
    { name: 'John Doe', uniqueID: 'XXX XXX', phoneNumber: '0700 000000', vaccinesMissed: 'Polio', dose: 2, scheduledDate: 'Jan 20/2024' },
    { name: 'John Doe', uniqueID: 'XXX XXX', phoneNumber: '0700 000000', vaccinesMissed: 'Polio', dose: 5, scheduledDate: 'Jan 20/2024' },
    { name: 'John Doe', uniqueID: 'XXX XXX', phoneNumber: '0700 000000', vaccinesMissed: 'Polio', dose: 1, scheduledDate: 'Jan 20/2024' },
  ])

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // validate(name, value, formRules);
  };

  const tHeaders = [
    {title: 'Name', class: '', key: 'name'},
    {title: 'Unique ID', class: '', key: 'uniqueID'},
    {title: 'Phone Number', class: '', key: 'phoneNumber'},
    {title: 'Vaccines Missed', class: '', key: 'vaccinesMissed'},
    {title: 'Dose', class: '', key: 'dose'},
    {title: 'Scheduled Date', class: '', key: 'scheduledDate'},
  ]

  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Defaulter Tracing
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <TextInput
              inputType="text"
              inputName="clientName"
              inputId="clientName"
              label="Enter Client Name/ID"
              value={formData.clientName}
              onInputChange={(value) => handleChange('clientName', value)}
              inputPlaceholder="Enter Client Name/ID"/>
          </div>
          <div>
            <TextInput
              inputType="date"
              inputName="startDate"
              inputId="startDate"
              label="Start Date"
              value={formData.startDate}
              onInputChange={(value) => handleChange('startDate', value)}/>
          </div>
          <div>
            <TextInput
              inputType="date"
              inputName="endDate"
              inputId="endDate"
              label="End Date"
              value={formData.endDate}
              onInputChange={(value) => handleChange('endDate', value)}/>
          </div>
          <div>
            <TextInput
              inputType="text"
              inputName="vaccineName"
              inputId="vaccineName"
              label="Vaccine"
              value={formData.vaccineName}
              onInputChange={(value) => handleChange('vaccineName', value)}
              inputPlaceholder="Vaccine"/>
          </div>
        </div>

        <SearchTable
          headers={tHeaders}
          data={defaulters}
          />
      </div>
    </div>
  );
}