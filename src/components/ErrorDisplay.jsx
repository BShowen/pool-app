import { useRouteError } from "react-router-dom";
export default function ErrorDisplay({ message }) {
  const routeError = useRouteError();
  const errorMessage =
    message ||
    routeError?.message ||
    "Something went wrong. Please go back and try again.";
  return (
    <div className="w-full h-full pt-36 gap-3 flex flex-col justify-start items-center">
      <p className="text-xl">
        <span className="font-semibold">Oops!</span> Something went wrong.
      </p>
      <p className="text-xl">{errorMessage}</p>
    </div>
  );
}
