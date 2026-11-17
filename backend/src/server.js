import { createApp } from './app.js';
import { TokenCleanupService } from './services/TokenCleanupService.js';

const PORT = process.env.PORT ?? 3000;
const HOST = process.env.HOST ?? '0.0.0.0';

const app = createApp();

// Start token cleanup service
const cleanupService = new TokenCleanupService();
cleanupService.start();

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
