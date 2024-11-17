import Select from "react-select";

const SearchableSelect = ({
  options,
  placeholder,
  getOptionLabel,
  getOptionValue,
  onChange,
}: {
  options: unknown[];
  placeholder: string;
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
