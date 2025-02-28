"use client";

import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Avatar from "@mui/material/Avatar";
import Fade from "@mui/material/Fade";

// MUI Icons
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages([...newMessages, { text: data.reply, sender: "ai" }]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages([
        ...newMessages,
        { 
          text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
          sender: "ai", 
          error: true 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
        height: "70vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: "primary.main", 
        color: "primary.contrastText",
        borderBottom: "1px solid",
        borderColor: "divider"
      }}>
        <Typography variant="h6" fontWeight="medium" sx={{ display: "flex", alignItems: "center" }}>
          <SmartToyIcon sx={{ mr: 1 }} /> Hebrew Learning Assistant
        </Typography>
      </Box>

      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 2, 
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        bgcolor: (theme) => theme.palette.mode === 'light' ? "#f5f7fb" : "#121212",
        gap: 2
      }}>
        {messages.length === 0 && (
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%",
              opacity: 0.7
            }}
          >
            <SmartToyIcon sx={{ fontSize: 60, mb: 2, color: "primary.main" }} />
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Ask me anything about Hebrew language and culture!
            </Typography>
          </Box>
        )}

        {messages.map((msg, index) => (
          <Fade key={index} in={true} timeout={300}>
            <Box 
              sx={{
                display: "flex",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: msg.sender === "user" ? "secondary.main" : "primary.main",
                  width: 36,
                  height: 36,
                  mr: msg.sender === "user" ? 0 : 1,
                  ml: msg.sender === "user" ? 1 : 0
                }}
              >
                {msg.sender === "user" ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              <Paper 
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  borderRadius: 2,
                  bgcolor: msg.sender === "user" 
                    ? "secondary.light" 
                    : msg.error 
                      ? "error.lighter" 
                      : "primary.lighter",
                  color: msg.sender === "user" 
                    ? "secondary.contrastText" 
                    : "text.primary",
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                  {msg.text}
                </Typography>
              </Paper>
            </Box>
          </Fade>
        ))}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", m: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: "primary.main",
                width: 36,
                height: 36,
                mr: 1
              }}
            >
              <SmartToyIcon />
            </Avatar>
            <Box sx={{ display: "flex", gap: 0.5, p: 1 }}>
              <CircularProgress size={10} />
              <CircularProgress size={10} sx={{ animationDelay: "0.2s" }} />
              <CircularProgress size={10} sx={{ animationDelay: "0.4s" }} />
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper"
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about Hebrew..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          multiline
          maxRows={3}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              pr: 1
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={sendMessage} 
                  disabled={loading || !input.trim()}
                  color="primary"
                  size="large"
                  sx={{ 
                    bgcolor: "primary.main", 
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default Chatbot;