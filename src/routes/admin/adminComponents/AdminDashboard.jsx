import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Form } from "react-router-dom";

import {
  CREATE_CHEMICAL_LOG,
  GET_SERVICE_ROUTE_TODAY,
  GET_SERVICE_LIST,
  CREATE_POOL_REPORT,
} from "../../../queries/index.js";
import { capitalize, formatAccountName } from "../../../utils/formatters.js";
import { SpinnerOverlay } from "../../../components/SpinnerOverlay.jsx";

export function AdminDashboard() {
  const { loading, error, data } = useQuery(GET_SERVICE_ROUTE_TODAY, {
    fetchPolicy: "network-only",
  });

  // Get the list of services that can be performed.
  // These are toggles that populate the pool report form.
  const {
    loading: serviceLoading,
    error: serviceError,
    data: serviceData,
  } = useQuery(GET_SERVICE_LIST);

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
                serviceList={serviceData?.getAllServices}
                // hideAccount={() => {
                //   // When the pool report form is submitted, remove that
                //   // customer from the state so they are removed from the UI.
                //   setServiceRoute((prevState) => {
                //     return {
                //       ...prevState,
                //       customerAccounts: prevState.customerAccounts.filter(
                //         (acc) => acc.id !== account.id
                //       ),
                //       count: prevState.count - 1,
                //     };
                //   });
                // }}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CustomerRow({ account, index, serviceList }) {
  const [showChemicalLog, setShowChemicalLog] = useState(false);
  const [showPoolReportForm, setShowPoolReportForm] = useState(false);

  const chemicalLogValues =
    account?.latestChemicalLog || account?.latestPoolReport?.chemicalLog || {};

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

            // If the user is clicking on the chemicalLog - Don't collapse the <tr>
            // If the poolReportForm is expanded - Don't collapse the <tr>
            if (
              !!e.target.closest(".expanded-chemical-log") ||
              showPoolReportForm
            ) {
              return;
            } else {
              setShowChemicalLog((prevState) => !prevState);
            }

            // if (
            //   !e.target.closest(".expanded-chemical-log") &&
            //   !showPoolReportForm
            // ) {
            //   setShowChemicalLog((prevState) => !prevState);
            // }
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
              If the latest chemical log has todays date AND the chemicalLog and poolReport are NOT showing. 
                Show the "Send pool report button" 
              else 
                Show the reminder icons
            */}
            {isDateToday(account?.latestChemicalLog?.date) &&
            !showChemicalLog &&
            !showPoolReportForm ? (
              <div className="w-full md:w-auto order-last md:order-none">
                <button
                  className="btn btn-accent btn-xs w-full"
                  onClick={(e) => {
                    e.stopPropagation(); //Prevent the row from expanding.
                    e.preventDefault(); //Prevent any default behavior.
                    setShowPoolReportForm(true);
                  }}
                >
                  Send pool report
                </button>
              </div>
            ) : (
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
          {showChemicalLog && (
            <ChemicalLog
              cancelHandler={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                setShowChemicalLog(false);
              }}
              customerAccountId={account.id}
              prevValues={chemicalLogValues}
            />
          )}
          {showPoolReportForm && (
            <PoolReportForm
              cancelHandler={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                setShowPoolReportForm(false);
              }}
              serviceList={serviceList}
              latestValues={
                account?.latestPoolReport?.workLog?.workLogItems || []
              }
              account={account}
            />
          )}
        </td>
      </tr>
    </>
  );
}

