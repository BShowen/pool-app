const localHost = "http://192.168.1.74:8080";

// Credit to Dmitri Pavlutin for this method.
// https://dmitripavlutin.com/timeout-fetch-request/
async function fetchWithTimeout(url, options = {}) {
  const { timeout = 5000 } = options;
  delete options.timeout;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

async function apiRequest({ url, options }) {
  try {
    const response = await fetchWithTimeout(url, options);
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // If the headers contains content-length and content-type is application/json
    // the parse the body.
    // Else don't parse the body but still return {status, data,errors}

    const json = contentType && contentLength ? await response.json() : null;

    return {
      status: response.status,
      data: json?.data,
      errors: json?.errors,
    };
  } catch (error) {
    // Abort error means the request timed out.
    // Return a message signifying the request timed out.
    // Rethrow any other type of error for the route error element to catch.
    if (error.name === "AbortError") {
      return {
        status: 503, // 503 - service unavailable
        data: undefined,
        errors: { message: "Request timed out. Please try again." },
      };
    } else {
      throw error;
    }
  }
}

// Simulate a slow network.
function delayedResponse(opts = {}) {
  const { delay = 5000, url, options } = opts;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(apiRequest({ url, options }));
    }, delay);
  });
}

export async function getLoginToken(formData = {}) {
  const url = `${localHost}/companies/login`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };

  return apiRequest({ url, options });
}

export async function getCustomers() {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/customer-accounts/all`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
  };

  // Simulate a slow network.
  // return delayedResponse({ delay: 500, url, options });
  return apiRequest({ url, options });
}

export async function getCustomer({ customerId }) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken || !customerId) return;
  const url = `${localHost}/companies/customer-accounts/${customerId}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
  };
  return apiRequest({ url, options });
}

export async function createNewAccount(data) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/customer-accounts/new`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify(data),
  };

  return apiRequest({ url, options });
}

export async function updateCustomer(data) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/customer-accounts/updateAccount`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify(data),
  };
  return apiRequest({ url, options });
}

export async function deleteCustomer(data) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/customer-accounts/delete`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url, options);
  if (response.status == "204") {
    return { response, errors: null };
  } else {
    console.log("errors");
    const json = await response.json();
    return { response, errors: json.errors };
  }
}

export async function getTechnicians() {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/technicians/all`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
  };
  return apiRequest({ url, options });
}

export async function getTechnician({ technicianId }) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/technicians/${technicianId}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
  };
  const response = await fetch(url, options);
  return response.json();
}

export async function createNewTechnician(data) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/technicians/new`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify(data),
  };

  const response = await apiRequest({ url, options });
  return response;
}

export async function updateTechnician(data) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/technicians/update`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify(data),
  };
  return apiRequest({ url, options });
}

export async function getRegistrationTechnician({
  technicianId,
  registrationSecret,
}) {
  const url = `${localHost}/companies/technicians/get-technician-for-registration`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ technicianId, registrationSecret }),
  };
  const response = await apiRequest({ url, options });
  return response;
}

export async function registerTechnician({
  firstName,
  lastName,
  password,
  technicianId,
  registrationSecret,
}) {
  const url = `${localHost}/companies/technicians/confirm-technician-registration`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      technicianId,
      registrationSecret,
      firstName,
      lastName,
      password,
    }),
  };
  const response = await apiRequest({ url, options });
  return response;
}

export async function deleteTechnician({ technicianId }) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = `${localHost}/companies/technicians/delete`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify({ technicianId }),
  };
  const response = await fetch(url, options);
  if (response.status == "204") {
    return { response, errors: null };
  } else {
    console.log("errors");
    const json = await response.json();
    return { response, errors: json.errors };
  }
}
