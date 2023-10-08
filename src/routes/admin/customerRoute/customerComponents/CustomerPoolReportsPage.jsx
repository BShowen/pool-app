import { useMutation, useQuery } from "@apollo/client";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs";
import { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CgMoreO, CgTrash } from "react-icons/cg";
import { MdOutlineModeEditOutline } from "react-icons/md";

import { SpinnerOverlay } from "../../../../components/SpinnerOverlay.jsx";
import {
  GET_POOL_REPORTS_BY_CUSTOMER,
  GET_POOL_REPORT_PHOTO_URL,
  REMOVE_PHOTO_FROM_AWS,
} from "../../../../queries/index.js";
import {
  capitalize,
  capitalizeName,
  formatDate,
} from "../../../../utils/formatters.js";

export function loader({ params }) {
  return params.customerId || "";
}
export function CustomerPoolReportsPage() {
  const customerAccountId = useLoaderData();
  const { toggleFullScreen, isFullScreen } = useOutletContext();
  const [showPoolReportModal, setShowPoolReportModal] = useState(false);
  const [poolReportModalData, setPoolReportModalData] = useState({});
  const [fullScreenImageData, setFullScreenImageData] = useState(null);
  const { loading, error, data } = useQuery(GET_POOL_REPORTS_BY_CUSTOMER, {
    variables: { customerAccountId },
  });

  useEffect(() => {
    // This useEffect will ensure that when a photo is deleted, it is properly
    // removed form the DOM. Without this useEffect, a photo that gets deleted
    // by the user will still persist in the DOM with an invalid src attribute
    // and the image.alt is shown - not good.

    // If poolReportModalData has a poolReport inside of it then verify that the
    // report is not stale. This ensures that PoolReportModal always has non-stale
    // data in the event of a child component triggering a refetchQuery.

    // If poolReportModalData is an empty object then theres nothing to do.
    if (Object.keys(poolReportModalData).length === 0) return;

    // Get the id from the potentially stale pool report.
    const poolReportModalId = poolReportModalData.id;
    // Find the matching pool report from data that was just received from the DB.
    const nonStalePoolReport = (data?.getPoolReportsByCustomer || []).find(
      (item) => item.id.toString() === poolReportModalId.toString()
    );
    // If old pool report img key is the same as new pool report img key then
    // the data in poolReportModalData is not stale.
    if (poolReportModalData.img.awsKey === nonStalePoolReport.img.awsKey) {
      return;
    }

    // If process reaches this state, then data in poolReportModalData is indeed
    // stale. Update the data with a new poolReport.
    setPoolReportModalData(nonStalePoolReport);
  }, [data]);

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
    setShowPoolReportModal(false);
    setPoolReportModalData({});
  }
  function showFullImageHandler({ poolReport }) {
    setShowPoolReportModal(false);
    setFullScreenImageData({ poolReport });
  }
  function closeFullImageHandler() {
    setFullScreenImageData(null);
    setShowPoolReportModal(true);
  }

  return (
    <>
      <div className="w-full p-5">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Technician</th>
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
                    setShowPoolReportModal(true);
                    setPoolReportModalData(report);
                  }}
                >
                  <td>{formatDate(report.date)}</td>
                  <td>
                    {capitalizeName(
                      report?.technician?.firstName,
                      report?.technician?.lastName
                    )}
                  </td>
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
      {showPoolReportModal && (
        <PoolReportModal
          poolReport={poolReportModalData}
          closeHandler={poolReportModalCloseHandler}
          tableHeaders={tableHeaders}
          showFullImageHandler={showFullImageHandler}
        />
      )}
      {fullScreenImageData && (
        <FullSizeImageModal
          poolReport={fullScreenImageData.poolReport}
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
        <th className="w-1/3 text-center text-xs font-semi-bold text-slate-400">
          {capitalize(chemicalName)}
        </th>
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
      className="modal modal-open modal-bottom sm:modal-middle backdrop-blur-sm"
      onClick={closeHandler}
    >
      <div
        className="modal-box h-5/6 p-1 pb-10 md:pb-1 flex flex-col items-stretch md:max-w-full md:h-fit md:max-h-screen md:w-10/12 lg:w-10/12 xl:w-4/5 2xl:w-7/12 bg-slate-100"
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
            <AiOutlineCloseCircle className="text-3xl text-error" />
          </button>
        </div>
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col gap-3 lg:flex-row justify-between pb-5">
            <ModalCard>
              <div className="text-start p-2 pt-0">
                <h2 className="text-lg font-bold">Chemical log</h2>
              </div>
              <div className="border-2 rounded-xl md:rounded-3xl w-full border-slate-100">
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
              </div>
            </ModalCard>

            <div className="w-full max-w-xl flex flex-col gap-3 mx-auto">
              <ModalCard>
                <PoolReportNotes
                  noteType="Customer notes"
                  noteValue={poolReport.customerNotes || "No customer notes."}
                />
              </ModalCard>
              <ModalCard>
                <PoolReportNotes
                  noteType="Technician notes"
                  noteValue={
                    poolReport.technicianNotes || "No technician notes."
                  }
                />
              </ModalCard>
            </div>
          </div>

          <PoolReportModalPhotosContainer>
            <div className="text-start w-full">
              <h2 className="text-lg font-bold">Photos</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* {reportHasImage && ( */}
              {!!poolReport.img.awsKey && (
                <PoolReportPhoto
                  poolReport={poolReport}
                  showFullImageHandler={showFullImageHandler}
                />
              )}
            </div>
          </PoolReportModalPhotosContainer>
        </div>
      </div>
    </dialog>
  );
}

function ModalCard(props) {
  return (
    <div className="w-full max-w-xl bg-white rounded-xl md:rounded-3xl p-3 shadow mx-auto">
      {props.children}
    </div>
  );
}

function PoolReportModalPhotosContainer(props) {
  return (
    <div className="w-full max-w-xl lg:max-w-7xl mx-auto bg-white rounded-xl md:rounded-3xl p-3 shadow">
      {props.children}
    </div>
  );
}

function PoolReportNotes({ noteType, noteValue }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{noteType}</h2>
      <div className="bg-slate-100 rounded-lg md:rounded-xl p-2">
        <p>{noteValue}</p>
      </div>
    </div>
  );
}

