import { Transition } from "@headlessui/react";

export default function AnimatedToast({ message, show }) {
  return (
    <Transition
      show={show}
      enter="transition-top delay-500 duration-500"
      enterFrom="-top-28"
      enterTo="top-0"
      leave="transition-top duration-500"
      leaveFrom="top-0"
      leaveTo="-top-28"
      className="absolute toast toast-top right-0 left-0 lg:left-80"
    >
      <div className="flex flex-row justify-center">
        <div className="alert w-96 alert-warning shadow-lg">
          <div className="flex flew-row justify-center w-full">
            <h1 className="font-medium text-lg">{message}</h1>
          </div>
        </div>
      </div>
    </Transition>
  );
}
