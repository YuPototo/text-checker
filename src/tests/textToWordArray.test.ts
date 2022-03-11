import { textToWordArray, wordToMarkedWord, containsEndMark } from "../index";

describe("containsEndMark", () => {
    it("should return false when no mark", () => {
        expect(containsEndMark("word")).toBeFalsy();
    });

    it("should return true with .", () => {
        expect(containsEndMark("word.")).toBeTruthy();
    });
});

describe("wordToMarkedWord", () => {
    it("should process normal word", () => {
        expect(wordToMarkedWord("word")).toEqual({ word: "word" });
    });

    it("should process word with mark", () => {
        expect(wordToMarkedWord("lord.")).toEqual({
            word: "lord",
            markAfter: ".",
        });
    });

    it("should not process number", () => {
        expect(wordToMarkedWord("1.25")).toEqual({
            word: "1.25",
        });

        expect(wordToMarkedWord("1,000")).toEqual({
            word: "1,000",
        });
    });

    it("should not process o'clock", () => {
        expect(wordToMarkedWord("o'clock")).toEqual({
            word: "o'clock",
        });
    });

    it("should not process hyphen", () => {
        const text = "non-governmental";
        expect(wordToMarkedWord(text)).toEqual({
            word: "non-governmental",
        });
    });
});

describe("textToWordArray", () => {
    it("should change text to word array", () => {
        const text = "I love you.";
        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "you", markAfter: "." },
        ];
        const result = textToWordArray(text);
        expect(result).toEqual(expected);
    });
});
