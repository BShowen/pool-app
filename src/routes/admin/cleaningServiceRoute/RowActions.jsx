import { FiEdit3, FiDelete } from "react-icons/fi";
import { useMutation } from "@apollo/client";

import { DELETE_SERVICE, GET_SERVICE_LIST } from "../../../queries/index.js";

export function RowActions({ serviceId }) {
  return (
    <td className="flex flex-row justify-center items-center md:justify-end gap-8 h-full">
      <EditButton serviceId={serviceId} />
      <DeleteButton serviceId={serviceId} />
    </td>
  );
}

function EditButton({ serviceId }) {
  return (
    <FiEdit3 className="text-xl lg:text-2xl text-gray-800 hover:text-blue-500 hover:cursor-pointer" />
  );
}

function DeleteButton({ serviceId }) {
  const [deleteService, { loading, error, data }] = useMutation(
    DELETE_SERVICE,
    { refetchQueries: [{ query: GET_SERVICE_LIST }] }
  );

  if (loading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <FiDelete
      className="text-xl lg:text-2xl text-gray-800 hover:text-pink-600 hover:cursor-pointer"
      onClick={async () => {
        await deleteService({ variables: { serviceId } });
      }}
    />
  );
}
