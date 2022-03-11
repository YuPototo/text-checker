import * as _ from "lodash";
import type { CheckResult, CheckWord, WordMarked } from "./type";

/*
    userWords 和 sourceWords 都是 lower case
*/
export function compareParts(
    userWords: string[],
    sourceWords: string[]
): number {
    let matchCount = 0;
    const sourceLen = sourceWords.length;

    if (sourceLen === 0) {
        return 0;
    }

    for (let i = 0; i < sourceLen; i++) {
        if (
            sourceWords[i]?.toLocaleLowerCase() ===
            userWords[i]?.toLocaleLowerCase()
        ) {
            matchCount++;
        }
    }
    return matchCount / sourceLen;
}

/*
    这里的 word 都已经转化为 lower case
*/
export function compare(
    userInput: WordMarked[],
    source: WordMarked[]
): CheckResult {
    const result = _.cloneDeep(userInput) as CheckResult;
    const LACK_WORD: CheckWord = { word: "***", wrongType: "lack" };

    const maxLength = Math.max(userInput.length, source.length);
    let redundantCount = 0;
    let lackCount = 0;

    for (let i = 0; i < maxLength; i++) {
        const sourceIndex = redundantCount + i;
        const userInputIndex = i - lackCount;
        const resultIndex = lackCount + i;

        const userWordMarked = userInput[userInputIndex];
        const sourceWordMarked = source[sourceIndex];

        if (userWordMarked === undefined) {
            // 说明 userInput 数量少了
            result.push(LACK_WORD);

            // move mark
            if (result[resultIndex - 1]?.markAfter) {
                result[resultIndex].markAfter =
                    result[resultIndex - 1].markAfter;
            }
            delete result[resultIndex - 1]?.markAfter;
            lackCount++;
            continue;
        }

        if (sourceWordMarked === undefined) {
            // 说明此时 userInput 多了
            result[resultIndex].wrongType = "redundant";
            redundantCount++;
            continue;
        }

        if (
            userWordMarked.word.toLocaleLowerCase() ===
            sourceWordMarked.word.toLocaleLowerCase()
        )
            continue;

        const scoreMisspell = compareParts(
            userInput.slice(userInputIndex).map((el) => el.word),
            source.slice(sourceIndex).map((el) => el.word)
        );

        const scoreRedundant = compareParts(
            userInput.slice(userInputIndex + 1).map((el) => el.word),
            source.slice(sourceIndex).map((el) => el.word)
        );

        const scoreLack = compareParts(
            userInput.slice(userInputIndex).map((el) => el.word),
            source.slice(sourceIndex + 1).map((el) => el.word)
        );

        const max = Math.max(scoreLack, scoreRedundant, scoreMisspell);

        if (max === scoreMisspell) {
            result[i].wrongType = "misspell";
        } else if (max === scoreRedundant) {
            result[i].wrongType = "redundant";
            redundantCount++;
        } else if (max === scoreLack) {
            result.splice(resultIndex, 0, LACK_WORD);
            // move mark
            if (result[resultIndex - 1]?.markAfter) {
                result[resultIndex].markAfter =
                    result[resultIndex - 1].markAfter;
            }
            delete result[resultIndex - 1]?.markAfter;
            lackCount++;
        }
    }

    return result;
}
