import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useMyList } from "../Helpers/hooks/useMyList";
import VideoItemWithHover from "../Cards/VideoItemWithHover";

const MyList = () => {
  const { myList } = useMyList();
  return (
    <Box sx={{ mt: 8, py: 6, ml: "3rem" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }} color="white">
        My List
      </Typography>
      {myList.length === 0 ? (
        <Typography color="white">
          Your list is empty. Add some movies or TV shows!
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {myList.map((item) => (
              <Grid item key={item.id} xs={6} sm={6} md={4} lg={2}>
                <VideoItemWithHover video={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MyList;
