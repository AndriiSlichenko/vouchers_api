import { initDb } from "./seed";

export const initializeDatabase = async () => {
	try {
		await initDb();
		console.log('DB running');
	} catch (error: any) {
		console.error('Database initialization error:', error?.message);
		// Try to continue without seeding if sync fails
		console.log('Continuing without database seeding...');
	}
};
