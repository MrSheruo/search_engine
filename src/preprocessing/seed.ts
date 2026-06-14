import logger from "src/utils/logger.js";
import { extractAllPDFs } from "./extractText.js";
import { buildInvertedIndex } from "./invertedIndex.js";

async function seed() {
    try {
        logger.info("Starting preprocessing pipeline");

        await extractAllPDFs();

        logger.info("Text extraction completed");

        buildInvertedIndex();

        logger.info("Inverted index built");
    } catch (error) {
        logger.error("Seed failed", error);
    }
}

seed();