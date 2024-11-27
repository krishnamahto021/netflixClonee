import React, { useState, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { useOutsideClick } from "../Helpers/hooks/useOutsideClick"; // Import the custom hook

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
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
  width: "0px",
  transition: theme.transitions.create("width"),
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

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(false); // Track if input is expanded
  const searchInputRef = useRef<HTMLInputElement>(null); // Explicitly typed as HTMLInputElement
  const navigate = useNavigate();
  const searchBoxRef = useRef<HTMLDivElement>(null); // Ref for the entire search box

  const handleSearch = useCallback(() => {
    if (searchTerm) {
      handleSearchNavigate(searchTerm);
    }
  }, [searchTerm]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    searchInputRef.current?.focus(); // Now TypeScript knows it's an HTMLInputElement
  }, []);

  const handleSearchNavigate = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const toggleExpand = useCallback(() => {
    setExpanded(true); // Expand the input field when clicking the search icon
    searchInputRef.current?.focus(); // Now TypeScript knows it's an HTMLInputElement
  }, []);

  const collapseInput = useCallback(() => {
    setExpanded(false);
  }, []);

  // Use the custom hook to collapse the input on outside click
  useOutsideClick(searchBoxRef, collapseInput);

  return (
    <Search ref={searchBoxRef}>
      <SearchIconWrapper onClick={toggleExpand}>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        value={searchTerm}
        onChange={handleSearchChange}
        inputRef={searchInputRef} // Assign the ref here
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchTerm) {
            handleSearch();
          }
        }}
        style={{
          width: expanded ? "200px" : "0px",
          paddingLeft: expanded ? "8px" : "0px",
        }} // Conditional styling for width
      />
      {searchTerm && (
        <ClearIconWrapper onClick={handleClearSearch}>
          <ClearIcon />
        </ClearIconWrapper>
      )}
    </Search>
  );
}
