import { forwardRef } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

const NetflixIconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, sx, ...others }, ref) => {
    return (
      <IconButton
        sx={{
          color: "white",
          width: 48, // You can adjust this value to control the button size
          height: 48, // Match height and width to make it a circle
          borderRadius: "50%", // This makes it circular
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: "grey.700",
          "&:hover, &:focus": {
            borderColor: "grey.200",
          },
          ...sx,
        }}
        {...others}
        ref={ref}
      >
        {children}
      </IconButton>
    );
  }
);

export default NetflixIconButton;
