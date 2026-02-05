import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log("Resetting embeddings...");
        await client.query('UPDATE components SET embedding = NULL');
        console.log("✅ Success. All embeddings cleared.");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
        process.exit(0);
    }
}
run();
