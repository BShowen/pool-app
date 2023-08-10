export function AccountOwnerInput({ values, onInput, errors }) {
  return (
    <div className="w-full rounded-lg px-2 py-3 bg-slate-100 my-2">
      <h1 className="text-center font-semibold text-lg">Contact information</h1>

      <label className="label">
        <span className={`label-text ${errors.firstName && "text-secondary"}`}>
          First name {errors.firstName && " - required"}
        </span>
      </label>
      <input
        type="text"
        placeholder="First name"
        name="firstName"
        className={`input input-bordered w-full focus:outline-none ${
          errors.firstName && "input-secondary"
        }`}
        value={values.firstName || ""}
        onInput={onInput}
        autoFocus
      />

      <label className="label">
        <span className={`label-text ${errors.lastName && "text-secondary"}`}>
          Last name {errors.lastName && "- required"}
        </span>
      </label>
      <input
        type="text"
        placeholder="Last name"
        name="lastName"
        className={`input input-bordered w-full focus:outline-none ${
          errors.lastName && "input-secondary"
        }`}
        value={values.lastName || ""}
        onInput={onInput}
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
        name="emailAddress"
        className={`input input-bordered w-full focus:outline-none ${
          errors.emailAddress && "input-secondary"
        }`}
        value={values.emailAddress || ""}
        onInput={onInput}
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
        name="phoneNumber"
        className={`input input-bordered w-full focus:outline-none ${
          errors.phoneNumber && "input-secondary"
        }`}
        value={values.phoneNumber || ""}
        onInput={onInput}
      />
    </div>
  );
}
