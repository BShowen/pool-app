import { useState } from "react";
export default function useSorter(itemList) {
  const [state, setState] = useState(itemList || []);

  function sort(options = { category, order }) {
    const { category, order = 1 } = options;

    switch (category) {
      case "serviceDay":
        const dayOrder = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];
        setState((prevState) => {
          const sortedState = [...prevState];
          return sortedState.sort((a, b) => {
            const aIndex = dayOrder.indexOf(a.serviceDay.toLowerCase());
            const bIndex = dayOrder.indexOf(b.serviceDay.toLowerCase());
            if (order == 1) {
              return aIndex - bIndex;
            } else {
              return bIndex - aIndex;
            }
          });
        });
        break;
      default:
        setState((prevState) => {
          const sortedState = [...prevState];
          return sortedState.sort((a, b) => {
            const aIndex = a[category].charCodeAt(0);
            const bIndex = b[category].charCodeAt(0);
            if (order == 1) {
              return aIndex - bIndex;
            } else {
              return bIndex - aIndex;
            }
          });
        });
        break;
    }
  }
  return [state, sort];
}
