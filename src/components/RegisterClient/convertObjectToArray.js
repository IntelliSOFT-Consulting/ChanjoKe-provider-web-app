const ConvertObjectToArray = (inputObject) => {
  const clientDetails = [];

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  for (const key in inputObject) {
    if (inputObject[key] !== "") {
      const item = {
        title: `${capitalizeFirstLetter(key)}:`,
        value: inputObject[key],
      };

      clientDetails.push(item);
    }
  }

  return clientDetails;
};

export default ConvertObjectToArray;
