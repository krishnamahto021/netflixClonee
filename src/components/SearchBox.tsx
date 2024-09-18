import React, { useState, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
  border: "1px solid white",
  backgroundColor: "black",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: theme.spacing(0, 1),
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ClearIconWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: theme.spacing(0, 1),
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    width: "100%",
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

interface SearchBoxProps {
  onSearchNavigate: (searchTerm: string) => void;
}

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    handleSearchNavigate(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  console.log("value", searchTerm)

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  }, []);

  const handleSearchNavigate = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
};


  return (
    <Search>
      <SearchIconWrapper onClick={handleSearch}>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        inputRef={searchInputRef}
        placeholder="Search movies"
        inputProps={{
          "aria-label": "search",
        }}
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyPress={(e) => {
          if (e.key === "Enter" && searchTerm) {
            handleSearch();
          }
        }}
      />
      {searchTerm && (
        <ClearIconWrapper onClick={handleClearSearch}>
          <ClearIcon />
        </ClearIconWrapper>
      )}
    </Search>
  );
}
