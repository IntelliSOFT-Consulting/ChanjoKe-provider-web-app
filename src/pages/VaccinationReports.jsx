import TextInput from '../common/forms/TextInput'
import FormState from '../utils/formState'
import SearchTable from '../common/tables/SearchTable'

export default function VaccinationReports() {

  const formRules = {
    reportIndicatorCode: {
      required: true
    },
    reportSubjectArea: {
      required: true
    },
    improvementIndicator: {
      required: true
    },
    reportingPeriodStart: {
      required: true
    },
    reportingPeriodEnd: {
      required: true
    },
    disaggregationGroup: {
      required: true
    },
  }

  const formStructure = {
    reportIndicatorCode: '',
    reportSubjectArea: '',
    improvementIndicator: '',
    reportingPeriodStart: '',
    reportingPeriodEnd: '',
    disaggregationGroup: '',
  }
  const reports = [
    {name: 'John Doe', uniqueId: 'XXX-XXXX', phoneNumber: '0700 000000', vaccinesMissed: 1, scheduledDate: 'Jan 20/2023'},
    {name: 'Antony Wanjohi', uniqueId: 'XXX-XXXX', phoneNumber: '0700 000000', vaccinesMissed: 2, scheduledDate: 'Jan 2/2023'},
    {name: 'Jane Doe', uniqueId: 'XXX-XXXX', phoneNumber: '0700 000000', vaccinesMissed: 1, scheduledDate: 'Jan 24/2023'},
  ]

  const tHeaders = [
    {title: 'NAME', class: '', key: 'name'},
    {title: 'UNIQUE ID', class: '', key: 'uniqueId'},
    {title: 'PHONE NUMBER', class: '', key: 'phoneNumber'},
    {title: 'VACCINES MISSED', class: '', key: 'vaccinesMissed'},
    {title: 'DOSE', class: '', key: 'dose'},
    {title: 'SCHEDULED DATE', class: '', key: 'scheduledDate'},
  ]


  const { formData, formErrors, handleChange } = FormState(formStructure, formRules)

  return (
    <div className="divide-y divide-gray-200 overflow-visible rounded-lg bg-white shadow mt-5">
      <div className="px-4 text-2xl font-semibold py-5 sm:px-6">
        Generate Vaccination Reports
      </div>
      <div className="px-4 py-5 sm:p-6">

        <form>
        
          <div className="grid grid-cols-3 gap-10">
            {/* Column 1 */}
            <div>

              <TextInput
                inputType="text"
                inputName="reportIndicatorCode"
                inputId="reportIndicatorCode"
                label="Report Indicator Code"
                required={true}
                value={formData.reportIndicatorCode}
                error={formErrors.reportIndicatorCode}
                onInputChange={(value) => handleChange('reportIndicatorCode', value)}
                inputPlaceholder="Select the Report Indicator Code"/>

              <TextInput
                inputType="text"
                inputName="reportingPeriodStart"
                inputId="reportingPeriodStart"
                label="Reporting Period Start"
                required={true}
                value={formData.reportingPeriodStart}
                error={formErrors.reportingPeriodStart}
                onInputChange={(value) => handleChange('reportingPeriodStart', value)}
                inputPlaceholder="Reporting Period Start"/>

            </div>

            {/* Column 2 */}
            <div>

              <TextInput
                inputType="text"
                inputName="reportSubjectArea"
                inputId="reportSubjectArea"
                label="Report Subject Area"
                required={true}
                value={formData.reportSubjectArea}
                error={formErrors.reportSubjectArea}
                onInputChange={(value) => handleChange('reportSubjectArea', value)}
                inputPlaceholder="Report Subject Area"/>

              <TextInput
                inputType="text"
                inputName="reportingPeriodEnd"
                inputId="reportingPeriodEnd"
                label="Reporting Period End"
                required={true}
                value={formData.reportingPeriodEnd}
                error={formErrors.reportingPeriodEnd}
                onInputChange={(value) => handleChange('reportingPeriodEnd', value)}
                inputPlaceholder="Reporting Period End"/>

            </div>

            {/* Column 3 */}
            <div>

              <TextInput
                inputType="text"
                inputName="improvementIndicator"
                inputId="improvementIndicator"
                label="Improvement Indicator"
                required={true}
                value={formData.improvementIndicator}
                error={formErrors.improvementIndicator}
                onInputChange={(value) => handleChange('improvementIndicator', value)}
                inputPlaceholder="Improvement Indicator"/>

              <TextInput
                inputType="text"
                inputName="disaggregationGroup"
                inputId="disaggregationGroup"
                label="Disaggregation Group"
                required={true}
                value={formData.disaggregationGroup}
                error={formErrors.disaggregationGroup}
                onInputChange={(value) => handleChange('disaggregationGroup', value)}
                inputPlaceholder="Disaggregation Group"/>
            </div>
          </div>

          <div className="grid grid-cols-5">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div>
              <button
                className="ml-4 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Generate Report
              </button>
            </div>
          </div>

        </form>

        <SearchTable
          headers={tHeaders}
          data={reports} />

          <div className="grid grid-cols-5 mt-5">
            <div></div>
            <div></div>
            <div></div>
            <div>
              <button
                className="ml-4 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Download PDF
              </button>
            </div>
            <div>
              <button
                className="ml-4 rounded-md outline bg-[#163C94] outline-[#163C94] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Download CSV
              </button>
            </div>
          </div>

      </div>
    </div>
  )
}