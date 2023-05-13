import { useState, useLayoutEffect } from "react";
export default function useSorter(itemList) {
  const [state, setState] = useState(itemList || []);

  // This is used to remember if the list is sorted or not between re-renders.
  const [sorted, setSorted] = useState({ sorted: false, category: undefined });

  useLayoutEffect(() => {
    setState(itemList);

    // Re-sort the list if the list was previously sorted.
    // This gets triggered when the component re-renders.
    if (sorted.sorted) {
      sort({ category: sorted.category, order: sorted.order || 1 });
    }
  }, [itemList]);

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
  return [
    state,
    function (options = { category, order }) {
      setSorted({
        sorted: true,
        category: options.category,
        order: options.order || 1,
      });
      sort(options);
    },
  ];
}
