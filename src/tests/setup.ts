import { sequelizeConnection } from '../db/config';

// Global test setup
beforeAll(async () => {
	// Ensure database is ready for tests
	await sequelizeConnection.authenticate();
});

// Clean up after each test
afterEach(async () => {
	// Clear all tables after each test
	await sequelizeConnection.sync({ force: true });
});