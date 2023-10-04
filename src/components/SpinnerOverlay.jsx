import { useNavigation } from "react-router-dom";
import { Transition } from "@headlessui/react";

// The component that uses this component needs to have "position: relative" in
// order for this component to properly overlay. If not, then this component
// will "left:0, right:0, top:0, bottom:0" relative to the viewport and not the
// parent component.
// Alternatively, any component that uses this component can provide a wrapper
// with "position: relative" in order for this component to overlay properly.
export function SpinnerOverlay() {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/50">
      <Transition
        show={true}
        enter="transition-bg-opacity duration-150"
        enterFrom="bg-slate-500 bg-opacity-0"
        enterTo="bg-slate-500 bg-opacity-75"
        leave="transition-bg-opacity duration-500"
        leaveFrom="bg-opacity-100"
        leaveTo="bg-opacity-0"
        className="absolute left-0 top-0 right-0 bottom-0 flex flex-row justify-center items-center"
      >
        <div className="animate-spin text-7xl lg:text-5xl border-4 border-transparent border-t-primary border-b-primary w-28 h-28 rounded-full z-50"></div>
      </Transition>
    </div>
  );
}

// export default function Loading({ show }) {
//   const navigation = useNavigation();

//   return (
//     <Transition
//       show={show || navigation.state === "submitting"}
//       enter="transition-bg-opacity duration-150"
//       enterFrom="bg-slate-500 bg-opacity-0"
//       enterTo="bg-slate-500 bg-opacity-75"
//       leave="transition-bg-opacity duration-500"
//       leaveFrom="bg-opacity-100"
//       leaveTo="bg-opacity-0"
//       className="absolute left-0 top-0 right-0 lg:bottom-0 bottom-20 flex flex-row justify-center items-center"
//     >
//       <div className="animate-spin text-7xl lg:text-5xl border-4 border-transparent border-t-primary border-b-primary w-28 h-28 rounded-full"></div>
//     </Transition>
//   );
// }