/**
 * This is the component for rendering the image inside the poolReportModal
 * component.
 */
function PoolReportPhoto({ poolReport, showFullImageHandler }) {
  const { data, error, refetch } = useQuery(GET_POOL_REPORT_PHOTO_URL, {
    //This will update the loading variable to true when calling refetch
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        awsKey: poolReport.img.awsKey,
        poolReportId: poolReport.id,
        customerAccountId: poolReport.customerAccountId,
      },
    },
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (data?.getPoolReportPhotoUrl) {
        const img = new Image(); //Image is used in order to pre-load the image.
        img.src = data.getPoolReportPhotoUrl;
        await img.decode(); //Preload and decode the image
        setImage(img);
        setLoading(false);
      }
    })();
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
            <button
              className="btn btn-info btn-sm shadow-md"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:cursor-pointer h-fit relative">
      {!loading && (
        <div className="min-h-[40px] p-3 dropdown dropdown-bottom dropdown-end absolute top-0 w-full flex flex-row items-center justify-end">
          <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
            <CgMoreO className="hover:cursor-pointer text-info text-2xl" />
          </label>
          <div className="dropdown-content z-[1] w-full flex flex-row justify-center px-2">
            <ul tabIndex={0} className="menu shadow bg-white rounded-lg w-full">
              <li>
                <DeleteImageButton poolReport={poolReport} />
              </li>
              <li>
                <a className="flex flex-row justify-start items-center">
                  <MdOutlineModeEditOutline className="text-xl" />
                  <h2 className="font-semibold">Replace</h2>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
      {loading && (
        <div className="h-32 md:h-52 w-full relative">
          <SpinnerOverlay />
        </div>
      )}
      {!loading && image && (
        <img
          className="object-contain object-center w-full h-full"
          onClick={() => {
            showFullImageHandler({ poolReport });
          }}
          src={image.src}
          alt="Pool report photo."
        />
      )}
    </div>
  );
}

