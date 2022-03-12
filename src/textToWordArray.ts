import { cloneDeep, split } from "lodash";
import type { WordMarked } from "./type";

// 暂时只考虑下面的符号
const MARK = [".", ",", "?"];

export function containsEndMark(word: string): boolean {
    const re = /[\.\?,]$|(\n)$/; // 以符号结尾，或者以换行结尾
    return re.test(word);
}

export function wordToMarkedWord(word: string): WordMarked {
    if (containsEndMark(word)) {
        const re = /(?<mark>[\.\?,]?(\n)?)$/;
        const match = word.match(re);
        const mark = match.groups.mark;
        return {
            word: word.replace(mark, ""),
            markAfter: mark,
        };
    }
    return { word };
}

export function splitByLineBreaker(word: string) {
    if (!word.includes("\n")) return;
    const arr = word.split("\n");
    arr[0] = arr[0] + "\n";
    return arr;
}

export function textToWordArray(text: string): WordMarked[] {
    const arr = text.split(/[^\S\r\n]+/); // 匹配空格，但\n不算

    const arrCopy = cloneDeep(arr);

    let addedCount = 0;
    for (let i = 0; i < arrCopy.length; i++) {
        const word = arrCopy[i];
        if (!word.includes("\n")) continue;
        const subArr = splitByLineBreaker(word);
        arr.splice(i + addedCount, 1, subArr[0], subArr[1]);
        addedCount++;
    }
    return arr.map(wordToMarkedWord);
}
