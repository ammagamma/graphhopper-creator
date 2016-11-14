const sourceParser = require("../app/sourceParser.js");
const exceptions = require("../app/exceptions.js");

describe("sourceParser", function() {
    it("parses valid source code line correctly", function() {
        const line = "graph.edge(0, 1).setDistance(3.6);";
        const result = sourceParser.parseLine(line);
        const expected = { from: 0, to: 1, weight: 3.6 };
        expect(result).toEqual(expected);
    });

    it("parses valid source code line with multidigit node indices correctly", function() {
        const line = "graph.edge(0, 10).setDistance(3.6);";
        const result = sourceParser.parseLine(line);
        const expected = { from: 0, to: 10, weight: 3.6 };
        expect(result).toEqual(expected);
    });

    it("parses valid source code line with extra white space correctly", function() {
        const line = "\tgraph.edge(0, 1).setDistance(3.6);   ";
        const result = sourceParser.parseLine(line);
        const expected = { from: 0, to: 1, weight: 3.6 };
        expect(result).toEqual(expected);
    });

	it("throws when parsing source code line and distance is not a number", function() {
		const input1 = "graph.edge(0,1).setDistance(3xx);";
		const input2 = "graph.edge(0,1).setDistance(3.3.3);";
		expect(() => sourceParser.parseLine(input1)).toThrow(new exceptions.InvalidSourceFormatException);
		expect(() => sourceParser.parseLine(input2)).toThrow(new exceptions.InvalidSourceFormatException);
	});

	it("throws when parsing source code line and distance is negative", function() {
		const input = "graph.edge(0,1).setDistance(-3.6);";
		expect(() => sourceParser.parseLine(input)).toThrow(new exceptions.InvalidSourceFormatException);
	});

	it("throws when parsing source code line and node index is negative", function() {
		const input = "graph.edge(0,-1).setDistance(3.6);";
		expect(() => sourceParser.parseLine(input)).toThrow(new exceptions.InvalidSourceFormatException);
	});

	it("throws when parsing source code line and there are extra characters at the beginning", function() {
		const input = "xxxgraph.edge(0,1).setDistance(3.6);";
		expect(() => sourceParser.parseLine(input)).toThrow(new exceptions.InvalidSourceFormatException);
	});

	it("throws when parsing source code line and there are extra characters at the end", function() {
		const input = "graph.edge(0,1).setDistance(3.6);xxx";
		expect(() => sourceParser.parseLine(input)).toThrow(new exceptions.InvalidSourceFormatException);
	});

	it("throws when parsing source code line with multiple statements", function() {
		const input = "graph.edge(0,1).setDistance(3.6);graph.edge(0,2).setDistance(3.6);";
		expect(() => sourceParser.parseLine(input)).toThrow(new exceptions.InvalidSourceFormatException);
	});

	it("throws when parsing invalid source code line", function() {
		const input = "grph.ege(0,1).setDistance(3.6);";
		expect(() => sourceParser.parseLine(input)).toThrow(new exceptions.InvalidSourceFormatException);
	});
});