function DeleteImageButton({ poolReport }) {
  // I want to manually handle the loading state for a slightly better UI.
  const [loading, setLoading] = useState(false);
  const [deleteImage, { error, data }] = useMutation(REMOVE_PHOTO_FROM_AWS, {
    refetchQueries: [
      {
        query: GET_POOL_REPORTS_BY_CUSTOMER,
        variables: { customerAccountId: poolReport.customerAccountId },
      },
    ],
    variables: {
      input: {
        awsKey: poolReport.img.awsKey,
        poolReportId: poolReport.id,
        customerAccountId: poolReport.customerAccountId,
      },
    },
  });

  useEffect(() => {
    if (data && Object.keys(data).length) {
      if (data.removePhotoFromAWS) {
        // Delete was successful
      } else {
        setLoading(false);
        // There was an error deleting the photo.
        console.log("There was an error deleting your photo.");
      }
    }
  }, [data]);

  if (error) {
    console.log(error);
  }

  return (
    <a
      className="flex flex-row justify-start items-center"
      onClick={async () => {
        try {
          setLoading(true);
          await deleteImage();
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <CgTrash className="text-error text-xl" />
      )}
      <h2 className="font-semibold">Delete</h2>
    </a>
  );
}

/**
 * This is the modal window that renders the full sized image.
 * Open a pool report, click on an image, that image is shown in a larger
 * standalone modal. This is that modal.
 */
function FullSizeImageModal({ closeFullImageHandler, poolReport }) {
  const [src, setSrc] = useState("");
  const { loading, error, data, refetch } = useQuery(
    GET_POOL_REPORT_PHOTO_URL,
    {
      //This will update the loading variable to true when calling refetch
      notifyOnNetworkStatusChange: true,
      variables: {
        input: {
          awsKey: poolReport.img.awsKey,
          poolReportId: poolReport.id,
          customerAccountId: poolReport.customerAccountId,
        },
      },
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
      setSrc(data.getPoolReportPhotoUrl);
    }
  }, [data]);

  function Error() {
    console.log("Error loading full sized photo: ", error.message);
    return (
      <div className="rounded-lg overflow-hidden shadow-md bg-slate-100 w-full h-full p-3">
        <div className="w-full h-full flex flex-col justify-center items-center p-2 gap-3">
          <div className="w-full text-center">
            <h3 className="font-semibold">
              There was an error loading this photo.
            </h3>
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <button
              className="btn btn-info btn-sm shadow-md"
              onClick={() => refetch()}
            >
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
      className="modal modal-open modal-bottom sm:modal-middle backdrop-blur-sm"
      onClick={closeFullImageHandler}
    >
      <div
        className="rounded-lg overflow-hidden relative h-screen portrait:h-fit my-auto mx-auto"
        onClick={(e) => {
          // Prevent modal from closing when clicking inside the modal.
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {loading && <SpinnerOverlay />}
        {error && <Error />}
        {!error && (
          <>
            <button
              className="btn btn-sm btn-circle btn-ghost flex-none absolute right-4 top-4 text-xl text-error"
              onClick={closeFullImageHandler}
            >
              <AiOutlineCloseCircle className="text-3xl" />
            </button>
            <img
              className="object-contain h-full w-full landscape:w-auto"
              src={src}
              alt="Pool report photo."
            />
          </>
        )}
      </div>
    </dialog>
  );
}
