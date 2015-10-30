/*
Manvir Singh
Everything Equation
5/25/15
*/

"use strict";

(function() {
	
	var ROWS = 17;
	var COLUMNS = 106;
	
	var pixels;
	var rightMouseDown;
	var leftMouseDown;
	
	window.onload = function() {
		pixels = new Array();
		for (var i = 0; i < COLUMNS; i++)
			pixels[i] = new Array();
		
		rightMouseDown = 0;
		leftMouseDown = 0;
		
		setupPage();
		var x = getURLParameter("x");
		document.getElementById("textarea").value = x;
		updateCanvas();
		updateTextArea();
	}
	
	function setupPage() {
		setupCanvas();
		var textarea = document.getElementById("textarea");
		textarea.onkeypress = isNumberKey;
		textarea.onkeyup = function(e){
			e = e || event;
			if (e.keyCode === 13) //is enter key
				updateCanvas();
			return true;
		}
		
		document.getElementById("submit").onclick = updateCanvas;
		document.getElementById("clear").onclick = clear;
		document.getElementById("invert").onclick = function() {
			for (var i = 0; i < COLUMNS; i++)
				for (var j = 0; j < ROWS; j++)
					pixels[i][j] = !pixels[i][j];
			drawAll();
			updateTextArea();
		};
		drawAll();
	}
	
	function setupCanvas() {
		var canvas = document.getElementById("canvas");
		canvas.addEventListener("mousemove", draw, false);
		canvas.addEventListener('contextmenu', function(evt) { evt.preventDefault(); }, false);
		
		document.onmousedown = function(e) {
			if (e.button == 0)
				leftMouseDown = 1;
			else if (e.button == 2)
				rightMouseDown = 1;
			draw();
		}
		document.onmouseup = function(e) {
			leftMouseDown = 0;
			rightMouseDown = 0;
		}
	}
	
	function updateTextArea() {
		var string = "0b";
		for (var i = 0; i < COLUMNS; i++) {
			for (var j = 0; j < ROWS; j++) {
				if (pixels[i][j])
					string += "1";
				else
					string += "0";
			}
		}
		var number = BigInteger.parse(string);
	    number = number.multiply(ROWS);
		textarea.value = number.toString(10).replace(/(\d{3})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
		updateTextField();
	}
	
	function updateCanvas(event) {
		var number = BigInteger.parse(textarea.value.replace(/\s/g, ''));
		number = number.quotient(ROWS);
		var string = number.toString(2);
		
		var numZeros = COLUMNS * ROWS - string.length;
		var zeros = "";
		for (var i = 0; i < numZeros; i++)
			zeros += "0";
		
		string = zeros + number.toString(2);
		
		for (var i = 0; i < COLUMNS; i++) {
			for (var j = 0; j < ROWS; j++) {
				if (string.charAt(ROWS * i + j) == "1")
					pixels[i][j] = true;
				else
					pixels[i][j] = false;
			}
		}
		drawAll();
		updateTextArea();
	}
	
	function updateTextField() {
		var url = window.location.href.split("?")[0];
		var x = document.getElementById("textarea").value.replace(/\s/g, '');
		if (x != "")
			url += "?x=" + x;
		document.getElementById("textfield").value = url;
	}
	
	function isNumberKey(evt){
		var charCode = (evt.which) ? evt.which : event.keyCode;
		if ((charCode < 48 || charCode > 57) && charCode != 32)
			return false;
		return true;
	}
	
	function clear() {
		textarea.value = "";
		for (var i = 0; i < COLUMNS; i++)
			for (var j = 0; j < ROWS; j++)
				pixels[i][j] = false;
		drawAll();
		updateCanvas();
		updateTextField();
	}
	
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}
	
	function draw() {
		if (leftMouseDown || rightMouseDown) {
			var canvas = document.getElementById("canvas");
			var rect = canvas.getBoundingClientRect();
			var x = Math.floor((event.x - rect.left) / 14);
			var y = Math.floor((event.y - rect.top) / 14);
			if (x >= 106) x = 105;
			
			if (leftMouseDown)
				pixels[x][ROWS - y - 1] = true;
			else if (rightMouseDown)
				pixels[x][ROWS - y - 1] = false;
			
			var context = canvas.getContext("2d");
			if (pixels[x][ROWS - y - 1])
				context.fillStyle = "#000000";
			else
				context.fillStyle = "#FFFFFF";
			context.fillRect(x * 14, y * 14, 14, 14);
			
			drawGrid();
			updateTextArea();
		}
	}
	
	function drawAll() {
		var context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < COLUMNS; i++) {
			for (var j = 0; j < ROWS; j++) {
				if (pixels[i][j]) context.fillStyle = "#000000";
				else context.fillStyle = "#FFFFFF";
				context.fillRect(i * 14, (ROWS - j - 1) * 14, 14, 14);
			}
		}
		drawGrid();
	}
	
	function drawGrid() {
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");
		var opts = {
		  distance : 14,
		  lineWidth : 1,
		  gridColor  : "#000000",
		  caption : false
		};
		new Grid(opts).draw(context);
	}
	
})();