import Button, { ButtonProps } from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

interface PlayButtonProps extends ButtonProps {
  videoId?: string;
  videoTitle?: string;
}

export default function PlayButton({ sx, videoId, videoTitle, ...others }: PlayButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (videoId) {
      navigate("/watch", {
        state: {
          videoId,
          videoTitle,
        },
      });
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<PlayArrowIcon />}
      {...others}
      sx={{
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        fontSize: { xs: 18, sm: 24, md: 28 },
        lineHeight: 1.5,
        fontWeight: "bold",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
        ...sx,
      }}
      onClick={handleClick}
    >
      Play
    </Button>
  );
}