# Book Search Engine

A full-text search engine over technical books using BM25 ranking, built from scratch with Node.js and TypeScript.

## Stack

Node.js, TypeScript, Express, natural, unpdf, Winston

## How it works

1. Extracts text from PDF books using unpdf
2. Cleans and tokenizes text using the natural library
3. Builds an in-memory inverted index with BM25 ranking
4. Exposes a `/search` endpoint returning ranked results

## Setup

```bash
npm install
npm run seed       # extract PDFs, build index
npm run dev        # start server
```

## API

```
GET /search?q=machine+learning
```

Returns ranked list of books with BM25 scores.

## Project Structure

```
src/
├── books/              # PDF files
├── preprocessing/
│   ├── extractText.ts  # PDF extraction pipeline
│   ├── cleaning.ts     # Text cleaning
│   ├── tokenizer.ts    # Tokenization + stopword removal
│   ├── invertedIndex.ts
│   └── data/
│       ├── cleaned/    # Extracted text
│       ├── tokens/     # Token arrays per book
│       └── index/      # Inverted index + document table
├── server/             # Express API
└── utils/              # Logger, types
```