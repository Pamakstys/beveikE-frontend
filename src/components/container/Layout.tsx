import { Flex, Box } from "@chakra-ui/react";
import NavigationBar from "../NavigationBar";
import { Outlet } from "react-router";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout = ({ children }: LayoutProps) => {
const Layout = () => {
  return (
    <Flex direction="column" minHeight="100vh" bg={"white"} color={"black"}>
      <Box as="header">
        <NavigationBar />
      </Box>

      <Box as="main" flex="1" padding={4}>
        {/* {children} */}
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;
