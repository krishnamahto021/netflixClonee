import { Outlet, useLocation, useNavigation } from "react-router-dom"
import Box from "@mui/material/Box"

import DetailModal from "src/components/Models/DetailModal"
import VideoPortalContainer from "src/components/Models/VideoPortalContainer"
import DetailModalProvider from "src/components/Helpers/providers/DetailModalProvider"
import PortalProvider from "src/components/Helpers/providers/PortalProvider"
import { MAIN_PATH } from "../components/constant/index"
import { Footer, MainHeader } from "src/components/Layout"
import MainLoadingScreen from "src/components/MainLoadingScreen"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Import MyListProvider
import { MyListProvider } from "../components/Helpers/hooks/MyListContext"

const MainLayout = () => {
  const location = useLocation()
  const navigation = useNavigation()

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
  )
}

export default MainLayout
