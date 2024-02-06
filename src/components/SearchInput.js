import React from "react";
import { useForm } from "react-hook-form";
import { FormProvider, FTextField } from "../components/form";
import { IconButton, InputAdornment } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import SearchIcon from "@mui/icons-material/Search";

const searchSchema = Yup.object().shape({
  name: Yup.string().required("Name must be filled"),
});

const defaultValues = {
  name: "",
};

function SearchInput({ controlSubmit }) {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(searchSchema),
  });
  const { handleSubmit, reset } = methods;

  const onSubmit = (data) => {
    console.log(data);
    controlSubmit(data.name);
    reset();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <FTextField
        name="name"
        placeholder="Search by name"
        size="small"
        sx={{ width: 300 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="submit"
                sx={{ color: "primary.main" }}
                aria-label="search by name"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </FormProvider>
  );
}

export default SearchInput;
