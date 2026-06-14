import fs from "node:fs";
import path from "node:path";
import { tokenizeText } from "src/preprocessing/tokenizer.js"
import type { DocumentTable, InvertedIndex } from "src/utils/types.js";
const indexPath = path.join(process.cwd(), "src", "preprocessing", "data", "index")

type SearchIndexState = {
    index: InvertedIndex;
    numberOfDocuments: number;
    table: DocumentTable;
};

const invertedIndexPath = path.join(indexPath, "inverted-index.json");
const documentTablePath = path.join(indexPath, "document-table.json");

let searchIndexState: SearchIndexState | undefined;

function loadSearchIndex() {
    if (searchIndexState) {
        return searchIndexState;
    }

    if (!fs.existsSync(invertedIndexPath) || !fs.existsSync(documentTablePath)) {
        throw new Error("Search index is missing. Run npm run seed before starting searches.");
    }

    const index: InvertedIndex = JSON.parse(fs.readFileSync(invertedIndexPath, "utf-8"));
    const table: DocumentTable = JSON.parse(fs.readFileSync(documentTablePath, "utf-8"));
    const numberOfDocuments = Object.keys(table).length;

    searchIndexState = {
        index,
        numberOfDocuments,
        table,
    };

    return searchIndexState;
}

export function search(query: string) {
    const { index, numberOfDocuments, table } = loadSearchIndex();
    const tokens = tokenizeText(query);
    if (tokens.length === 0 || numberOfDocuments === 0) {
        return [];
    }

    const scores: Record<number, number> = {};
    const avgLen = Object.values(table).reduce((sum, doc) => sum + doc.totalTokens, 0) / numberOfDocuments

    for (const token of tokens) {
        const postings = index[token]
        if (!postings) continue;

        const idf = Math.log((numberOfDocuments - postings.length + 0.50) / (postings.length + 0.50) + 1)

        for (const posting of postings) {
            const doc = table[posting.docId];
            if (!doc) continue;

            const tf = posting.termFrequency
            const docLen = doc.totalTokens

            const numerator = (tf * (1.5 + 1))
            const denominator = tf + 1.5 * (1 - 0.75 + (0.75 * (docLen / avgLen)))
            scores[posting.docId] = (scores[posting.docId] ?? 0) + idf * (numerator / denominator);

        }

    }

    const result = Object.entries(scores)
        .map(([docIdStr, score]) => ({ docId: parseInt(docIdStr), score }))
        .sort((a, b) => b.score - a.score)

    const booksInfo = result.map((doc) => ({ ...table[doc.docId], score: doc.score }))
    return booksInfo
}

