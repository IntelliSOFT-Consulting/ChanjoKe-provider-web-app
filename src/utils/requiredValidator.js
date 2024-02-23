import { useEffect, useState } from 'react';

const RequiredValidator = (formStructure, formRules) => {
  const [isFormValid, setFormValid] = useState(false);

  // const keys = Object.keys(formRules)

  // console.log({ formRules, keys })

  const checkFormValidity = () => {
    for (const field in formRules) {
      const rules = formRules[field];
      const value = formStructure[field];

      // console.log({ field, rules, value })

      // console.log({ rules, value, field })

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

    // console.log('should set it to true')

    setFormValid(true);
  };

  useEffect(() => {
    checkFormValidity();
  }, [formStructure]);

  return isFormValid;
};

export default RequiredValidator;
