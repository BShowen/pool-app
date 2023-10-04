import { useQuery } from "@apollo/client";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs";
import { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { SpinnerOverlay } from "../../../../components/SpinnerOverlay";
import {
  GET_POOL_REPORTS_BY_CUSTOMER,
  GET_POOL_REPORT_PHOTO_URL,
} from "../../../../queries/index.js";
import { capitalize, formatDate } from "../../../../utils/formatters.js";

export function loader({ params }) {
  return params.customerId || "";
}
export function CustomerPoolReportsPage() {
  const customerAccountId = useLoaderData();
  const { toggleFullScreen, isFullScreen } = useOutletContext();
  const [poolReportModalState, setPoolReportModalState] = useState(false);
  const [poolReportModalData, setPoolReportModalData] = useState({});
  const [fullSizeImgSrc, setFullImageSrc] = useState(null);
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

  const poolReports = data?.getPoolReportsByCustomer || [];
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

  function poolReportModalCloseHandler() {
    setPoolReportModalState(false);
    setPoolReportModalData({});
  }
  function showFullImageHandler({ poolReportId, customerAccountId }) {
    setPoolReportModalState(false);
    setFullImageSrc({ poolReportId, customerAccountId });
  }
  function closeFullImageHandler() {
    setFullImageSrc(null);
    setPoolReportModalState(true);
  }

  return (
    <>
      <div className="w-full p-5">
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
                <tr
                  key={report.id}
                  className="hover:cursor-pointer hover"
                  onClick={(e) => {
                    e.preventDefault();
                    setPoolReportModalState(true);
                    setPoolReportModalData(report);
                  }}
                >
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
      <div
        className="hidden sm:landscape:hidden portrait:hidden md:block lg:landscape:block fixed bottom-10 right-10 z-50 p-3 rounded-full border-2 hover:cursor-pointer hover:bg-gray-100"
        onClick={toggleFullScreen}
      >
        {isFullScreen ? (
          <BsArrowsAngleContract className="text-3xl" />
        ) : (
          <BsArrowsAngleExpand className="text-3xl" />
        )}
      </div>
      {poolReportModalState && (
        <PoolReportModal
          poolReport={poolReportModalData}
          closeHandler={poolReportModalCloseHandler}
          tableHeaders={tableHeaders}
          showFullImageHandler={showFullImageHandler}
        />
      )}
      {fullSizeImgSrc && (
        <FullSizeImageModal
          {...fullSizeImgSrc}
          closeFullImageHandler={closeFullImageHandler}
        />
      )}
    </>
  );
}

function TableHeader({ value }) {
  return <th className="hidden md:table-cell">{value}</th>;
}

function TableData({ value }) {
  return <td className="hidden md:table-cell">{value}</td>;
}

/**
 * This is the modal window that renders when a user clicks on a pool report
 * from the pool reports page.
 */
function PoolReportModal({
  poolReport,
  closeHandler,
  tableHeaders,
  showFullImageHandler,
}) {
  useEffect(() => {
    function closeOnEscapeKeydown({ key }) {
      if (key.toLowerCase() === "escape") {
        closeHandler();
      }
    }
    // // When modal is mounted add an event listener to the DOM.
    document.addEventListener("keydown", closeOnEscapeKeydown);
    // When modal is mounted add an event listener to the DOM.
    return () => document.removeEventListener("keydown", closeOnEscapeKeydown);
  });

  const tableBody = tableHeaders.map((chemicalName, i) => {
    const chemicalTest = poolReport.chemicalLog?.[chemicalName]?.test
      ? Number.parseFloat(poolReport.chemicalLog[chemicalName].test).toFixed(1)
      : "";

    const chemicalAddValue = poolReport.chemicalLog?.[chemicalName]?.add
      ?.quantity
      ? Number.parseFloat(
          poolReport.chemicalLog[chemicalName].add.quantity
        ).toFixed(1)
      : "";

    const chemicalAddUnit =
      poolReport.chemicalLog?.[chemicalName]?.add?.unit || "";

    return (
      <tr key={i}>
        <th className="w-1/3 text-center">{capitalize(chemicalName)}</th>
        <td className="w-1/3 text-center">{chemicalTest}</td>
        <td className="w-1/3 text-center">
          {`${chemicalAddValue} ${chemicalAddUnit}`}
        </td>
      </tr>
    );
  });

  return (
    <dialog
      id="poolReportModal"
      className="modal modal-open modal-bottom sm:modal-middle"
      onClick={closeHandler}
    >
      <div
        className="modal-box h-5/6 p-1 flex flex-col items-stretch md:max-w-full md:h-3/4 md:w-4/5 md:max-h-full resize lg:w-4/5 xl:w-4/5 2xl:w-3/5"
        onClick={(e) => {
          // Prevent modal from closing when clicking inside the modal.
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="flex flex-row px-1 py-5 items-center ">
          <div className="grow text-center">
            <h3 className="font-bold text-lg">{formatDate(poolReport.date)}</h3>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost flex-none absolute right-4 text-xl"
            onClick={closeHandler}
          >
            <AiOutlineCloseCircle className="text-3xl" />
          </button>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th className="w-1/3 text-center">Chemical</th>
                <th className="w-1/3 text-center">Test</th>
                <th className="w-1/3 text-center">Add</th>
              </tr>
            </thead>
            <tbody>{tableBody}</tbody>
          </table>
          <hr className="m-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 py-5 pb-5 gap-2">
            <PoolReportPhoto
              poolReportId={poolReport.id}
              customerAccountId={poolReport.customerAccountId}
              showFullImageHandler={showFullImageHandler}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}

/**
 * This is the component for rendering the image inside the poolReportModal
 * component.
 */
function PoolReportPhoto({
  poolReportId,
  customerAccountId,
  showFullImageHandler,
}) {
  const { loading, data, error, refetch } = useQuery(
    GET_POOL_REPORT_PHOTO_URL,
    {
      //This will update the loading variable to true when calling refetch
      notifyOnNetworkStatusChange: true,
      variables: { poolReportId, customerAccountId },
    }
  );
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (data) {
      setImgUrl(data.getPoolReport.photo);
    }
  }, [data]);

  if (error) {
    console.log("Error loading photo: ", error.message);
    return (
      <div className="rounded-lg overflow-hidden shadow-md bg-slate-100">
        <div className="h-32 md:h-52 w-full flex flex-col justify-center items-center p-2 gap-3">
          <div className="w-full text-center">
            <h3>There was an error loading this photo.</h3>
          </div>
          <div className="flex flex-row justify-center items-center">
            <button className="btn btn-info btn-sm shadow-md" onClick={refetch}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      {loading && (
        <div className="h-32 md:h-52 w-full relative">
          <SpinnerOverlay />
        </div>
      )}
      {imgUrl && (
        <img
          className="h-32 md:h-52 w-full object-cover object-center hover:cursor-pointer"
          onClick={() => {
            showFullImageHandler({ poolReportId, customerAccountId });
          }}
          src={imgUrl}
          alt="Pool report photo."
        />
      )}
    </div>
  );
}

/**
 * This is the modal window that renders the full sized image.
 * Open a pool report, click on an image, that image is shown in a larger
 * standalone modal. This is that modal.
 */
function FullSizeImageModal({
  closeFullImageHandler,
  poolReportId,
  customerAccountId,
}) {
  const [src, setSrc] = useState("");
  const { loading, error, data, refetch } = useQuery(
    GET_POOL_REPORT_PHOTO_URL,
    {
      //This will update the loading variable to true when calling refetch
      notifyOnNetworkStatusChange: true,
      variables: { poolReportId, customerAccountId },
    }
  );

  useEffect(() => {
    function closeOnEscapeKeydown({ key }) {
      if (key.toLowerCase() === "escape") {
        closeFullImageHandler();
      }
    }
    // // When modal is mounted add an event listener to the DOM.
    document.addEventListener("keydown", closeOnEscapeKeydown);
    // When modal is mounted add an event listener to the DOM.
    return () => document.removeEventListener("keydown", closeOnEscapeKeydown);
  });

  useEffect(() => {
    if (data && !loading && !error) {
      setSrc(data.getPoolReport.photo);
    }
  }, [data]);

  function Error() {
    console.log("Error loading full sized photo: ", error.message);
    return (
      <div className="rounded-lg overflow-hidden shadow-md bg-slate-100 w-full h-full">
        <div className="w-full h-full flex flex-col justify-center items-center p-2 gap-3">
          <div className="w-full text-center">
            <h3>There was an error loading this photo.</h3>
          </div>
          <div className="flex flex-row justify-center items-center">
            <button className="btn btn-info btn-sm shadow-md" onClick={refetch}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <dialog
      id="fullSizeImageModal"
      className="modal modal-open modal-bottom sm:modal-middle"
      onClick={closeFullImageHandler}
    >
      <div
        className="modal-box h-5/6 p-0 flex flex-col items-stretch md:max-w-full md:h-3/4 md:w-4/5 md:max-h-full resize lg:w-4/5 xl:w-4/5 2xl:w-3/5 rounded-lg overflow-scroll"
        onClick={(e) => {
          // Prevent modal from closing when clicking inside the modal.
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {loading && <SpinnerOverlay />}
        {error && <Error />}
        <button
          className="btn btn-sm btn-circle btn-ghost flex-none absolute right-4 top-4 text-xl"
          onClick={closeFullImageHandler}
        >
          <AiOutlineCloseCircle className="text-3xl" />
        </button>
        <img src={src} alt="Pool report photo." />
      </div>
    </dialog>
  );
}