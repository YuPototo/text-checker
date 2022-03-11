import type { WordMarked } from "./type";

// 暂时只考虑下面的符号
const MARK = [".", ",", "?"];

export function containsEndMark(word: string): boolean {
    const re = /[\.\?,]$/;
    return re.test(word);
}

export function wordToMarkedWord(word: string): WordMarked {
    if (containsEndMark(word)) {
        return {
            word: word.substring(0, word.length - 1),
            markAfter: word[word.length - 1],
        };
    }
    return { word };
}

export function textToWordArray(text: string): WordMarked[] {
    const arr = text.split(" ");
    return arr.map(wordToMarkedWord);
}
