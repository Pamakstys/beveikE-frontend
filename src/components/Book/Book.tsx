import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Stack,
  Button,
} from "@chakra-ui/react";

interface Book {
  id: number;
  pavadinimas: string;
  autorius: string;
  reitingas: number;
  kaina: number;
  likutis: number;
  ilgis: number;
  aukstis: number;
  plotis: number;
  statusas: string;
}

const Book = () => {
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
    fetch("http://localhost:5000/api/books/get-books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 4 }) // example: fetch only "neužregistruota"
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
            <Text>In stock: {book.likutis} pcs</Text>
            <Text>Dimensions: {book.ilgis} x {book.plotis} x {book.aukstis} cm</Text>
            <Text>Status ID: {book.statusas}</Text>
            <Button mt={2} colorScheme="blue">
              Edit
            </Button>
            <Button mt={2} colorScheme="blue">
              Delete
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Book;
