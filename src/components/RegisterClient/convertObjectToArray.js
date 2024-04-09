import dayjs from 'dayjs'
import weekdays from 'dayjs/plugin/weekday'
import localeDate from 'dayjs/plugin/localeData'

dayjs.extend(weekdays)
dayjs.extend(localeDate) 

function convertCamelCaseString(inputString) {
  let stringWithSpaces = inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
  return stringWithSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
}

const ConvertObjectToArray = (inputObject) => {
  const clientDetails = [];

  for (const key in inputObject) {
    const item = {
      title: `${convertCamelCaseString(key)}`,
      value: typeof inputObject[key] === 'object' ? dayjs(inputObject[key]).format('DD-MM-YYYY') :  inputObject[key],
    };

    clientDetails.push(item);
  }

  return clientDetails;
};

export default ConvertObjectToArray;
