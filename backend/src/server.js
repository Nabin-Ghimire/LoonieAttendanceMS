import app from './app.js';
import { connnectDB } from './Config/db.js';
import { Config } from './Config/index.js';
import logger from './Config/logger.js';

const startServer = async () => {
  const PORT = Config.PORT;

  try {
    // Start server
    app.listen(PORT, () => {
      logger.info('Server listening on port', { port: PORT });
    });

    //  Tries to Connect to LoonieAttendanceMS DB
    try {
      await connnectDB();
      logger.info('Database connected successfully');
    } catch (dbError) {
      logger.error(`Database connection error: ${dbError.errmsg[0] || dbError.message}`);
      return process.exit(1);
    }

  } catch (error) {
    logger.error(error.message);
    setTimeout(() => process.exit(1), 1000);
  }
};

void startServer();