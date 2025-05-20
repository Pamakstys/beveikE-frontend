import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Stack,
    Paper,
    Button,
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BookRecommendation {
    title: string;
    score: number;
}

const BookBuyRecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/BookBuyRecommendation/get-recommendations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch book recommendations");
                }
                return response.json();
            })
            .then((data: BookRecommendation[]) => {
                setRecommendations(data);
                setLoading(false);
            })
            .catch((error: Error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box p={4} display="flex" justifyContent="center">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={4}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>
                Recommended Books 📚
            </Typography>
            {recommendations.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    Nėra rekomenduojamų knygų
                </Typography>
            ) : (
                <Stack spacing={2}>

                    {recommendations.map(({ title, score }, index) => (
                        <Paper key={`${title}-${index}`} sx={{ p: 2 }} elevation={3}>
                            <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6" fontWeight="bold">
                                {title}
                            </Typography>
                            <Typography>Rekomenduojamas kiekis: {score}</Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                >
                                    Pridėti į krepšelį
                                </Button>
                            </Stack>
                            
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default BookBuyRecommendationsPage;
