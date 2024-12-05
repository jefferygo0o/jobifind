// src/GradioClientComponent.js
import React, { useState, useEffect } from 'react';
import { Client } from '@gradio/client';

const GradioClientComponent = () => {
  const [client, setClient] = useState(null);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([["Hello!", null]]);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const clientInstance = await Client.connect("Qwen/Qwen2.5-Coder-demo");
        setClient(clientInstance);
      } catch (err) {
        setError(err);
      }
    };

    initializeClient();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client || !query) return;

    setLoading(true);
    setError(null);

    try {
      const response = await client.predict("/model_chat", {
        query: query,
        history: history,
        system: "Hello!!",
        radio: "0.5B",
      });

      // Update history and result
      const newHistory = [...history, [query, response.data[0]]];
      setHistory(newHistory);
      setResult(newHistory);
      setQuery('');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Interactive Gradio Client</h1>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message here..."
          rows="4"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
      <div>
        <h2>Conversation History</h2>
        {result.map((entry, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>You:</strong> {entry[0]}
            <br />
            <strong>Bot:</strong> {entry[1]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradioClientComponent;
