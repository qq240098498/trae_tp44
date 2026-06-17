/**
 * local server entry file, for local development
 */
import app from './app.js';
import { createServer } from 'net';

/**
 * find available port
 */
function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
    
    server.once('listening', () => {
      server.close();
      resolve(startPort);
    });
    
    server.listen(startPort);
  });
}

/**
 * start server with port
 */
async function startServer() {
  const desiredPort = parseInt(process.env.PORT || '3001', 10);
  const PORT = await findAvailablePort(desiredPort);
  
  if (PORT !== desiredPort) {
    console.log(`\x1b[33m⚠️  端口 ${desiredPort} 已被占用，自动使用端口 ${PORT}\x1b[0m`);
  }
  
  process.env.API_PORT = String(PORT);
  
  const server = app.listen(PORT, () => {
    console.log(`\n\x1b[32m✅  后端服务已启动\x1b[0m`);
    console.log(`\x1b[36m   地址: http://localhost:${PORT}\x1b[0m`);
    console.log(`\x1b[36m   API健康检查: http://localhost:${PORT}/api/health\x1b[0m\n`);
  });
  
  /**
   * close server
   */
  const gracefulShutdown = (signal: string) => {
    console.log(`\n\x1b[33m${signal} 信号收到，正在关闭服务器...\x1b[0m`);
    server.close(() => {
      console.log('\x1b[32m服务器已关闭\x1b[0m');
      process.exit(0);
    });
  };
  
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('\x1b[31m启动服务器失败:\x1b[0m', err);
  process.exit(1);
});

export default app;