const graphViewController = require('./graphViewController.js');
const mainController = require('./mainController.js');
const par = require('./parameters.js');
const sourceViewController = require('./sourceViewController.js');

setLayout();
setBottomView();
initializeGraphAndSourceView();
setGlobalErrorHandler();

function setLayout() {
	const graphPane = document.getElementById("graph_pane");
	graphPane.style.width = par.svgWidth;
	graphPane.style.height = par.svgHeight;
	
	const sourcePane = document.getElementById("source_pane");
    sourcePane.style.width = par.sourcePaneWidth + "px";
    sourcePane.style.height = par.svgHeight + "px";
    sourcePane.style.marginRight = -par.sourcePaneWidth + "px";
}

function setBottomView() {
    document.getElementById("syncGraphToSourceButton").addEventListener("click", mainController.syncGraphToSource);
    document.getElementById("syncSourceToGraphButton").addEventListener("click", mainController.syncSourceToGraph);
}

function initializeGraphAndSourceView() {
	graphViewController.initializeGraph(document.getElementById("graph_pane"));
	sourceViewController.initializeSourceView(document.getElementById("source_pane"));
}

function setGlobalErrorHandler() {
	window.onerror = function(messageOrEvent, source, lineNumber, colNumber, error) {
		alert(messageOrEvent);
	};
}
