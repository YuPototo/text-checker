import * as _ from "lodash";
import type { CheckResult, CheckWord, WordMarked } from "./type";

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

export function compare(
    userInput: WordMarked[],
    source: WordMarked[]
): CheckResult {
    const result = _.cloneDeep(userInput) as CheckResult;
    const LACK_WORD: CheckWord = { word: "***", wrongType: "lack" };

    const maxLength = Math.max(userInput.length, source.length);
    let redundantCount = 0;
    let lackCount = 0;
    let maxLengthFixer = 0;

    for (let i = 0; i < maxLength + maxLengthFixer; i++) {
        const sourceIndex = i - redundantCount;
        const userInputIndex = i - lackCount;
        const resultIndex = i;

        const userWordMarked = userInput[userInputIndex];
        const sourceWordMarked = source[sourceIndex];

        maxLengthFixer = userInput.length < source.length ? redundantCount : 0;

        if (userWordMarked === undefined) {
            // 说明不再有 userWord
            result.push(_.cloneDeep(LACK_WORD));

            // move mark
            const previousResultWord = result[resultIndex - 1];
            const previousSourceWord = source[sourceIndex - 1];

            if (
                previousResultWord?.markAfter &&
                previousSourceWord.markAfter === undefined
            ) {
                result[resultIndex].markAfter =
                    result[resultIndex - 1].markAfter;
                delete result[resultIndex - 1]?.markAfter;
            }
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

        const { scoreMisspell, scoreRedundant, scoreLack } = getScores(
            userInput,
            source,
            userInputIndex,
            sourceIndex
        );

        const max = Math.max(scoreLack, scoreRedundant, scoreMisspell);

        if (max === scoreMisspell && max === scoreRedundant) {
            let scoreMisspellNextWord = getMaxScore(
                userInput,
                source,
                userInputIndex + 1,
                sourceIndex + 1
            );

            let scoreRedundantNextWord = getMaxScore(
                userInput,
                source,
                userInputIndex + 1,
                sourceIndex - 1
            );

            if (scoreMisspellNextWord >= scoreRedundantNextWord) {
                result[i].wrongType = "misspell";
            } else {
                result[i].wrongType = "redundant";
                redundantCount++;
            }
        } else if (max === scoreMisspell) {
            result[i].wrongType = "misspell";
        } else if (max === scoreRedundant) {
            result[i].wrongType = "redundant";
            redundantCount++;
        } else if (max === scoreLack) {
            result.splice(resultIndex, 0, _.cloneDeep(LACK_WORD));
            // move mark
            const previousResultWord = result[resultIndex - 1];
            const previousSourceWord = source[sourceIndex - 1];

            if (
                previousResultWord?.markAfter &&
                previousSourceWord.markAfter === undefined
            ) {
                result[resultIndex].markAfter =
                    result[resultIndex - 1].markAfter;
                delete result[resultIndex - 1]?.markAfter;
            }
            lackCount++;
        }
    }

    return result;
}

function getMisspellScore(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userInput.slice(userInputIndex).map((el) => el.word),
        source.slice(sourceIndex).map((el) => el.word)
    );
}

function getRedundantScore(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userInput.slice(userInputIndex + 1).map((el) => el.word),
        source.slice(sourceIndex).map((el) => el.word)
    );
}

function getLackScore(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userInput.slice(userInputIndex).map((el) => el.word),
        source.slice(sourceIndex + 1).map((el) => el.word)
    );
}

function getScores(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
) {
    const scoreMisspell = getMisspellScore(
        userInput,
        source,
        userInputIndex,
        sourceIndex
    );
    const scoreRedundant = getRedundantScore(
        userInput,
        source,
        userInputIndex,
        sourceIndex
    );
    const scoreLack = getLackScore(
        userInput,
        source,
        userInputIndex,
        sourceIndex
    );
    return {
        scoreMisspell,
        scoreRedundant,
        scoreLack,
    };
}

function getMaxScore(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
) {
    const { scoreMisspell, scoreRedundant, scoreLack } = getScores(
        userInput,
        source,
        userInputIndex,
        sourceIndex
    );
    return Math.max(scoreMisspell, scoreRedundant, scoreLack);
}
