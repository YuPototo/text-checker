const re = /(?<mark>[\.\?,]?(\n)?)$/;
const word = "word.\n";
const match = word.match(re);
const mark = match.groups.mark;
console.log(word.replace(mark, ""));
