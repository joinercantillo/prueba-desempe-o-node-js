import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const port = process.env.PORT || 3000;

let server: any;
try {
  server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (err: any) {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${port} already in use`);
    process.exit(1);
  }
  throw err;
}

const shutdown = (signal: string) => {
  console.log(`Received ${signal} - closing server`);
  if (server && typeof server.close === 'function') {
    try {
      server.close((err: any) => {
        if (err) {
          console.error('Error during server close', err);
          process.exit(1);
        }
        process.exit(0);
      });
    } catch (e) {
      console.error('Error closing server', e);
      process.exit(1);
    }
    // Force exit if graceful close takes too long
    setTimeout(() => {
      console.error('Forcing shutdown');
      process.exit(1);
    }, 10000).unref();
  } else {
    console.log('Server not running, exiting');
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
// ts-node-dev / nodemon use SIGUSR2 for restart cycles
process.once('SIGUSR2', () => {
  server.close(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
