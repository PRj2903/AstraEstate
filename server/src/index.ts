import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==============================================`);
  console.log(`🏰 Astrra Estates API Server running on port ${PORT}`);
  console.log(`🚀 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏢 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`==============================================`);
});
