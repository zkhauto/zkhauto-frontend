'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import ChatLogs from '@/components/ChatLogs';
import axios from 'axios';

const ChatLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatLogs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/logs`);
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch chat logs');
        setLoading(false);
        console.error('Error fetching chat logs:', err);
      }
    };

    fetchChatLogs();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Chat History
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and analyze all chat interactions
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <ChatLogs logs={logs} />
      )}
    </Container>
  );
};

export default ChatLogsPage; 