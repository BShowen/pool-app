import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

export default function AnimatedToast({ message, onDismiss }) {
  const [state, setState] = useState(false);

  useEffect(() => {
    const remove = setTimeout(() => {
      setState(false);
      if (onDismiss) {
        // Call the provided callback 600ms after this component unmounts.
        // 600ms is needed because this component takes 500ms to transition off
        // the page.
        setTimeout(() => {
          onDismiss();
        }, 600);
      }
    }, 2500);

    const show = setTimeout(() => {
      setState(!!message);
    });

    return () => {
      clearTimeout(remove);
      clearTimeout(show);
    };
  }, []);

  return (
    <Transition
      show={state}
      enter="transition-translate-y duration-200"
      enterFrom="opacity-0 -translate-y-12"
      enterTo="opacity-100 translate-y-0"
      leave="transition-translate-y duration-500"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 -translate-y-12"
      className="fixed left-0 right-0 top-0 z-50"
    >
      <div className="flex flex-row">
        <div className="alert w-full rounded-none alert-warning shadow-md flex flew-row justify-center">
          <h1 className="font-medium text-lg">{message}</h1>
        </div>
      </div>
    </Transition>
  );
}
