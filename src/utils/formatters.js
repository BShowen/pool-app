export function formatAccountName(accountName) {
  if (accountName.includes("&")) {
    return accountName
      .split("&")
      .map(
        (name) => name.trim().split("")[0].toUpperCase() + name.trim().slice(1)
      )
      .join(" & ");
  } else {
    return accountName
      .split(" ")
      .map(
        (name) => name.trim().split("")[0].toUpperCase() + name.trim().slice(1)
      )
      .join(" ");
  }
}
export function capitalizeName(firstName, lastName) {
  return [firstName, lastName]
    .map((name) => {
      if (!name) return "";
      return name.trim().split("")[0].toUpperCase() + name.trim().slice(1);
    })
    .join(" ");
}

export function capitalize(string) {
  if (string.toLowerCase() === "ph") {
    return "pH";
  } else if (string) {
    return string.trim().split("")[0].toUpperCase() + string.trim().slice(1);
  } else {
    return "";
  }
}

export function formatDate(dateInMilliseconds) {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    weekday: "long",
  };
  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  return dateFormatter.format(dateInMilliseconds);
}
