function SearchInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="glass w-full rounded-xl p-3"
      />
    </div>
  );
}

export default SearchInput;