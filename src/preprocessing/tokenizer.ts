import { cleanText } from "./cleaning.js";
import natural from "natural"

const tokenizer = new natural.WordTokenizer();

export function tokenizeText(text: string) {
    return tokenizer.tokenize(
        cleanText(text)
            .toLowerCase()
    )
        .filter(word => word.length > 1)
        .filter(token => !/^\d+$/.test(token))
}
