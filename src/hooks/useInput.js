import { useState } from "react";
/**
 * This is a custom hook for managing form inputs.
 * options accepts the following keys.
 *
 *  value: string, optional
 *  type: string, optional
 *  name: string, optional
 *  placeholder: string, optional
 *  validator: function, optional
 *  labelValue: string, optional
 *  error: String, optional
 *  autofocus: boolean
 */
export default function useInput(options = {}) {
  const { value = "" } = options;
  const [currentValue, setValue] = useState(value);
  const [validated, setValidated] = useState(value.trim().length > 0);
  const [backendErrorMessage, setBackendErrorMessage] = useState("");

  /**
   * options.validator?.bind({value: currentValue})
   * options.validator is an optional validation function that will be called
   * to validate the current value. Your validation function must get the current
   * value by calling "this.value" and I am setting the "this" context of your
   * validation function by calling .bind({value: currentValue })
   *
   * If no validation function is passed in then a default validation function
   * is used. One that simply checks for existence of a string.
   */
  const isValid =
    options.validator?.bind({ value: currentValue }) ||
    function () {
      return currentValue.trim().length > 0;
    };

  /**
   * Return true is the current value has been validated but is invalid.
   */
  function validatedAndInvalid() {
    return validated && !isValid();
  }

  /**
   * The label text to be used in the form. Backend validation errors take
   * precedence - if there are backend validation errors then that is the text
   * used as the label text. Otherwise, if the input is valid then the provided
   * label text is shown. If the input is not valid then the provided error
   * message is shown
   */
  function label() {
    if (backendErrorMessage) {
      return backendErrorMessage;
    }

    return validated == isValid() ? options.labelValue : options.error;
  }

  /**
   * Returns a tailwind-css class name if invalid
   * otherwise returns an empty string.
   */
  function labelClassList() {
    if (backendErrorMessage || validatedAndInvalid()) {
      return "text-secondary";
    } else {
      return "";
    }
  }

  /**
   * Returns a tailwind-css class name if invalid
   * otherwise returns an empty string.
   */
  function inputClassList() {
    if (backendErrorMessage || validatedAndInvalid()) {
      return "input-secondary";
    } else {
      return "";
    }
  }

  /**
   * Update the input value in useState.
   */
  function onChange(e) {
    e.preventDefault();
    setValidated(true);
    setValue(e.target.value);
  }

  return [
    {
      /**
       * The "input" object can be spread into any <input> html jsx element.
       */
      input: {
        value: currentValue,
        type: options.type,
        placeholder: options.placeholder || "",
        name: options.name || "",
        className: `input input-bordered w-full focus:outline-none  ${inputClassList()}`,
        autoFocus: options.autoFocus || false,
        disabled: options.disabled || false,
        onChange,
      },
      /**
       * The label is used for retrieving label text and class names
       */
      label: {
        value: label(),
        className: labelClassList(),
      },
      /**
       * This function is called when the form is submitted.
       * By manually setting the validated state to true, any fields that are
       * not valid will now be highlighted and isValid() returns false.
       */
      validate: () => {
        setValidated(true);
        return isValid();
      },
    },
    /**
     * The second item returned from this hook is a setter. This setter should
     * only be used to change the error message to an error message provided
     * from the backend.
     */
    (newErrorMessage) => {
      setValidated(true);
      setBackendErrorMessage(newErrorMessage);
    },
  ];
}
