import { compare, compareParts } from "../index";

describe("compareParts", () => {
    it("compareParts 1", () => {
        const userWords = ["a", "b"];
        const sourceWords = ["a", "b"];
        expect(compareParts(userWords, sourceWords)).toBe(1);
    });

    it("compareParts 2", () => {
        const userWords = ["a"];
        const sourceWords = ["a", "b"];
        expect(compareParts(userWords, sourceWords)).toBe(0.5);
    });

    it("compareParts 3", () => {
        const userWords = ["a"];
        const sourceWords = [];
        expect(compareParts(userWords, sourceWords)).toBe(0);
    });
});

describe("compare: I love you", () => {
    const source = [
        { word: "I" },
        { word: "love" },
        { word: "you", markAfter: "." },
    ];

    it("misspell", () => {
        const userInput = [
            {
                word: "I",
            },
            { word: "love" },
            { word: "u" },
        ];

        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "u", wrongType: "misspell" },
        ];

        const result = compare(userInput, source);

        expect(result).toEqual(expected);
    });

    it("lack at start", () => {
        const userInput = [{ word: "love" }, { word: "you" }];

        const expected = [
            { word: "***", wrongType: "lack" },
            { word: "love" },
            { word: "you" },
        ];

        const result = compare(userInput, source);

        expect(result).toEqual(expected);
    });

    it("lack at the end, no mark", () => {
        const userInput = [{ word: "I" }, { word: "love" }];

        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "***", wrongType: "lack" },
        ];

        const result = compare(userInput, source);

        expect(result).toEqual(expected);
    });

    it("lack at the end, with mark", () => {
        const userInput = [{ word: "I" }, { word: "love", markAfter: "." }];
        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "***", wrongType: "lack", markAfter: "." },
        ];

        const result = compare(userInput, source);

        expect(result).toEqual(expected);
    });

    it("redundant", () => {
        const userInput = [
            { word: "I" },
            { word: "love" },
            { word: "you" },
            { word: "too" },
        ];

        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "you" },
            { word: "too", wrongType: "redundant" },
        ];

        const result = compare(userInput, source);

        expect(result).toEqual(expected);
    });
});

describe("compare: I love you very much", () => {
    const source = [
        { word: "I" },
        { word: "love" },
        { word: "you" },
        { word: "very" },
        { word: "much" },
    ];

    it("case1: I loved you very", () => {
        const userInput = [
            {
                word: "I",
            },
            { word: "loved" },
            { word: "you" },
            { word: "very" },
        ];

        const expected = [
            { word: "I" },
            { word: "loved", wrongType: "misspell" },
            { word: "you" },
            { word: "very" },
            { word: "***", wrongType: "lack" },
        ];

        const result = compare(userInput, source);

        expect(result).toEqual(expected);
    });

    it("case 2: love", () => {
        const userInput = [{ word: "love" }];

        const expected = [
            { word: "***", wrongType: "lack" },
            { word: "love" },
            { word: "***", wrongType: "lack" },
            { word: "***", wrongType: "lack" },
            { word: "***", wrongType: "lack" },
        ];

        const result = compare(userInput, source);

        expect(result).toEqual(expected);
    });
});
