import Select from "react-select";

const SearchableSelect = ({
  value,
  options,
  placeholder,
  className,
  isDisabled,
  styles = {},
  getOptionLabel,
  getOptionValue,
  onChange,
}: {
  value?: object;
  options: unknown[];
  placeholder: string;
  className?: string;
  isDisabled: boolean;
  styles?: object;
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
        value={value}
        className={className}
        isDisabled={isDisabled}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "var(--nextui-radius-small)",
            ...styles,
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            zIndex: 9999,
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
