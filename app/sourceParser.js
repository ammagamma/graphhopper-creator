const exceptions = require("../app/exceptions.js");

const pattern = /^graph\.edge\((\d+),\s*(\d+)\)\.setDistance\((\d+(\.\d+)?)\);$/;

module.exports.parseLine = function(line) {
	 const trimmedLine = line.trim();
	 const match = pattern.exec(trimmedLine);
	 if (!match) {
		throw new exceptions.InvalidSourceFormatException;
     }
     const from = parseInt(match[1]);
     const to = parseInt(match[2]);
     const weight = parseFloat(match[3]);
     if (isNaN(weight)) {
		throw new exceptions.InvalidSourceFormatException;
	 }
     return { from: from, to: to, weight: weight };
}
