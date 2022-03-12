import {
    textToWordArray,
    wordToMarkedWord,
    containsEndMark,
    splitByLineBreaker,
} from "../index";

describe("containsEndMark", () => {
    it("should return false when no mark", () => {
        expect(containsEndMark("word")).toBeFalsy();
    });

    it("should return true with .", () => {
        expect(containsEndMark("word.")).toBeTruthy();
    });

    it("should return true with .\n", () => {
        expect(containsEndMark("word.\n")).toBeTruthy();
    });

    it("should return true withw \n", () => {
        expect(containsEndMark("word\n")).toBeTruthy();
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

    it("should process linebrekaker and mark", () => {
        const text = "hello.\n";
        expect(wordToMarkedWord(text)).toEqual({
            word: "hello",
            markAfter: ".\n",
        });
    });

    it("should process linebrekaker", () => {
        const text = "hello\n";
        expect(wordToMarkedWord(text)).toEqual({
            word: "hello",
            markAfter: "\n",
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

    it("should process \n rightly", () => {
        const text = "I love you.\nDo you";
        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "you", markAfter: ".\n" },
            { word: "Do" },
            { word: "you" },
        ];
        const result = textToWordArray(text);
        expect(result).toEqual(expected);
    });

    it("should process multiple space", () => {
        const text = "I   love";
        const expected = [{ word: "I" }, { word: "love" }];
        const result = textToWordArray(text);
        expect(result).toEqual(expected);
    });
});

describe("splitByLineBreaker", () => {
    it("word without line breaker", () => {
        expect(splitByLineBreaker("word")).toBeUndefined();
    });

    it("word with linebreaker", () => {
        expect(splitByLineBreaker("word\nafter")).toEqual(["word\n", "after"]);
    });
});
