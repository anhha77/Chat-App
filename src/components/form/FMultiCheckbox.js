import { useFormContext, Controller } from "react-hook-form";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";

function FMultiCheckbox({ name, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option) =>
          field.value.includes(option)
            ? field.value.filter((value) => value !== option)
            : [...field.value, option];

        return (
          <FormGroup
            sx={{ flexGrow: 1, flexDirection: { xs: "column", md: "row" } }}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={field.value.includes(option)}
                    onChange={() => field.onChange(onSelected(option))}
                  />
                }
                label={option}
                {...other}
                sx={{ flexBasis: { xs: "auto", md: "250px" } }}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
}

export default FMultiCheckbox;
