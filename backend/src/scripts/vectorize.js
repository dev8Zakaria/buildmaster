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

        const res = await client.query('SELECT id, name, brand FROM components WHERE embedding IS NULL');
        const products = res.rows;

        if (products.length === 0) {
            console.log("⏩ Tout est déjà vectorisé.");
        } else {
            console.log(`🚀 Début de vectorisation (Hugging Face) pour ${products.length} produits...`);

            for (const p of products) {
                try {
                    const text = `Produit: ${p.name}, Marque: ${p.brand}`;
                    const vector = await generateEmbedding(text);
                    const vectorString = `[${vector.join(',')}]`;

                    await client.query('UPDATE components SET embedding = $1::vector WHERE id = $2', [vectorString, p.id]);
                    console.log(`✅ ${p.name}`);

                    // Petite pause de politesse (0.5s)
                    await delay(500); 

                } catch (err) {
                    console.error(`❌ Erreur sur ${p.name}:`, err.message);
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