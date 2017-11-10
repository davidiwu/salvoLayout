# salvoLayout

	a javascript library to create pre-defined layouts, 
	also can accept to add new layouts following the layout definition

# function:

	1. Create pre-defined layout

	2. Switch layout 

	3. If follow the layout definition, can accept and add more layouts 

# Usage:

	<-- html code -->

		<div id="viewer-container">
		</div>

		<div class="viewer-container">
		</div>
		<div class="viewer-container">
		</div>

	<-- js code -->

		$('#viewer-container').smartView();

		$('.viewer-container').smartView();	
