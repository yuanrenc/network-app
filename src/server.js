const logger = require('./utils/logger');
const connectDB = require('./utils/db');
const app = require('./app');

connectDB();

const PORT = process.env.PROT || 5000;

app.listen(PORT, logger.info(`Server started on port ${PORT}`));
