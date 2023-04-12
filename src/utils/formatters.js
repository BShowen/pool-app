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
      return name.trim().split("")[0].toUpperCase() + name.trim().slice(1);
    })
    .join(" ");
}
