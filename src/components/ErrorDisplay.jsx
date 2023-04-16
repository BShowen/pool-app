export default function ErrorDisplay({ message }) {
  return (
    <div className="w-full h-full pt-36 gap-3 flex flex-col justify-start items-center">
      <p className="text-xl">
        <span className="font-semibold">Oops!</span> Something went wrong.
      </p>
      <p className="text-xl">{message}</p>
    </div>
  );
}
