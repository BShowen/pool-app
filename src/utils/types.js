/**
 * This is a temporary solution.
 * I am defining my backend model types here, in the front end, for my forms
 * to use. This way model fields wont be forgotten or mistyped.
 * I will look into implementing a front end graphQL schema that is loaded
 * from the backend. For now, this works.
 */

const accountOwnerType = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  phoneNumber: "",
};

export { accountOwnerType };
