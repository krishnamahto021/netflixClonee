import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Box from "@mui/material/Box";

import DetailModal from "src/components/DetailModal";
import VideoPortalContainer from "src/components/VideoPortalContainer";
import DetailModalProvider from "src/providers/DetailModalProvider";
import PortalProvider from "src/providers/PortalProvider";
import { MAIN_PATH } from "src/constant";
import { Footer, MainHeader } from "src/components/layouts";
import MainLoadingScreen from "src/components/MainLoadingScreen";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import MyListProvider
import { MyListProvider } from 'src/hooks/MyListContext';

export default function MainLayout() {
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <MainHeader />
      {navigation.state !== "idle" && <MainLoadingScreen />}

      {/* Wrap DetailModalProvider and PortalProvider with MyListProvider */}
      <MyListProvider>
        <DetailModalProvider>
          <DetailModal />
          <PortalProvider>
            <Outlet />
            <VideoPortalContainer />
            <ToastContainer />
          </PortalProvider>
        </DetailModalProvider>
      </MyListProvider>

      {location.pathname !== `/${MAIN_PATH.watch}` && <Footer />}
    </Box>
  );
}
