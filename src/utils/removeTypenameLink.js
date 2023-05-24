import { ApolloLink } from "@apollo/client";

export const removeTypenameLink = new ApolloLink((operation, forward) => {
  operation.variables = sanitizeVars(operation.variables);
  return forward(operation);
});

function sanitizeVars(variables) {
  if (variables) {
    return omitTypename(variables);
  }
  return variables;
}

function omitTypename(obj) {
  if (Array.isArray(obj)) {
    return obj.map(omitTypename);
  } else if (obj !== null && typeof obj === "object") {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      if (key !== "__typename") {
        newObj[key] = omitTypename(obj[key]);
      }
    });
    return newObj;
  }
  return obj;
}
