import usePatient from './usePatient';
import useVaccination from './useVaccination';
import moment from 'moment';

export default function useDefaulter() {

    const { searchPatients } = usePatient();
    const { searchRecommendations } = useVaccination();

    const handleSearch = async (values) => {
        // build a query string to search for patients using the available filters and values
        const { clientName, date, vaccineName } = values;
        const names = clientName.split(' ');
        const searchQuery = names.map((name) => `name=${name}`).join('&');
        const patients = await searchPatients(searchQuery);

        const patientIds = patients.entry.map((patient) => patient.resource.id);
        const vaccineQuery = vaccineName ? `vaccine=${vaccineName}` : '';

        let query = `patient=${patientIds.join(',')}`;
        if (date?.length) {
            const startDate = moment(date[0]).format('YYYY-MM-DD');
            const endDate = moment(date[1]).format('YYYY-MM-DD');
            const dateQuery = `date=gte:${startDate},lte:${endDate}`;

        }





    };
}
