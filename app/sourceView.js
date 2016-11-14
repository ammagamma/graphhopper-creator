const codemirror = require('codemirror');
const par = require('./parameters.js');

let sourceView = null;

module.exports.createSourceView = function(domNode) {
	sourceView = codemirror(domNode, {
		mode: "java",
		theme: "base16-light",
		indentUnit: 4,
		lineNumbers: true,
	});

	sourceView.setSize(par.sourcePaneWidth, par.svgHeight);
}

module.exports.setSourceLines = function(lines) {
	const s = lines.join("\n") + "\n";
	sourceView.setValue(s);
}

module.exports.getSourceLines = function() {
	const lines = [];
	sourceView.eachLine(function(l) {
		lines.push(l.text);
	});
	return lines;
}
