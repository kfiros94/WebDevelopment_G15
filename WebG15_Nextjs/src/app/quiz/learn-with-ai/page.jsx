"use client";
import Chatbot from "../../../components/Chatbot";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

// MUI Icons
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const LearnWithAI = () => {
  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: (theme) => 
        theme.palette.mode === 'light' 
          ? 'linear-gradient(to bottom right, #f0f4ff, #e0e7ff)' 
          : 'linear-gradient(to bottom right, #0a1929, #172554)'
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        width: "100%", 
        bgcolor: "primary.main", 
        color: "primary.contrastText",
        py: 8,
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom display="flex" alignItems="center">
                Learn Hebrew with AI <AutoAwesomeIcon sx={{ ml: 1 }} />
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              Chat with our AI assistant to practice Hebrew, learn new vocabulary, and receive instant feedback on your language skills
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box 
                component="img"
                src="/chatbot.png" 
                alt="Learn Hebrew Illustration" 
                sx={{
                  borderRadius: 2,
                  boxShadow: 5,
                  maxWidth: "80%",
                  width: "350px",
                  height: "auto"
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Chatbot Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Box sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: 3, 
          boxShadow: 5,
          overflow: 'hidden',
          p: 2
        }}>
          <Chatbot />
        </Box>
      </Container>
    </Box>
  );
};

export default LearnWithAI;