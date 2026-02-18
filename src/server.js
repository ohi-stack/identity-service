import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'identity-service',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Identity service running on port ${PORT}`);
});
