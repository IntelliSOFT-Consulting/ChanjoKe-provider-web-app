import dayjs from 'dayjs'
import weekdays from 'dayjs/plugin/weekday'
import localeDate from 'dayjs/plugin/localeData'

dayjs.extend(weekdays)
dayjs.extend(localeDate) 

function convertCamelCaseString(inputString) {
  let stringWithSpaces = inputString?.replace(/([a-z])([A-Z])/g, '$1 $2');
  stringWithSpaces = stringWithSpaces?.replace(/\b\w+/g, (word) => {
    const lowercaseWords = ['of', 'or'];
    if (lowercaseWords.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  return stringWithSpaces;
}

const ConvertObjectToArray = (inputObject) => {
  const clientDetails = [];


  for (const key in inputObject) {
    const item = {
      title: `${convertCamelCaseString(key)}`,
      value: typeof inputObject[key] === 'object' ? dayjs(inputObject[key]).format('DD-MM-YYYY') :  convertCamelCaseString(inputObject[key]),
    };

    clientDetails.push(item);
  }

  return clientDetails;
};

export default ConvertObjectToArray;
