import { compare } from "./compare";
import { textToWordArray } from "./textToWordArray";
import type { CheckResult } from "./type";

export function check(userInput: string, source: string): CheckResult {
    const userInputMarked = textToWordArray(userInput);
    const sourceMarked = textToWordArray(source);

    const checkResult = compare(userInputMarked, sourceMarked);
    return checkResult;
}
