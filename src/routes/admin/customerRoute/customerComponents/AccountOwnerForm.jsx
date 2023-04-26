export default function AccountOwnerForm({
  changeHandler,
  values,
  index,
  errors,
  removeHandler,
  shouldFocus,
}) {
  return (
    <div className="w-full rounded-lg px-2 py-3 bg-slate-100">
      <h1 className="text-center font-semibold text-lg">Contact information</h1>

      <label className="label">
        <span className={`label-text ${errors.firstName && "text-secondary"}`}>
          First name {errors.firstName && " - required"}
        </span>
      </label>
      <input
        type="text"
        placeholder="First name"
        data-index={index}
        name="firstName"
        className={`input input-bordered w-full focus:outline-none ${
          errors.firstName && "input-secondary"
        }`}
        value={values.firstName || ""}
        onInput={changeHandler}
        autoFocus={shouldFocus}
      />

      <label className="label">
        <span className={`label-text ${errors.lastName && "text-secondary"}`}>
          Last name {errors.lastName && "- required"}
        </span>
      </label>
      <input
        type="text"
        placeholder="Last name"
        data-index={index}
        name="lastName"
        className={`input input-bordered w-full focus:outline-none ${
          errors.lastName && "input-secondary"
        }`}
        value={values.lastName || ""}
        onInput={changeHandler}
      />

      <label className="label">
        <span
          className={`label-text ${errors.emailAddress && "text-secondary"}`}
        >
          Email address {errors.emailAddress && " - required"}
        </span>
      </label>
      <input
        type="email"
        placeholder="Email address"
        data-index={index}
        name="emailAddress"
        className={`input input-bordered w-full focus:outline-none ${
          errors.emailAddress && "input-secondary"
        }`}
        value={values.emailAddress || ""}
        onInput={changeHandler}
      />

      <label className="label">
        <span
          className={`label-text ${errors.phoneNumber && "text-secondary"}`}
        >
          Phone number {errors.phoneNumber && " - required"}
        </span>
      </label>
      <input
        type="text"
        placeholder="Phone number"
        data-index={index}
        name="phoneNumber"
        className={`input input-bordered w-full focus:outline-none ${
          errors.phoneNumber && "input-secondary"
        }`}
        value={values.phoneNumber || ""}
        onInput={changeHandler}
      />

      <div
        className={`pt-3 flex justify-end relative ${
          index > 0 ? "" : "hidden"
        }`}
      >
        <button
          type="button"
          className=" w-full btn btn-error btn-sm"
          onClick={index > 0 ? removeHandler : null}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
