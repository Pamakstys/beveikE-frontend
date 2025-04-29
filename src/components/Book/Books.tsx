import { useState, useEffect } from "react";
import { Box, Heading, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import DeleteModal from "./DeleteModal";

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

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(false);



  const statusMap: Record<number, string> = {
    1: "laisva",
    2: "užsakyta",
    3: "grąžinta",
    4: "neužregistruota",
    5: "užregistruota"
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/books/find-books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: 1 })
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
  }, [refresh]);

  const handleDeleteClick = (bookId: number) => {
    setBookToDelete(bookId);
    setIsDeleteModalOpen(true)
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      console.log(`Deleting book with ID: ${bookToDelete}`);
      fetch(`${API_BASE_URL}/books/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookToDelete }),
      });
    }
    setIsDeleteModalOpen(false);
    setBookToDelete(null);
    setRefresh(prev => !prev);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

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
            <Text>Status: {statusMap[Number(book.statusas)]}</Text>
            <Button mt={2} colorScheme="red" bg={"red"} color={"white"} onClick={() => handleDeleteClick(book.id)}>
              Delete
            </Button>
            <Button mt={2} bg={"blue"} color={"white"} colorScheme="blue" onClick={() => navigate(`/books/edit?id=${book.id}`)}>
              Edit
            </Button>
            <Button mt={2} bg={"green"} color={"white"} colorScheme="blue" onClick={() => navigate(`/books/view?id=${book.id}`)}>
              View
            </Button>
          </Box>
        ))}
      </Stack>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default Books;
