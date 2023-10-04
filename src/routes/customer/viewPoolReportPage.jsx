import { useQuery } from "@apollo/client";
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiCheckMark } from "react-icons/Gi";

import { GET_POOL_REPORT } from "../../../../queries/index.js";
import { SpinnerOverlay } from "../../../../components/SpinnerOverlay.jsx";
import { omitTypename } from "../../../../utils/removeTypenameLink.js";
import { capitalize } from "../../../../utils/formatters.js";
export function CustomerPoolReportPage() {
  const { customerId, poolReportId } = useLoaderData();
  const [poolReport, setPoolReport] = useState({});
  const [chemicalReadings, setChemicalReadings] = useState([]);
  const [workLogItems, setWorkLogItems] = useState([]);
  const { loading, error, data } = useQuery(GET_POOL_REPORT, {
    variables: {
      customerAccountId: customerId,
      poolReportId,
    },
  });

  useEffect(() => {
    if (data) {
      const report = omitTypename(data.getPoolReport);
      setPoolReport(report);
      setChemicalReadings(getChemicalReadings(report.chemicalLog));
      setWorkLogItems(report.workLog.workLogItems);
    }
  }, [data]);

  if (error) {
    throw error;
  }

  function getChemicalReadings(chemicalLog) {
    const readings = [];
    for (const [key, value] of Object.entries(chemicalLog)) {
      if (typeof value === "object" && value !== null) {
        readings.push([key, value]);
      }
    }
    return readings;
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-start items-center">
      {loading && <SpinnerOverlay />}
      <div className="flex flex-col justify-start items-center bg-slate-100 p-2 pb-0 w-full">
        <table className="table">
          <thead>
            <tr>
              <td className="w-2/4 text-end text-lg">Chemical</td>
              <td className="w-2/4 text-start text-lg">Reading</td>
            </tr>
          </thead>
          <tbody>
            {chemicalReadings.map((reading, i) => {
              const thValue = capitalize(reading[0]);
              const td = isNaN(Number.parseFloat(reading[1].test).toFixed(1))
                ? {
                    className:
                      "w-2/4 text-start text-md font-medium text-slate-500",
                    value: "Not tested",
                  }
                : {
                    className: "w-2/4 text-start text-md font-medium",
                    value: `${Number.parseFloat(reading[1].test).toFixed(
                      1
                    )} ppm`,
                  };
              return (
                <tr key={i}>
                  <th className="w-2/4 text-end text-md font-medium">
                    {thValue}
                  </th>
                  <td className={td.className}>{td.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <DiamondTab bgColor="bg-slate-100" />
      </div>
      <div className="flex flex-col justify-start items-center bg-blue-300 p-2 pt-5 w-full text-white">
        <ul className="list-none w-full">
          {workLogItems.map((workItem, i) => {
            const label = capitalize(workItem.name);
            return (
              <li key={i} className="p-1 w-full">
                <div className="flex flex-row flex-nowrap justify-start gap-2">
                  <div className="w-2/3 text-end">
                    <p className="font-semibold">{label}</p>
                  </div>
                  <div className="w-1/3">
                    <GiCheckMark className="text-lg text-slate-700" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function DiamondTab({ bgColor }) {
  return (
    <div className="w-full flex flex-row justify-center relative">
      <div className={`w-8 h-8 ${bgColor} rotate-45 absolute -top-5`}></div>
    </div>
  );
}
