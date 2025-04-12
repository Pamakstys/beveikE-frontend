import { Flex, Box } from "@chakra-ui/react";
import NavigationBar from "../NavigationBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex direction="column" minHeight="100vh" bg={"white"} color={"black"}>
      <Box as="header">
        <NavigationBar />
      </Box>

      <Box as="main" flex="1" padding={4}>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
