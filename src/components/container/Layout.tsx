import { Box, Container } from "@mui/material";
import NavigationBar from "../NavigationBar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(-90deg, rgba(0, 98, 255, 1) 0%, rgba(255, 255, 255, 1) 80%)",
        color: "black",
      }}
    >
      <Box component="header">
        <NavigationBar />
      </Box>

      <Box component="main" flex="1">
        <Container maxWidth="lg" disableGutters>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
