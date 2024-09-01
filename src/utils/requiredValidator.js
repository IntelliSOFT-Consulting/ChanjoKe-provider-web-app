import { useEffect, useState } from 'react';

const RequiredValidator = (formStructure, formRules) => {
  const [isFormValid, setFormValid] = useState(false);

  // const keys = Object.keys(formRules)

  const checkFormValidity = () => {
    for (const field in formRules) {
      const rules = formRules[field];
      const value = formStructure[field];


      if (rules.required) {
        if (!value || value === "") {
          setFormValid(false);
          return;
        }

        if (rules.minLen && value.length < rules.minLen) {
          setFormValid(false);
          return;
        }

        if (rules.maxLen && value.length > rules.maxLen) {
          setFormValid(false);
          return;
        }

        if (rules.enum && !rules.enum.includes(value)) {
          setFormValid(false);
          return;
        }
      }
    }


    setFormValid(true);
  };

  useEffect(() => {
    checkFormValidity();
  }, [formStructure]);

  return isFormValid;
};

export default RequiredValidator;
