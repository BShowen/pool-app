import { CgSpinner } from "react-icons/cg";
export default function Loading() {
  return (
    <div className="h-100 w-full flex flex-col justify-center items-center p-10">
      <CgSpinner className="animate-spin text-5xl" />
    </div>
  );
}
