$(document).ready(function() {
	var myData = vectors[selVecs[0]].data;
	$("#ViewTable").handsontable({
		data: myData,
		//startRows: 6,
		//startCols: 8
		minRows: 4,
		minCols: 4,
		startRows: 5,
		startCols: 5,
		rowHeaders: true,
		colHeaders: true,
		minSpareRows: 1,
		minSpareCols: 1,
		contextMenu: true,
		manualColumnResize: true,
		useFormula: true,   
		onChange: function (data, source) {
			if (source === 'loadData')
				return; 
			$("#DataConsole").text(JSON.stringify(data));
		}
	});	
});
$(function () {});