function ChemicalLog({ cancelHandler, customerAccountId, prevValues }) {
  const [createChemicalLog, { loading, error, data }] = useMutation(
    CREATE_CHEMICAL_LOG,
    { refetchQueries: [{ query: GET_SERVICE_ROUTE_TODAY }] }
  );

  const [formValues, setFormValues] = useState(getFormValues(prevValues));

  useEffect(() => {
    // if not loading and not error and there is data, then the pool report form
    // has been successfully submitted and we need to collapse the form.
    if (!loading && !error && data) {
      cancelHandler(); // Collapse the form on successful submission.
    }
  }, [data]);

  function getFormValues(values) {
    // This function is used to set the initial state of the chemicalLog form.
    // It returns the convertNullToString() if that function returns a non-empty
    // object. If that function returns an empty object then a formatted object
    // is returned instead.
    // This is because if an empty object is used as the initial form state then
    // the ChemicalLog form is initially rendered as an uncontrolled component,
    // but when the user fills in the form it turns into a controlled component
    // and react displays an error message in the console.
    const formValues = convertNullToString(values);

    if (Object.keys(formValues).length === 0) {
      return {
        chlorine: { test: "", add: { unit: "lb", quantity: "" } },
        pH: { test: "", add: { unit: "cups", quantity: "" } },
        alkalinity: { test: "", add: { unit: "lb", quantity: "" } },
        stabilizer: { test: "", add: { unit: "lb", quantity: "" } },
        calcium: { test: "", add: { unit: "lb", quantity: "" } },
        tablets: { test: "", add: { quantity: "" } },
        salt: { test: "", add: { unit: "lb", quantity: "" } },
        // notes: "",
      };
    } else {
      return formValues;
    }
  }

  function updateState({ name, value, action }) {
    switch (action) {
      case "addQuantity":
        setFormValues((prevState) => {
          return {
            ...prevState,
            [name]: {
              ...prevState[name],
              add: { ...(prevState[name]?.add || {}), quantity: value },
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
              add: { ...(prevState[name]?.add || {}), unit: value },
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
      // case "notes":
      //   setFormValues((prevState) => {
      //     return {
      //       ...prevState,
      //       [name]: value,
      //     };
      //   });
      //   break;
    }
  }

  function convertNullToString(obj) {
    // If the obj is false, null, or undefined, return an empty object.
    if (!obj) return {};

    // obj is the object received from the backend. Create and return a copy of
    // the obj with "__typename", "customerAccountId", "id", "date" removed, and
    // null values replaced by empty strings

    // Create a new object to hold the filtered data
    const filteredObject = {};

    // Loop through the keys in the original object
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && typeof value === "object") {
        filteredObject[key] = convertNullToString(value);
      } else if (
        key !== "__typename" &&
        key !== "id" &&
        key !== "customerAccountId" &&
        key !== "date"
      ) {
        // Copy the key and its value to the filtered object
        filteredObject[key] = obj[key]?.toString() || "";
      }
    }

    // Return the filtered object
    return filteredObject;
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
    <div className="w-full px-0 mt-2 expanded-chemical-log flex flex-row justify-center">
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
        {/* <div className="flex flex-row w-full justify-center mt-2 px-1">
          <TextArea value={formValues.notes} inputHandler={updateState} />
        </div> */}
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
          value={formValues[text]?.test}
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
          value={formValues[text]?.add?.quantity}
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

function PoolReportForm({ cancelHandler, serviceList, latestValues, account }) {
  // formValues is an object where each key is a service name and the value is a
  // boolean indicating whether or not that service was performed.

  // serviceList is an array of ALL services that this company offers.
  // latestValues is an array of services performed during the last visit. These
  // are the values from the previous poolReport.

  // I combined both of these lists into a single object where the key is the
  // serviceName and the value is a boolean. Any key/value pairs from the
  // latestValues will be set to true. All other key/value pairs will be set to
  // false;
  const [formValues, setFormValues] = useState({
    ...serviceList.reduce((acc, curr) => {
      return { ...acc, [curr.name]: false };
    }, {}),
    ...latestValues.reduce((acc, curr) => {
      return { ...acc, [curr.name]: true };
    }, {}),
  });

  const [createPoolReport, { loading, error, data }] = useMutation(
    CREATE_POOL_REPORT,
    { refetchQueries: [{ query: GET_SERVICE_ROUTE_TODAY }] }
  );

  useEffect(() => {
    // When the pool report is successfully submitted, call the cancelHandler
    // in order to collapse the pool report form.
    // if not loading, and not error and there is data
    if (!loading && !error && data) {
      cancelHandler();
    }
  }, [data]);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="w-full px-0 mt-2 expanded-pool-report flex flex-row justify-center">
      <Form
        method="post"
        encType="multipart/form-data"
        className="w-full lg:w-2/4 flex flex-col bg-slate-100 rounded-md relative pt-1 pb-4 px-1"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const photo = formValues.photo;
            delete formValues.photo;
            const variables = {
              input: {
                chemicalLog: account.latestChemicalLog.id,
                customerAccountId: account.id,
                photo: photo,
                workLog: {
                  workLogItems: [
                    ...Object.entries(formValues)
                      .filter((workItem) => workItem[1])
                      .reduce((acc, curr) => {
                        return [...acc, { name: curr[0] }];
                      }, []),
                  ],
                },
              },
            };
            await createPoolReport({ variables });
          } catch (error) {
            console.log("Error ", { error });
          }
        }}
      >
        {loading && <SpinnerOverlay />}
        <div className="flex flex-col gap-2 justify-start items-stretch">
          {serviceList.map((service) => (
            <PoolReportInputToggle
              service={service}
              key={service.id}
              defaultState={formValues[service.name]}
              handleChange={(serviceName) => {
                setFormValues((prevState) => {
                  return {
                    ...prevState,
                    [serviceName]: prevState[serviceName]
                      ? !prevState[serviceName]
                      : true,
                  };
                });
              }}
            />
          ))}

          <input
            type="file"
            className="file-input file-input-sm file-input-bordered file-input-info"
            name="photo"
            accept="image/*"
            // multiple
            onChange={(e) => {
              const file = e.target.files[0];
              const valid = file.type.startsWith("image/");
              if (valid) {
                setFormValues((prevValues) => {
                  return { ...prevValues, photo: e.target.files[0] };
                });
              } else {
                // No need to show an error if the uploaded filetype is incorrect
                // because this means the form has been intentionally compromised.
                // Normal users will only be able to select images which will
                // never trigger an invalid filetype error
                e.target.value = "";
              }
            }}
          />
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

function PoolReportInputToggle({ service, defaultState, handleChange }) {
  return (
    <div className="form-control bg-white rounded-lg">
      <label className="cursor-pointer label">
        <span className="label-text font-medium">
          {capitalize(service.name)}
        </span>
        <input
          type="checkbox"
          className="toggle toggle-primary toggle-md"
          checked={defaultState}
          onChange={() => {
            handleChange(service.name);
          }}
        />
      </label>
    </div>
  );
}
