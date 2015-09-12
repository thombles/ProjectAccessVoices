function createHistogram(divId, values, maxBars, invertColours) {
	var div = $("#" + divId);
	div.addClass("histogram");
	
	var midDiv = $("<div>").addClass("midline");
	div.append(midDiv);
	
	for (var i = 0; i < values.length; i++) {
		var value = values[i];
		// Go from 1-6 to 1-3 and 5-7
		if (value >= 4) {
			value += 1;
		}
		// Convert to -3 to -1 or +1 to +3
		var value = value - 4;
		// How many blocks are we going to show above or below the axis?
		var blockCount = Math.abs(value);
		var heightPercent = "8%";
		var widthPercent = (60 / maxBars - 2) + "%";
		
		// Indicate the value with one rectangular block per unit
		for (var j = 0; j < blockCount; j++) {
			var verticalOffset = j * 10;
			var bar = $("<div>");
			bar.addClass("bar");
			bar.css("height", heightPercent);
			bar.css("width", widthPercent);
			
			// 
			if (value > 0) {
				var bottom = (50 + verticalOffset) + "%";
				bar.css("bottom", bottom);
			} else {
				var top = "calc(50% + 1px + " + verticalOffset +"%)";
				bar.css("top", top);
			}
			var leftPercent = (10 + 10 + 1 + i*(60 / maxBars)) + "%";
			bar.css("left", leftPercent);
			
			// If it's the last column, colourise it
			if (i + 1 == values.length)
			{
				if (value > 0 && !invertColours || value < 0 && invertColours) {
					bar.addClass("green");
				} else {
					bar.addClass("red");
				}
			}
			
			div.append(bar);
		}
	}
}

