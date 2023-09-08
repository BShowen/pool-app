import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";

import {
  CREATE_CHEMICAL_LOG,
  GET_SERVICE_ROUTE_TODAY,
} from "../../../queries/index.js";
import { formatAccountName } from "../../../utils/formatters.js";
import { SpinnerOverlay } from "../../../components/SpinnerOverlay.jsx";

export function AdminDashboard() {
  const { loading, error, data } = useQuery(GET_SERVICE_ROUTE_TODAY, {
    fetchPolicy: "network-only",
  });

  const [serviceRoute, setServiceRoute] = useState(
    data?.serviceRouteToday || {
      customerAccounts: [],
      count: 0,
      technician: null,
    }
  );

  useEffect(() => {
    // if not loading and not error and there is data, then set the serviceRoute
    // state to the data returned by the query.
    if (!loading && !error && data) {
      setServiceRoute(data.serviceRouteToday);
    }
  }, [data, error, loading]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error...</p>;
  }

  return (
    <div className="w-full flex flex-col justify-start items-center pt-9">
      <div className="p-2 w-full lg:w-11/12">
        {/* Header */}
        <span className="badge badge-primary p-3">
          {serviceRoute.count} customers
        </span>
      </div>
      <table className="table w-full lg:w-11/12 h-full">
        <tbody>
          {serviceRoute.customerAccounts.map((account, index) => {
            return (
              <CustomerRow
                key={account.id}
                account={account}
                index={index}
                hideAccount={() => {
                  // When the pool report form is submitted, remove that
                  // customer from the state so they are removed from the UI.
                  setServiceRoute((prevState) => {
                    return {
                      ...prevState,
                      customerAccounts: prevState.customerAccounts.filter(
                        (acc) => acc.id !== account.id
                      ),
                      count: prevState.count - 1,
                    };
                  });
                }}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CustomerRow({ account, index, hideAccount }) {
  const [showPoolReportForm, setShowPoolReportForm] = useState(false);

  function isDateToday(dateInMilliseconds) {
    // Return true if dateInMilliSeconds is todays date, regardless of time.
    // All im looking for is ensuring the dateInMilliseconds is todays DAY,
    // MONTH and YEAR
    if (dateInMilliseconds === undefined) {
      return false;
    }
    function formatDateToDDMMYYYY(dateInMilliseconds) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const dateFormatter = new Intl.DateTimeFormat("en-US", options);
      return dateFormatter.format(dateInMilliseconds);
    }

    return (
      formatDateToDDMMYYYY(dateInMilliseconds) ===
      formatDateToDDMMYYYY(new Date().getTime())
    );
  }

  function sanitizeResponse(obj) {
    // obj is the raw object received from the backend.
    // Create and return a new copy of the obj with "__typename" removed,
    // "customerAccountId" removed, "id" removed, "date" removed, and null
    // values replaced by empty strings

    // Create a new object to hold the filtered data
    const filteredObject = {};

    // Loop through the keys in the original object
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && typeof value === "object") {
        filteredObject[key] = sanitizeResponse(value);
      } else if (
        key !== "__typename" &&
        key !== "id" &&
        key !== "customerAccountId" &&
        key !== "date"
      ) {
        // Copy the key and its value to the filtered object
        filteredObject[key] = obj[key] || "";
      }
    }

    // Return the filtered object
    return filteredObject;
  }

  return (
    <>
      <tr key={account.id} className="hover:cursor-pointer flex flex-col">
        <td
          className="w-full px-1"
          onClick={(e) => {
            // If the <tr> is expanded and the user is clicking inside this
            // expanded content, then do not collapse the <tr>.
            // In other words, only expand/collapse when the <tr> element itself
            // is clicked.
            if (!e.target.closest(".expanded-content"))
              setShowPoolReportForm((prevState) => !prevState);
          }}
        >
          <div className="w-full flex flex-row justify-end items-center flex-wrap gap-2">
            <div className="flex flew-row items-center me-auto">
              <div className="border-2 bg-slate-200 w-6 h-6 text-center rounded-md ">
                <p className="text-sm font-semibold">{index + 1}</p>
              </div>
              <div>
                <p className="text-sm font-semibold px-1">
                  {formatAccountName(account.accountName)}
                </p>
              </div>
            </div>
            {/* 
              showPoolReportForm --> So the "Send pool report" button 
              disappears when the pool report form is opened for editing 
            */}
            {isDateToday(account.latestChemicalLog?.date) &&
              !showPoolReportForm && (
                <div className="w-full md:w-auto order-last md:order-none">
                  <button
                    className="btn btn-accent btn-xs w-full"
                    onClick={(e) => {
                      e.stopPropagation(); //Prevent the row from expanding.
                      e.preventDefault(); //Prevent any default behavior.
                    }}
                  >
                    Send pool report
                  </button>
                </div>
              )}
            {!isDateToday(account.latestChemicalLog?.date) &&
              !showPoolReportForm && (
                <div className="flex flex-row justify-end gap-2">
                  <div className="badge badge-secondary text-xs font-semibold">
                    Filter
                  </div>
                  <div className="badge badge-secondary text-xs font-semibold">
                    Salt Cell
                  </div>
                </div>
              )}
          </div>
          {showPoolReportForm && (
            <PoolReportForm
              cancelHandler={() => setShowPoolReportForm(false)}
              customerAccountId={account.id}
              hideAccount={hideAccount}
              values={
                account.latestChemicalLog
                  ? sanitizeResponse(account.latestChemicalLog)
                  : null
              }
            />
          )}
        </td>
      </tr>
    </>
  );
}

function PoolReportForm({
  cancelHandler,
  customerAccountId,
  hideAccount,
  values,
}) {
  const [createChemicalLog, { loading, error, data }] = useMutation(
    CREATE_CHEMICAL_LOG,
    { refetchQueries: [{ query: GET_SERVICE_ROUTE_TODAY }] }
  );

  const [formValues, setFormValues] = useState(
    values || {
      chlorine: { test: "", add: { unit: "lb", quantity: "" } },
      pH: { test: "", add: { unit: "cups", quantity: "" } },
      alkalinity: { test: "", add: { unit: "lb", quantity: "" } },
      stabilizer: { test: "", add: { unit: "lb", quantity: "" } },
      calcium: { test: "", add: { unit: "lb", quantity: "" } },
      tablets: { test: "", add: { quantity: "" } },
      salt: { test: "", add: { unit: "lb", quantity: "" } },
      notes: "",
    }
  );

  useEffect(() => {
    // if not loading and not error and there is data, then the pool report form
    // has been successfully submitted and we need to collapse the form.
    if (!loading && !error && data) {
      cancelHandler(); // Collapse the form on successful submission.
    }
  }, [data]);

  function updateState({ name, value, action }) {
    switch (action) {
      case "addQuantity":
        setFormValues((prevState) => {
          return {
            ...prevState,
            [name]: {
              ...prevState[name],
              add: { ...prevState[name].add, quantity: value },
            },
          };
        });
        break;
      case "addUnit":
        setFormValues((prevState) => {
          return {
            ...prevState,
            [name]: {
              ...prevState[name],
              add: { ...prevState[name].add, unit: value },
            },
          };
        });
        break;
      case "test":
        setFormValues((prevState) => {
          return {
            ...prevState,
            [name]: { ...prevState[name], test: value },
          };
        });
        break;
      case "notes":
        setFormValues((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
        break;
    }
  }

  function convertStringToNull(obj) {
    // Create and return a copy of the obj and replace all null values with
    // an empty string.

    const newObj = {}; // Create a new object to hold the transformed data

    for (const key in obj) {
      if (typeof obj[key] === "object") {
        // If it's an object, recursively call the function on it
        if (key === "add" && obj[key].quantity === "") {
          // If the object is the "add" object and no chemicals were added, then
          // don't process the object.
          continue;
        } else {
          newObj[key] = convertStringToNull(obj[key]);
        }
      } else if (key === "test" || key === "quantity") {
        // If it's "test" or "quantity," convert to a number if it's not empty,
        // otherwise, convert to null
        const newValue = obj[key] === "" ? null : Number(obj[key]);
        // If the newValue is null, don't keep the newValue or the key.
        if (newValue !== null) {
          newObj[key] = newValue;
        }
      } else {
        // If it's neither "test" nor "quantity," convert to a number if it's
        // not empty, otherwise convert to null.
        const newValue = obj[key] === "" ? null : Number(obj[key]);
        // If the newValue is null, don't keep the newValue or the key.
        if (newValue !== null) {
          newObj[key] = obj[key];
        }
      }
    }

    return newObj; // Return the new object with transformed data
  }

  if (error) {
    return "Error...";
  }

  return (
    <div className="w-full px-0 mt-2 expanded-content flex flex-row justify-center">
      <Form
        className="w-full lg:w-2/4 flex flex-col bg-slate-100 rounded-md pb-4 relative"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createChemicalLog({
              variables: {
                input: {
                  customerAccountId,
                  ...convertStringToNull(formValues),
                },
              },
            });
          } catch (error) {
            console.log("Error ", { error });
          }
        }}
      >
        {loading && <SpinnerOverlay />}
        <div className="flex flex-row justify-center items-center py-1">
          <div className="flex flex-row justify-end w-3/12 lg:w-1/3 pe-4"></div>
          <div className="flex flex-row gap-2 w-9/12 lg:w-2/3 justify-start">
            <div className="w-4/12 lg:w-3/12 text-center">
              <p>Test</p>
            </div>
            <div className="w-4/12 lg:w-3/12 text-center">
              <p>Add</p>
            </div>
          </div>
        </div>
        <ChemicalInput
          text={"chlorine"}
          formValues={formValues}
          inputHandler={updateState}
        />
        <ChemicalInput
          text={"pH"}
          formValues={formValues}
          inputHandler={updateState}
        />
        <ChemicalInput
          text={"alkalinity"}
          formValues={formValues}
          inputHandler={updateState}
        />
        <ChemicalInput
          text={"stabilizer"}
          formValues={formValues}
          inputHandler={updateState}
        />
        <ChemicalInput
          text={"salt"}
          formValues={formValues}
          inputHandler={updateState}
        />
        <ChemicalInput
          text={"calcium"}
          formValues={formValues}
          inputHandler={updateState}
        />
        <ChemicalInput
          text={"tablets"}
          formValues={formValues}
          inputHandler={updateState}
        />
        <div className="flex flex-row w-full justify-center mt-2 px-1">
          <TextArea value={formValues.notes} inputHandler={updateState} />
        </div>
        <div className="w-full flex flex-row gap-3 justify-center pt-4">
          <button
            className="btn btn-sm btn-error w-40"
            type="button"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button className="btn btn-sm btn-success w-40" type="submit">
            Save
          </button>
        </div>
      </Form>
    </div>
  );
}

function ChemicalInput({ text, formValues, inputHandler }) {
  // const text = text.toLowerCase();

  return (
    <div className="flex flex-row justify-center items-center py-1">
      <div className="flex flex-row justify-end w-3/12 lg:w-1/3 pe-4">
        <p className="font-medium">{text}</p>
      </div>
      <div className="flex flex-row gap-2 w-9/12 lg:w-2/3 justify-start">
        <input
          name={text}
          className="input input-sm w-4/12 lg:w-3/12 text-center"
          // Input needs to be "text" and not "number" because Safari allows
          // users to type any value into the "number" field even if it's not
          // valid. Then Safari wont pass this invalid value to me so I can
          // implement validation. So I use "text" in order to receive every
          // keystroke from the user and validate the input myself.
          type="text"
          inputMode="decimal"
          placeholder={formValues[text]?.test}
          onInput={(e) => {
            const value = e.target.value.trim();
            const name = e.target.name;
            if (validateInput({ value }))
              inputHandler({ name, value, action: "test" });
          }}
          onFocus={(e) => {
            const value = "";
            const name = e.target.name;
            inputHandler({ name, value, action: "test" });
          }}
        />
        <input
          name={text}
          className="input input-sm w-4/12 lg:w-3/12 text-center"
          // Input needs to be "text" and not "number" because Safari allows
          // users to type any value into the "number" field even if it's not
          // valid. Then, Safari wont pass this invalid value to me so I can
          // implement validation. So, I use "text" in order to receive every
          // keystroke from the user and validate the input myself.
          type="text"
          inputMode="decimal"
          step="0.01"
          placeholder={formValues[text]?.add?.quantity}
          onInput={(e) => {
            const value = e.target.value.trim();
            const name = e.target.name;
            if (validateInput({ value }))
              inputHandler({ name, value, action: "addQuantity" });
          }}
          onFocus={(e) => {
            inputHandler({
              name: e.target.name,
              value: "",
              action: "addQuantity",
            });
          }}
        />
        {text !== "tablets" && (
          <select
            className="input input-sm w-3/12 lg:w-3/12"
            name={text}
            value={formValues[text]?.add?.unit}
            onInput={(e) => {
              const name = e.target.name;
              const value = e.target.value;
              inputHandler({ name, value, action: "addUnit" });
            }}
          >
            <option disabled>Unit</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="qt">qt</option>
            <option value="gal">gal</option>
            <option value="cups">cups</option>
          </select>
        )}
      </div>
    </div>
  );
}

function TextArea({ value, inputHandler }) {
  // A textarea component that clears the value on the first onFocus event only.
  const [firstFocus, setFirstFocus] = useState(true);
  return (
    <textarea
      name="notes"
      className="textarea textarea-bordered w-full"
      placeholder={value || "Customer notes"}
      onInput={(e) =>
        inputHandler({
          name: e.target.name.toLowerCase(),
          value: e.target.value,
          action: "notes",
        })
      }
      onFocus={(e) => {
        if (firstFocus) {
          inputHandler({
            name: e.target.name,
            value: "",
            action: "notes",
          });
          setFirstFocus(false);
        }
      }}
    />
  );
}

function validateInput({ value }) {
  // Return true if value is a Number, Decimal, or an empty string.
  // Return false for any other character input.

  if (value.trim().length === 0) {
    // This is required to allow users to delete all text in the input.
    // Otherwise the user will not be allowed to clear the input to type a
    // different number.
    return true;
  }

  // True if the "value" has more than one decimal point.
  // False otherwise.
  const hasDoubleDecimal = value.indexOf(".") != value.lastIndexOf(".");

  // The current char that the user has entered.
  const currentKeyStroke = value.slice(-1); //Last char in string.
  // True if current key stroke is a Number or Decimal point.
  // False otherwise.
  const regex = /\d|\./; // Match Numbers and a Decimal point.
  const isNumberOrDecimal = regex.test(currentKeyStroke);

  // True if hasDoubleDecimal is false and isFloat is true.
  return !hasDoubleDecimal && isNumberOrDecimal;
}
