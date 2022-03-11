export type WordMarked = {
    word: string;
    markAfter?: string;
};

type WrongType = "misspell" | "redundant" | "lack";

export interface CheckWord extends WordMarked {
    wrongType?: WrongType;
}

export type CheckResult = CheckWord[];
