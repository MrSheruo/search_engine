import { extractText, getDocumentProxy } from "unpdf"
import fs from "node:fs"
import process from "node:process"
import { cleanText } from "./cleaning.js"
import { tokenizeText } from "./tokenizer.js"
import path from "node:path"
import logger from "src/utils/logger.js"

process.on("unhandledRejection", reason => {
    logger.error("Unhandled promise rejection", reason);
});

const pathToBooks = path.join(process.cwd(), "src", "books")
const pathCleaned = path.join(process.cwd(), "src", "preprocessing", "data", "cleaned")
const pathTokens = path.join(process.cwd(), "src", "preprocessing", "data", "tokens")

fs.mkdirSync(pathCleaned, { recursive: true });
fs.mkdirSync(pathTokens, { recursive: true });

const files = fs.readdirSync(pathToBooks).filter(f => f.endsWith('.pdf'))


export async function extractAllPDFs() {
    if (files.length < 1) {
        logger.info(`No PDFs Found in path ${pathToBooks}`)
        return;
    }
    for (const file of files) {
        try {
            logger.info(`Extracting text from ${file}`)

            const buffer = fs.readFileSync(path.join(pathToBooks, file))
            const pdf = await getDocumentProxy(new Uint8Array(buffer)).catch((error) => {
                logger.error(`Error extracting text from ${file}`, error)
                return null;
            })
            if (!pdf) continue;

            const extractionResult = await extractText(pdf, { mergePages: true }).catch((error) => {
                logger.error(`Error extracting text from ${file}`, error)
                return null;
            })
            if (!extractionResult) continue;

            const { text } = extractionResult;

            const cleanedText = cleanText(text)
            fs.writeFileSync(path.join(pathCleaned, `${file.split(".")[0]}.txt`), cleanedText)

            const tokens = tokenizeText(cleanedText)
            fs.writeFileSync(path.join(pathTokens, `${file.split(".")[0]}.json`), JSON.stringify(tokens))
            logger.info('✓ Processed: ' + file)
        } catch (error) {
            logger.error(`Error extracting text from ${file}`, error)

        }

    }

}

