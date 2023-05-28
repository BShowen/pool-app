/**
 * A module for persisting data between renders. This is used only for sending
 * messages between components when I can't use useNavigate.
 *
 * Items in local storage are stored in Base64 so the average user cant tamper
 * with them.
 */

/**
 * Save a key/value pair in local storage. However, convert the pair to base64
 * before saving.
 */
function save(key, value) {
  const encodedKey = btoa(key);
  const values = get(key) || [];
  values.push(value);
  const encodedValues = btoa(JSON.stringify(values));
  window.localStorage.setItem(encodedKey, encodedValues);
}

/**
 * Get the item from local storage and convert it from base654 to binary.
 */
function get() {
  const location = window.location.pathname;
  const encodedKey = btoa(location);
  for (const [key, value] of Object.entries(window.localStorage)) {
    if (key === encodedKey) {
      return JSON.parse(atob(value));
    }
  }
  return [];
}

/**
 * Clear the local storage for the specific location.
 */
function clear() {
  const location = window.location.pathname;
  const encodedKey = btoa(location);
  window.localStorage.removeItem(encodedKey);
}

export default {
  save,
  get,
  clear,
};
