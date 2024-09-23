
import React, { useEffect, useState, useRef, forwardRef } from "react";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import { Box, Card, CardMedia } from '@mui/material';
import { useMyList } from "src/hooks/useMyList";

interface VideoItemWithHoverProps {
  video: Movie;
}

export default function VideoItemWithHover({ video }: VideoItemWithHoverProps) {
  const setPortal = usePortal();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { removeFromMyList } = useMyList();

  const { data: configuration } = useGetConfigurationQuery(undefined);

  useEffect(() => {
    if (isHovered && elementRef.current) {
      setPortal(elementRef.current, video);
    }
  }, [isHovered, video, setPortal, removeFromMyList]);

  return (
    <VideoItemWithHoverPure
      ref={elementRef}
      handleHover={setIsHovered}
      src={`${configuration?.images.base_url}w300${video.backdrop_path}`}
    />
  );
}

interface VideoItemWithHoverPureProps {
  handleHover: (isHovered: boolean) => void;
  src: string;
}

const VideoItemWithHoverPure = forwardRef<HTMLDivElement, VideoItemWithHoverPureProps>(
  ({ handleHover, src }, ref) => {
    return (
      <Box
        ref={ref}
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
        sx={{ position: 'relative', height: '100%', zIndex: 0 }}
      >
        <Card sx={{ height: '100%' }}>
          <CardMedia
            component="img"
            height="100%"
            image={src}
            alt="Video thumbnail"
          />
        </Card>
      </Box>
    );
  }
);

VideoItemWithHoverPure.displayName = 'VideoItemWithHoverPure';

export { VideoItemWithHoverPure };
