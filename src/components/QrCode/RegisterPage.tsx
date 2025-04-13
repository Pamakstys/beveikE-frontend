import { useLocation, useNavigate } from "react-router";
import { Box, Image, Text, Heading, Button, Stack } from "@chakra-ui/react";
import { useState, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "unknown";

  const qrData = JSON.stringify({ id: id, type: type });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  const printContainerRef = useRef<HTMLDivElement>(null);
  const information = useRef<HTMLDivElement>(null);

  const handlePrintQr = () => {
    if (!printContainerRef.current) return;
    if(!information.current) return;

    information.current.style.display = "none";

    window.print();
    setShowConfirmation(true);
  };

  const handleConfirmation = (printed: boolean) => {
    if (printed) {
      console.log(JSON.stringify({ id: id}));
      fetch(`${API_BASE_URL}/books/register-book/`, {
        method: "POST",
        
        body: JSON.stringify({ id: id}),
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          
          setIsRegistered(true);
          navigate('/unregistered-books')
        })
        .catch(() => {
          setIsRegistered(false);
        });
    }

    setShowConfirmation(false); 
  };

  const renderPrintPage = () => (
    <Box p={6}>
      <div ref={information}>  
        <Heading size="lg" mb={4}>
          Register {type.charAt(0).toUpperCase() + type.slice(1)} QR
        </Heading>
        <Text mb={2}>ID: {id}</Text>
        <Text mb={4}>Type: {type}</Text>
        <Button mt={4} colorScheme="blue" marginBottom={"50px"} onClick={handlePrintQr} bg={"blue.500"} color="white" _hover={{ bg: "blue.600" }}>
          Print QR Code
        </Button>
      </div>
      <Image src={qrUrl} alt="QR Code" />
      <div style={{ display: "none" }}>
        <div ref={printContainerRef}>
          
        </div>
      </div>
    </Box>
  );

  const renderConfirmationDialog = () => (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        Ar QR kodas buvo atspausdintas?
      </Heading>
      <Stack direction="row">
        <Button bg={"green"} color={"white"} onClick={() => handleConfirmation(true)}>
          Yes
        </Button>
        <Button bg={"red"} color={"white"}  onClick={() => handleConfirmation(false)}>
          No
        </Button>
      </Stack>
    </Box>
  );

  const renderRegistrationStatus = () => (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        Registration Status
      </Heading>
      <Text>
        {isRegistered ? "QR Code successfully registered!" : "Failed to register QR Code."}
      </Text>
    </Box>
  );

  let content;
  if (isRegistered === null && !showConfirmation) {
    content = renderPrintPage();
  } else if (showConfirmation) {
    content = renderConfirmationDialog(); 
  } else {
    content = renderRegistrationStatus();
  }

  return content;
};

export default RegisterPage;
