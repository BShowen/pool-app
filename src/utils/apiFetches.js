export async function getLoginToken(formData = {}) {
  const url = "http://192.168.1.2:8080/companies/login";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(url, options);
  return response.json();
}

export async function getCustomers() {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = "http://192.168.1.2:8080/companies/customer-accounts/all";
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

export async function getCustomer({ customerId }) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken || !customerId) return;
  const url = `http://192.168.1.2:8080/companies/customer-accounts/${customerId}`;
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

export async function createNewAccount(data) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = "http://192.168.1.2:8080/companies/customer-accounts/new";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url, options);
  return { response: await response.json(), status: response.status };
}

export async function updateCustomer(data) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url =
    "http://192.168.1.2:8080/companies/customer-accounts/updateAccount";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url, options);
  return { response: await response.json(), status: response.status };
}

export async function deleteCustomer(data) {
  const apiToken = window.localStorage.getItem("apiToken");
  if (!apiToken) return;
  const url = "http://192.168.1.2:8080/companies/customer-accounts/delete";
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
  const url = "http://192.168.1.2:8080/companies/technicians/all";
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
