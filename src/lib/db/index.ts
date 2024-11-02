import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/neon-serverless';

const db = drizzle(DATABASE_URL);

export default db
