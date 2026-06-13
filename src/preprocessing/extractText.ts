import { extractText, getDocumentProxy } from "unpdf"
import fs from "node:fs"
import process from "node:process"
import { cleanText } from "./cleaning.js"
import { tokenizeText } from "./tokenizer.js"

const pathToBooks = process.cwd() + '\\src\\books'
const pathCleaned = process.cwd() + '\\src\\preprocessing\\data\\cleaned'
const pathTokens = process.cwd() + '\\src\\preprocessing\\data\\tokens'
const files = fs.readdirSync(pathToBooks)

for (const file of files) {
    const buffer = fs.readFileSync(pathToBooks + '\\' + file)
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(pdf, { mergePages: true })

    const cleanedText = cleanText(text)

    fs.writeFileSync(`${pathCleaned}\\${file.split(".")[0]}.txt`, cleanedText)
    const tokens = tokenizeText(cleanedText)
    fs.writeFileSync(`${pathTokens}\\${file.split(".")[0]}.json`, JSON.stringify(tokens))
}
