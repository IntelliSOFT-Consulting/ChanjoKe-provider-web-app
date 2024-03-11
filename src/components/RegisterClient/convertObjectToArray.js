import dayjs from 'dayjs'
import weekdays from 'dayjs/plugin/weekday'
import localeDate from 'dayjs/plugin/localeData'

dayjs.extend(weekdays)
dayjs.extend(localeDate) 

function convertCamelCaseString(inputString) {
  return inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
}

const ConvertObjectToArray = (inputObject) => {
  const clientDetails = [];

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  for (const key in inputObject) {
    const item = {
      title: `${convertCamelCaseString(capitalizeFirstLetter(key))}`,
      value: typeof inputObject[key] === 'object' ? dayjs(inputObject[key]).format('YYYY-MM-DD') :  inputObject[key],
    };

    clientDetails.push(item);
  }

  return clientDetails;
};

export default ConvertObjectToArray;
