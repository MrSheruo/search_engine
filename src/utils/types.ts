export type Posting = {
    docId: number;
    termFrequency: number;
};

export type InvertedIndex = Record<string, Posting[]>;

export type DocumentRecord = {
    id: number;
    filename: string;
    title: string;
    totalTokens: number;
    uniqueTerms: number;
};

export type DocumentTable = Record<number, DocumentRecord>;
