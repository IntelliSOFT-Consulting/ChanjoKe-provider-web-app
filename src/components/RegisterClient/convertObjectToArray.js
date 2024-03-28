import dayjs from 'dayjs'
import weekdays from 'dayjs/plugin/weekday'
import localeDate from 'dayjs/plugin/localeData'

dayjs.extend(weekdays)
dayjs.extend(localeDate) 

function convertCamelCaseString(inputString) {
  let stringWithSpaces = inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
  console.log({ stringWithSpaces })
  return stringWithSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
  // return inputString.replace(/([a-z])([A-Z])/g, '$1 $2');
}

const ConvertObjectToArray = (inputObject) => {
  const clientDetails = [];

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  for (const key in inputObject) {
    const item = {
      title: `${convertCamelCaseString(key)}`,
      value: typeof inputObject[key] === 'object' ? dayjs(inputObject[key]).format('DD-MM-YYYY') :  inputObject[key],
    };

    console.log({ item })

    clientDetails.push(item);
  }

  return clientDetails;
};

export default ConvertObjectToArray;
