"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVectorStore = void 0;
// Importing necessary modules and classes
var directory_1 = require("langchain/document_loaders/fs/directory");
var text_1 = require("langchain/document_loaders/fs/text");
var text_splitter_1 = require("langchain/text_splitter");
var openai_1 = require("langchain/embeddings/openai");
var astradb_1 = require("@langchain/community/vectorstores/astradb");
// Constants and Environment Variables
var FILE_PATH = "/Users/cedricklunven/dev/datastax/cedrick/dataset";
var OPENAI_API_KEY = process.env['OPENAI_API_KEY'];
/**
 * Load and split documents from the local directory.
 * @returns {Promise<Array<Document>>} An array of split documents.
 */
function loadDocs() {
    return __awaiter(this, void 0, void 0, function () {
        var loader, docs, splitter, texts, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    loader = new directory_1.DirectoryLoader(FILE_PATH, { ".txt": function (path) { return new text_1.TextLoader(path); } });
                    return [4 /*yield*/, loader.load()];
                case 1:
                    docs = _a.sent();
                    splitter = new text_splitter_1.RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 15 });
                    return [4 /*yield*/, splitter.splitDocuments(docs)];
                case 2:
                    texts = _a.sent();
                    console.log("Loaded ".concat(texts.length, " documents."));
                    return [2 /*return*/, texts];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error loading documents:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Load documents and handle any errors
loadDocs().catch(function (error) { return console.error('Failed to load documents:', error); });
// Variable to store the vector store promise
var vectorStorePromise;
/**
 * Initialize and get the vector store as a promise.
 * @returns {Promise<AstraDBVectorStore>} A promise that resolves to the AstraDBVectorStore.
 */
function getVectorStore() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!vectorStorePromise) {
                vectorStorePromise = initVectorStore();
            }
            return [2 /*return*/, vectorStorePromise];
        });
    });
}
exports.getVectorStore = getVectorStore;
function initVectorStore() {
    return __awaiter(this, void 0, void 0, function () {
        var texts, astraConfig, vectorStore, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, loadDocs()];
                case 1:
                    texts = _a.sent();
                    astraConfig = getAstraConfig();
                    return [4 /*yield*/, astradb_1.AstraDBVectorStore.fromDocuments(texts, new openai_1.OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY, batchSize: 512 }), astraConfig)];
                case 2:
                    vectorStore = _a.sent();
                    // Generate embeddings from the documents and store them.
                    vectorStore.addDocuments(texts);
                    console.log(vectorStore);
                    return [2 /*return*/, vectorStore];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error initializing vector store:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Specify the database and collection to use.
// If the collection does not exist, it is created automatically.
function getAstraConfig() {
    return {
        token: 'AstraCS:iLPiNPxSSIdefoRdkTWCfWXt:2b360d096e0e6cb732371925ffcc6485541ff78067759a2a1130390e231c2c7a',
        endpoint: 'https://309a69e5-6296-4a28-b367-86f69b92e38f-europe-west4.apps.astra-dev.datastax.com',
        collection: 'demo-ts' !== null && 'demo-ts' !== void 0 ? 'demo-ts' : "vector_test",
        collectionOptions: {
            vector: {
                dimension: 1536,
                metric: "cosine",
            },
        },
    };
}
