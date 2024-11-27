import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { MouseEventHandler, ReactNode } from "react";

// Styled component for the arrow navigation
const ArrowStyle = styled(Box)(({ theme }) => ({
  top: 0,
  bottom: 0,
  position: "absolute",
  zIndex: 9,
  height: "100%",
  opacity: 0.48,
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
  transition: theme.transitions.create("opacity"),
  "&:hover": {
    opacity: 0.8,
    background: theme.palette.grey[900],
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

// Interface for props
interface CustomNavigationProps {
  isEnd: boolean;
  arrowWidth: number;
  children: ReactNode;
  activeSlideIndex: number;
  onNext: MouseEventHandler<HTMLDivElement>;
  onPrevious: MouseEventHandler<HTMLDivElement>;
}

// Functional component using arrow functions
const CustomNavigation: React.FC<CustomNavigationProps> = ({
  isEnd,
  onNext,
  children,
  onPrevious,
  arrowWidth,
  activeSlideIndex,
}) => {
  return (
    <>
      {activeSlideIndex > 0 && (
        <ArrowStyle
          onClick={onPrevious}
          sx={{
            left: 0,
            width: { xs: arrowWidth / 2, sm: arrowWidth },
            borderTopRightRadius: { xs: "4px" },
            borderBottomRightRadius: { xs: "4px" },
          }}
        >
          <ArrowBackIosNewIcon />
        </ArrowStyle>
      )}

      {children}

      {!isEnd && (
        <ArrowStyle
          onClick={onNext}
          sx={{
            right: 0,
            width: { xs: arrowWidth / 2, sm: arrowWidth },
            borderTopLeftRadius: { xs: "4px" },
            borderBottomLeftRadius: { xs: "4px" },
          }}
        >
          <ArrowForwardIosIcon />
        </ArrowStyle>
      )}
    </>
  );
};

export default CustomNavigation;