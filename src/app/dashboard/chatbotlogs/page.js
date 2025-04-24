"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Checkbox,
  Button,
  Stack,
} from "@mui/material";
import { Refresh as RefreshIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ChatbotLogs() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLogs, setSelectedLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/logs`, {
        withCredentials: true,
      });
      setLogs(response.data);
      setError(null);
      setSelectedLogs([]); // Clear selection on refresh
    } catch (err) {
      console.error("Error fetching chat logs:", err);
      setError("Failed to load chat logs");
      toast.error("Failed to load chat logs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/logs/${id}`, {
        withCredentials: true,
      });
      setLogs(logs.filter(log => log._id !== id));
      setSelectedLogs(selectedLogs.filter(logId => logId !== id));
      toast.success("Chat log deleted successfully");
    } catch (err) {
      console.error("Error deleting chat log:", err);
      toast.error("Failed to delete chat log");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedLogs.map(id =>
          axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/logs/${id}`, {
            withCredentials: true,
          })
        )
      );
      setLogs(logs.filter(log => !selectedLogs.includes(log._id)));
      setSelectedLogs([]);
      toast.success(`${selectedLogs.length} chat logs deleted successfully`);
    } catch (err) {
      console.error("Error deleting selected chat logs:", err);
      toast.error("Failed to delete selected chat logs");
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedLogs(logs.map(log => log._id));
    } else {
      setSelectedLogs([]);
    }
  };

  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelectedLogs([...selectedLogs, id]);
    } else {
      setSelectedLogs(selectedLogs.filter(logId => logId !== id));
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <IconButton onClick={fetchLogs} color="primary" sx={{ mt: 2 }}>
          <RefreshIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", margin: "0 auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Go back">
            <IconButton onClick={() => router.back()} color="primary">
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "primary.main" }}>
            Chatbot Logs
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {selectedLogs.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedLogs.length})
            </Button>
          )}
          <Tooltip title="Refresh logs">
            <IconButton onClick={fetchLogs} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={logs.length > 0 && selectedLogs.length === logs.length}
                  indeterminate={selectedLogs.length > 0 && selectedLogs.length < logs.length}
                  onChange={handleSelectAll}
                  sx={{ color: "white" }}
                />
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Message</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Response</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Timestamp</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow 
                key={log._id} 
                hover 
                sx={{ 
                  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                  backgroundColor: selectedLogs.includes(log._id) ? "action.selected" : "inherit"
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedLogs.includes(log._id)}
                    onChange={(event) => handleSelectOne(event, log._id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                      {log.user.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2">{log.user}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: "300px", wordBreak: "break-word" }}>
                    {log.message}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: "300px", wordBreak: "break-word" }}>
                    {log.response}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}
                    size="small"
                    sx={{ bgcolor: "primary.light", color: "white" }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete log">
                    <IconButton
                      onClick={() => handleDelete(log._id)}
                      size="small"
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 