import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
  import { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Book {
  id_Knyga: number;
  pavadinimas: string;
  autorius: string;
  reitingas: number;
  kaina: number;
  ilgis: number;
  aukštis: number;
  plotis: number;
  statusas: number;
}

const statusOptions = [
  { value: 1, label: "Laisva" },
  { value: 2, label: "Užsakyta" },
  { value: 3, label: "Grąžinta" },
  { value: 4, label: "Neužregistruota" },
  { value: 5, label: "Užregistruota" },
];

const EditBookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/books/find-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Knyga nerasta");
        }
        return res.json();
      })
      .then((data) => setBook(data))
      .catch((err) => setError(err.message));
  }, [id]);



  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<number>
  ) => {
    const name = e.target.name!;
    let value: any = e.target.value;

    // For SelectChangeEvent, value might come as string, so parse it for numeric fields
    if (name === "statusas" || name === "reitingas" || name === "kaina") {
      value = Number(value);
    }

    if (name === "reitingas") {
      if (value > 5) value = 5;
      if (value < 0) value = 0;
    }

    setBook((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = () => {
    if (!book) return;
    const payload = {
      id: book.id_Knyga,
      reitingas: book.reitingas,
      kaina: book.kaina,
      statusas: book.statusas,
    };

    fetch(`${API_BASE_URL}/books/edit-book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Įvyko klaida");
        }
        navigate("/books");
      })
      .catch((err) => setError(err.message));
  };

  if (!book) return <Typography p={2}>Įkeliama...</Typography>;

  return (
    <Box maxWidth={600} mx="auto" p={2}>
      <Typography variant="h4" mb={3}>
        Redaguoti knygą
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {["pavadinimas", "autorius", "ilgis", "aukštis", "plotis"].map(
        (field) => (
          <TextField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(book as any)[field]}
            fullWidth
            margin="normal"
            disabled
            InputProps={{ sx: { bgcolor: "#f5f5f5" } }}
          />
        )
      )}

      <TextField
        label="Reitingas"
        name="reitingas"
        type="number"
        value={book.reitingas}
        onChange={handleChange}
        inputProps={{ step: 0.1, min: 0, max: 5 }}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Kaina"
        name="kaina"
        type="number"
        value={book.kaina}
        onChange={handleChange}
        inputProps={{ step: 0.01, min: 0 }}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Statusas</InputLabel>
        <Select<number>
          label="Statusas"
          name="statusas"
          value={book.statusas}
          onChange={handleChange}
        >
          {statusOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Išsaugoti
      </Button>
    </Box>
  );
};

export default EditBookPage;
