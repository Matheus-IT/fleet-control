import Select from "react-select";

const SearchableSelect = ({
  options,
  placeholder,
  className,
  getOptionLabel,
  getOptionValue,
  onChange,
}: {
  options: unknown[];
  placeholder: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOptionLabel: (o: any) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOptionValue: (o: any) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (o: any) => void;
}) => {
  return (
    <div>
      <Select
        className={className}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "var(--nextui-radius-small)",
          }),
        }}
        options={options}
        placeholder={placeholder}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchableSelect;
