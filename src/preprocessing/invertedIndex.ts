import fs from "node:fs";
import path from "node:path";
import logger from "src/utils/logger.js";
import type { DocumentTable, InvertedIndex } from "src/utils/types.js";

const pathTokens = path.join(
    process.cwd(),
    "src",
    "preprocessing",
    "data",
    "tokens"
);

const pathIndex = path.join(
    process.cwd(),
    "src",
    "preprocessing",
    "data",
    "index"
);

const invertedIndexPath = path.join(pathIndex, "inverted-index.json");
const documentTablePath = path.join(pathIndex, "document-table.json");

export function buildInvertedIndex() {
    fs.mkdirSync(pathIndex, { recursive: true });

    fs.rmSync(invertedIndexPath, { force: true });
    fs.rmSync(documentTablePath, { force: true });

    const index = Object.create(null) as InvertedIndex;
    const documentTable = Object.create(null) as DocumentTable;
    const failedFiles: string[] = [];

    const files = fs
        .readdirSync(pathTokens)
        .filter((file) => file.endsWith(".json"))
        .sort();

    logger.info("Building inverted index", {
        tokensPath: pathTokens,
        indexPath: pathIndex,
        filesCount: files.length,
    });

    let nextDocId = 0;

    for (const file of files) {
        const filePath = path.join(pathTokens, file);

        try {
            logger.info(`Indexing tokens from ${file}`);

            const raw = fs.readFileSync(filePath, "utf-8");
            const parsed = JSON.parse(raw) as unknown;

            if (!Array.isArray(parsed)) {
                throw new Error("Token file does not contain an array");
            }

            const tokens = parsed.filter(
                (token): token is string =>
                    typeof token === "string" && token.trim().length >= 2
            );

            if (tokens.length === 0) {
                throw new Error("Token file contains no valid tokens");
            }

            const docId = nextDocId;
            const title = path.parse(file).name;
            const termCounts = Object.create(null) as Record<string, number>;

            for (const token of tokens) {
                termCounts[token] = (termCounts[token] ?? 0) + 1;
            }

            for (const [term, termFrequency] of Object.entries(termCounts)) {
                if (!Array.isArray(index[term])) {
                    index[term] = [];
                }

                index[term].push({ docId, termFrequency });
            }

            documentTable[docId] = {
                id: docId,
                filename: file,
                title,
                totalTokens: tokens.length,
                uniqueTerms: Object.keys(termCounts).length,
            };

            nextDocId++;

            logger.info(`✓ Indexed ${file}`, {
                docId,
                totalTokens: tokens.length,
                uniqueTerms: Object.keys(termCounts).length,
            });
        } catch (error) {
            failedFiles.push(file);

            logger.error(`✗ Failed to index ${file}`, {
                filePath,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    fs.writeFileSync(invertedIndexPath, JSON.stringify(index));
    fs.writeFileSync(documentTablePath, JSON.stringify(documentTable));

    logger.info("Inverted index built", {
        indexedFiles: Object.keys(documentTable).length,
        failedFiles: failedFiles.length,
        failedFileNames: failedFiles,
        totalTerms: Object.keys(index).length,
        invertedIndexPath,
        documentTablePath,
    });
}