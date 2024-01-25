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

    if (formRules) {

      const isInvalid = validate(name, value, formRules).find((value) => value.valid !== true);
  
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