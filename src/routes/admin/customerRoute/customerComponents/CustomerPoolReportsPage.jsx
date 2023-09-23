import { useQuery } from "@apollo/client";
import { useLoaderData } from "react-router-dom";

import { SpinnerOverlay } from "../../../../components/SpinnerOverlay";
import { GET_POOL_REPORTS_BY_CUSTOMER } from "../../../../queries/index.js";
import { formatDate } from "../../../../utils/formatters.js";

export function loader({ params }) {
  return params.customerId || "";
}
export function CustomerPoolReportsPage() {
  const customerAccountId = useLoaderData();
  const { loading, error, data } = useQuery(GET_POOL_REPORTS_BY_CUSTOMER, {
    variables: { customerAccountId },
  });

  if (loading) {
    return (
      <div className="w-full h-40 relative">
        <SpinnerOverlay />
      </div>
    );
  }

  if (error) {
    throw new Error(error.message);
  }

  const { getPoolReportsByCustomer: poolReports } = data;

  // tableHeaders = ["chlorine", "ph", "alkalinity", ... etc ]
  const tableHeaders = Object.values(
    poolReports
      .map((poolReport) => {
        return Object.keys(poolReport?.chemicalLog || {}).filter((key) => {
          if (
            key === "__typename" ||
            key === "id" ||
            key === "notes" ||
            key === "customerAccountId" ||
            key === "date"
          ) {
            return false;
          } else {
            return true;
          }
        });
      })
      .reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {})
  );

  return (
    <div className="w-full pt-5">
      <div className="p-2">
        <span className="badge badge-primary p-3">
          {poolReports.length} reports
        </span>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Date</th>
            {tableHeaders.map((headerValue, i) => {
              return <TableHeader value={headerValue} key={i} />;
            })}
          </tr>
        </thead>
        <tbody>
          {poolReports.map((report) => {
            return (
              <tr key={report.id} className="hover:cursor-pointer hover">
                <td>{formatDate(report.date)}</td>
                {tableHeaders.map((headerValue, i) => {
                  return (
                    <TableData
                      key={i}
                      value={report.chemicalLog?.[headerValue]?.test}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ value }) {
  return <th className="hidden md:table-cell">{value}</th>;
}

function TableData({ value }) {
  return <td className="hidden md:table-cell">{value}</td>;
}
