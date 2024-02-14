import { useState } from "react";
import validate from "./validate";

export default function FormState(formStructure, formRules) {
  const [formData, setFormData] = useState(formStructure)
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const toBeValidated = Object.keys(formRules).find(val => name === val)

    if (formRules && toBeValidated) {

      const isInvalid = validate(name, value, formRules).find((value) => (value.valid && value.valid !== true));
  
      if (isInvalid) {
        setFormErrors((errors) => ({
          ...errors,
          [name]: `${name} is a required value`
        }))
      } else {
        setFormErrors((errors) => {
          const updatedErrors = { ...errors };
          delete updatedErrors[name];
          return updatedErrors;
        })
      }

    }
  };

  return {
    formData,
    formErrors,
    handleChange
  }
}