import Select from "react-select";

const SearchableSelect = ({ options, placeholder }) => {
  return (
    <div>
      <Select
        options={options}
        placeholder={placeholder}
        getOptionLabel={(option) => `${option.name} - ${option.type}`}
        getOptionValue={(option) => option.id}
      />
    </div>
  );
};

export default SearchableSelect;
