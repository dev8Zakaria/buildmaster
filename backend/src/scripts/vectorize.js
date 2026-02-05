import pkg from 'pg';
const { Client } = pkg;
import { generateEmbedding } from '../Services/AIService.js'; // Note le changement d'import
import dotenv from 'dotenv';

dotenv.config();

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function run() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });

    try {
        await client.connect();
        console.log("📡 Connexion DB établie.");

        const res = await client.query(`
            SELECT c.id, c.name, c.brand, c.specifications, cat.name as category_name 
            FROM components c 
            JOIN component_categories cat ON c."categoryId" = cat.id 
            WHERE c.embedding IS NULL
        `);
        const products = res.rows;

        if (products.length === 0) {
            console.log("⏩ All products are already vectorized.");
        } else {
            console.log(`🚀 Starting vectorization (Hugging Face) for ${products.length} products...`);

            for (const p of products) {
                try {
                    // Enriching context with Category and Specs!
                    const text = `Category: ${p.category_name}, Product: ${p.name}, Brand: ${p.brand}, Specs: ${JSON.stringify(p.specifications)}`;
                    const vector = await generateEmbedding(text);
                    const vectorString = `[${vector.join(',')}]`;

                    await client.query('UPDATE components SET embedding = $1::vector WHERE id = $2', [vectorString, p.id]);
                    console.log(`✅ Vectorized: ${p.name}`);

                    // Small delay to be nice to the API (0.5s)
                    await delay(500);

                } catch (err) {
                    console.error(`❌ Error on ${p.name}:`, err.message);
                }
            }
        }
    } catch (err) {
        console.error("Erreur critique:", err);
    } finally {
        await client.end();
        process.exit(0);
    }
}

run();