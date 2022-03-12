import { check } from "../check";

describe("check 1", () => {
    const source = "I love you";

    it("test 1.1", () => {
        const userInput = "I love you";
        const expected = [{ word: "I" }, { word: "love" }, { word: "you" }];
        const result = check(userInput, source);

        expect(result).toEqual(expected);
    });

    it("test 1.2", () => {
        const userInput = "i Love YOU";
        const expected = [{ word: "i" }, { word: "Love" }, { word: "YOU" }];
        const result = check(userInput, source);

        expect(result).toEqual(expected);
    });

    it("test 1.3", () => {
        const userInput = "I love u";
        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "u", wrongType: "misspell" },
        ];
        const result = check(userInput, source);

        expect(result).toEqual(expected);
    });

    it("test 1.4", () => {
        const userInput = "I love u.";
        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "u", wrongType: "misspell", markAfter: "." },
        ];
        const result = check(userInput, source);

        expect(result).toEqual(expected);
    });

    it("test 1.5", () => {
        const userInput = "I love.";
        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "***", wrongType: "lack", markAfter: "." },
        ];
        const result = check(userInput, source);

        expect(result).toEqual(expected);
    });

    it("test 1.6", () => {
        const userInput = "love";
        const expected = [
            { word: "***", wrongType: "lack" },
            { word: "love" },
            { word: "***", wrongType: "lack" },
        ];
        const result = check(userInput, source);

        expect(result).toEqual(expected);
    });
});

describe("I love you. Do you love me?", () => {
    const source = "I love you. Do you love me?";

    it("case: I love you.", () => {
        const userInput = "I love you.";
        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "you", markAfter: "." },
            { word: "***", wrongType: "lack" },
            { word: "***", wrongType: "lack" },
            { word: "***", wrongType: "lack" },
            { word: "***", wrongType: "lack" },
        ];
        const result = check(userInput, source);

        expect(result).toEqual(expected);
    });

    it("case: I redundant love you.", () => {
        const userInput = "I redundant love you.";
        const expected = [
            { word: "I" },
            { word: "redundant", wrongType: "redundant" },
            { word: "love" },
            { word: "you", markAfter: "." },
            { word: "***", wrongType: "lack" },
            { word: "***", wrongType: "lack" },
            { word: "***", wrongType: "lack" },
            { word: "***", wrongType: "lack" },
        ];
        const result = check(userInput, source);
        expect(result).toEqual(expected);
    });

    it("case: I love you redundant. Do you love me", () => {
        const userInput = "I love you redundant. Do you love me";
        const expected = [
            { word: "I" },
            { word: "love" },
            { word: "you" },
            { word: "redundant", wrongType: "redundant", markAfter: "." },
            { word: "Do" },
            { word: "you" },
            { word: "love" },
            { word: "me" },
        ];
        const result = check(userInput, source);
        expect(result).toEqual(expected);
    });
});
