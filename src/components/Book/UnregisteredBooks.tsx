import { useEffect, useState } from "react";
import {Box, Heading, Spinner, Text, Stack, Button} from "@chakra-ui/react";
import { useNavigate } from "react-router";

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
  statusas: string;
}

const Book = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusMap: Record<number, string> = {
    1: "laisva",
    2: "užsakyta",
    3: "grąžinta",
    4: "neužregistruota",
    5: "užregistruota"
  };
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/books/find-unregistered-books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 4 })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data: Book[]) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  

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
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading mb={4}>Book List 📚</Heading>
      <Stack>
        {books.map((book) => (
          <Box key={book.id} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">{book.pavadinimas}</Text>
            <Text>Author: {book.autorius}</Text>
            <Text>Rating: {book.reitingas}</Text>
            <Text>Price: €{book.kaina.toFixed(2)}</Text>
            <Text>Dimensions: {book.ilgis} x {book.plotis} x {book.aukstis} cm</Text>
            <Text>Status ID: {statusMap[Number(book.statusas)]}</Text>
            <Button mt={2} colorScheme="blue" bg={"green"} color={"white"} onClick={() => navigate(`/unregistered-books/register?id=${book.id}&type=book`)}>
              Register Book
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Book;
