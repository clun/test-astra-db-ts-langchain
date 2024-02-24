import * as fs from 'fs';
import * as util from 'util';

import { AstraDB, Collection } from "@datastax/astra-db-ts";
import { OpenAI } from "openai";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Convert the fs.readFile method into a promise so we can use async/await
const readFile = util.promisify(fs.readFile);

// Replace the below path with the path to your text file
const FILE_PATH = "./datasets";
const ASTRA_DB_APPLICATION_TOKEN=process.env.ASTRA_DB_APPLICATION_TOKEN 
const ASTRA_DB_API_ENDPOINT=process.env.ASTRA_DB_API_ENDPOINT

// Your OpenAI API key should be set in your environment variables for security reasons
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function main() {

    try {
        const loader = new DirectoryLoader(FILE_PATH, { ".txt": path => new TextLoader(path) });
        const docs = await loader.load();
    
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 15 });
        const splitStrings = await splitter.splitDocuments(docs);
        
        // Prepare the requests for embedding
        const embeddingPromises = splitStrings.map(async (text) => {
            return openai.embeddings({
            model: "text-embedding-ada-002",
            input: text,
            });
        });

        // Log the start of embedding
        console.log("Starting Embedding");

        // Compute embeddings for each split string
        const documentEmbeddings = await embeddings.embedDocuments(splitStrings);

        console.log("Inserting into Astra");

        // Initialize the database connection
        const db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT);
        const collection: Collection = await db.createCollection('collection_vector1', {
            "vector": {
                "dimension": 1536,
                "metric": "cosine"
            }
        });
        
        // Create batches of the `astraDocs`, here assuming `20` as the batch size
        const batches = chunkArray(splitDocs, 20);
        
        // Map each batch to an insertMany operation, creating an array of Promises
        const batchesReq = batches.map((batch) => collection.insertMany(batch));
        
        // Use Promise.all to wait for all insertMany Promises to resolve
        const res = await Promise.all(batchesReq);

    } catch (error) {
        console.error("An error occurred while computing embeddings:", error);
    }
}

main().catch(error => console.error('Failed to run query:', error));
