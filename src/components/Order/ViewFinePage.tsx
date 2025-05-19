import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";

// Stripe public key
const stripePromise = loadStripe("pk_test_51QUr1r02BwwXS4AeCFcJnIIR4DKmlvigeTP1eX1qAK0sxf6IIvZb7rpqURWd9cv3WkOo7u7qFlBvQO8MaUVv6lxS00Fde5svDc");

const ViewFinePage = () => {
    const [stripe, setStripe] = useState<import('@stripe/stripe-js').Stripe | null>(null);
    const [card, setCard] = useState<import('@stripe/stripe-js').StripeCardElement | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const cardElementRef = useRef<HTMLDivElement | null>(null);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchFineAmount = async () => {
            try {
                const userId = localStorage.getItem("id");
                if (!userId) throw new Error("Vartotojo ID nerastas.");

                const res = await fetch(`${apiUrl}/fine/unpaid-total`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userid: userId }),
                });
                if (!res.ok) throw new Error("Nepavyko gauti baudų sumos.");

                const data = await res.json();
                console.log("Fetched data:", data);
                console.log("data.total type:", typeof data.total);
                if (typeof data !== "number") {
                    setAmount(0);
                }
                else {
                    setAmount(data);
                }
            } catch (err: any) {
                setError(err.message || "Klaida gaunant duomenis.");
            } finally {
                setLoading(false);
            }
        };

        fetchFineAmount();
    }, [apiUrl]);

    // Separate effect to initialize Stripe only after the DOM element is rendered
    useEffect(() => {
        const initializeStripe = async () => {
            const stripeInstance = await stripePromise;
            if (!stripeInstance || !cardElementRef.current) return;

            const elements = stripeInstance.elements();
            const cardElement = elements.create("card");
            cardElement.mount(cardElementRef.current);
            setCard(cardElement);
            setStripe(stripeInstance);
        };

        initializeStripe();

        return () => {
            if (card) card.unmount();
        };
    }, [cardElementRef]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !card) {
            alert("Stripe nėra paruoštas");
            return;
        }

        try {
            const userId = localStorage.getItem("id");
            const res = await fetch(`${apiUrl}/fine/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: userId, Amount: amount * 100 }), // cents
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Nepavyko pradėti mokėjimo");

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: { card: card },
            });

            if (result.error) {
                alert(result.error.message);
            } else if (result.paymentIntent?.status === "succeeded") {
                alert("Baudos sėkmingai apmokėtos!");
                setAmount(0); // reset after payment
            }
        } catch (err: any) {
            alert(err.message || "Klaida vykdant mokėjimą");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Apmokėti baudą
            </Typography>

            <Typography variant="h6" gutterBottom>
                Bendra nesumokėtų baudų suma: <strong>{amount} €</strong>
            </Typography>

            <Box
                sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    padding: 2,
                    mt: 3,
                    backgroundColor: "#fafafa",
                    boxShadow: 1,
                    maxWidth: 400,
                }}
            >
                <div ref={cardElementRef} className="stripe-card" style={{ minHeight: "40px" }} />
            </Box>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", pt: 5 }}>
                <Button type="submit" variant="contained" color="primary" disabled={amount <= 0}>
                    Apmokėti
                </Button>
                <Typography variant="body2">
                    Mokėjimo duomenis prižiūri mūsų partneris Stripe.
                </Typography>
            </Box>
        </Box>
    );
};

export default ViewFinePage;
