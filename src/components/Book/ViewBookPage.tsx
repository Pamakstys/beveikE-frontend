import { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text, Stack, Button } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Book {
  id: number;
  pavadinimas: string;
  autorius: string;
  reitingas: number;
  kaina: number;
  ilgis: number;
  aukstis: number;
  plotis: number;
  statusas: number;
}

const ViewBookPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusMap: Record<number, string> = {
    1: "laisva",
    2: "užsakyta",
    3: "grąžinta",
    4: "neužregistruota",
    5: "užregistruota",
  };

  useEffect(() => {
    if (!id) {
      setError("No book ID provided.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/books/get-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Number(id) }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch book");
        }
        return res.json();
      })
      .then((data: Book) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box p={4}>
        <Spinner color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">{error}</Text>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box p={4}>
        <Text>Book not found.</Text>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={4}>{book.pavadinimas}</Heading>
      <Stack>
        <Text><strong>Author:</strong> {book.autorius}</Text>
        <Text><strong>Rating:</strong> {book.reitingas}</Text>
        <Text><strong>Price:</strong> €{book.kaina.toFixed(2)}</Text>
        <Text><strong>Dimensions:</strong> {book.ilgis} x {book.plotis} x {book.aukstis} cm</Text>
        <Text><strong>Status:</strong> {statusMap[book.statusas]}</Text>
      </Stack>
      <Button mt={6} colorScheme="blue" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Box>
  );
};

export default ViewBookPage;
