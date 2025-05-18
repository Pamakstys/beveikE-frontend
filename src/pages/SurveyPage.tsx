import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Klausimas {
  id_Klausimas: number;
  tekstas: string;
}

const SurveyPage = () => {
  const [klausimai, setKlausimai] = useState<Klausimas[]>([]);
  const [atsakymai, setAtsakymai] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/surveys/questions`) // <- tau reikės backend'o endpoint'o, kuris gražina visus klausimus apklausai
      .then(res => res.json())
      .then((data: Klausimas[]) => {
        setKlausimai(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (id: number, value: string) => {
    setAtsakymai((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("id");
    if (!userId) return alert("Prisijunkite prieš dalyvaudami apklausoje.");

    const payload = {
      userId: Number(userId),
      answers: Object.entries(atsakymai).map(([klausimasId, tekstas]) => ({
        klausimasId: Number(klausimasId),
        tekstas
      })),
    };

    const res = await fetch(`${API_BASE_URL}/surveys/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } else {
      alert("Įvyko klaida pateikiant atsakymus.");
    }
  };

  if (loading) return (
    <Box p={4}><CircularProgress /></Box>
  );

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4}>Apklausa 📋</Typography>
      <Stack spacing={3}>
        {klausimai.map((klausimas) => (
          <TextField
            key={klausimas.id_Klausimas}
            label={klausimas.tekstas}
            value={atsakymai[klausimas.id_Klausimas] || ""}
            onChange={(e) => handleChange(klausimas.id_Klausimas, e.target.value)}
            fullWidth
          />
        ))}
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Pateikti atsakymus
        </Button>
      </Stack>

      <Snackbar open={success} autoHideDuration={2000}>
        <Alert severity="success">Atsakymai išsaugoti! Grįžtate į pradžią...</Alert>
      </Snackbar>
    </Box>
  );
};

export default SurveyPage;
