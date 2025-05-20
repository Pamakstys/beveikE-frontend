import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router";

const NavigationBar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isLoggedIn = Boolean(localStorage.getItem("id"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background:
          "linear-gradient(90deg, rgb(53, 50, 98) 0%, rgb(201, 201, 246) 35%, rgb(251, 241, 241) 100%)",
        color: "white",
        padding: "10px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" component="h1" sx={{ color: "white" }}>
            BeveikE
          </Typography>
        </Box>
        <Box>
          {isLoggedIn ? (
            <>
              {/* Main Page always shown */}
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  mr: 2,
                  borderColor: "teal",
                  color: "teal",
                  "&:hover": {
                    backgroundColor: "pink",
                    color: "white",
                    borderColor: "pink",
                  },
                }}
                onClick={() => navigate("/")}
              >
                Main Page
              </Button>

              {/* Books */}
              {(role === "client" || role === "worker" || role === "admin") && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    mr: 2,
                    borderColor: "teal",
                    color: "teal",
                    "&:hover": {
                      backgroundColor: "pink",
                      color: "white",
                      borderColor: "pink",
                    },
                  }}
                  onClick={() => navigate("/books")}
                >
                  Books
                </Button>
              )}

              {/* Susimokėti baudą */}
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  mr: 2,
                  borderColor: "teal",
                  color: "teal",
                  "&:hover": {
                    backgroundColor: "pink",
                    color: "white",
                    borderColor: "pink",
                  },
                }}
                onClick={() => navigate("/fine")}
              >
                Pay fine
              </Button>

              {/* Survey */}
              {role === "client" && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    mr: 2,
                    borderColor: "teal",
                    color: "teal",
                    "&:hover": {
                      backgroundColor: "pink",
                      color: "white",
                      borderColor: "pink",
                    },
                  }}
                  onClick={() => navigate("/survey")}
                >
                  Participate in the survey
                </Button>
              )}

              {/* Favourites */}
              {role === "client" && (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      mr: 2,
                      borderColor: "teal",
                      color: "teal",
                      "&:hover": {
                        backgroundColor: "pink",
                        color: "white",
                        borderColor: "pink",
                      },
                    }}
                    onClick={() => navigate("/favourites")}
                  >
                    Favourite Books
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      mr: 2,
                      borderColor: "teal",
                      color: "teal",
                      "&:hover": {
                        backgroundColor: "pink",
                        color: "white",
                        borderColor: "pink",
                      },
                    }}
                    onClick={() => navigate("/orders")}
                  >
                    Orders
                  </Button>
                </>
              )}
              {/* Unregistered Books */}
              {(role === "worker" || role === "admin") && (
                <>
                  <Button
                    style={{ marginRight: "10px" }}
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderColor: "teal",
                      color: "teal",
                      "&:hover": {
                        backgroundColor: "pink",
                        color: "white",
                        borderColor: "pink",
                      },
                    }}
                    onClick={() => navigate("/unregistered-books")}
                  >
                    Unregistered Books
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderColor: "teal",
                      color: "teal",
                      "&:hover": {
                        backgroundColor: "pink",
                        color: "white",
                        borderColor: "pink",
                      },
                    }}
                    onClick={() => navigate("/add-to-bookcase")}
                  >
                    Add Book to Bookcase
                  </Button>
                </>
              )}
              {(role === "worker" || role === "admin") && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    mr: 2,
                    borderColor: "teal",
                    color: "teal",
                    "&:hover": {
                      backgroundColor: "pink",
                      color: "white",
                      borderColor: "pink",
                    },
                  }}
                  onClick={() => navigate("/returned-books")}
                >
                  Returned Books
                </Button>
              )}

              {/* Admin Panel */}
              {role === "admin" && (
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    ml: 2,
                    borderColor: "teal",
                    color: "teal",
                    "&:hover": {
                      backgroundColor: "pink",
                      color: "white",
                      borderColor: "pink",
                    },
                  }}
                  onClick={() => navigate("/BookBuyRecommendationsPage")}
                >
                  Buy books
                </Button>
              )}

              {/* Logout */}
              <Button
                variant="outlined"
                color="error"
                sx={{ ml: 2, borderColor: "red", color: "red" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              sx={{
                borderColor: "teal",
                color: "teal",
                "&:hover": {
                  backgroundColor: "pink",
                  color: "white",
                  borderColor: "pink",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
