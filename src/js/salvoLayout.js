	
(function ($) {

	$.fn.salvoLayout = function (options) {
		
		return this.each(function () {			
		
			var container = $(this);
			var instId = container.prop('id');

			var selectPanel = function (e) {
				var tar = $(e.currentTarget);
				tar.parent().children().each(function (index, value) {
				    $(value).prop('style').removeProperty('outline');
				});				
				tar.css('outline', '2px solid black');
			};

			var defaults = {
				onPanelClicked : null,
				onPanelHovered : selectPanel,
				onPanelCreated : function () {},
				panelAttrs : {
					ondrop : "drop(event)",
					ondragover : "allowDrop(event)",
					'class' : "default-salvo-panel"
				},
				playerBoxAttrs : {
					'class' : 'jwplayerBox'
				}
			};

			var settings = $.extend(true, {}, defaults, options);
			var currentLayout;

			var calculateDimensionsForLayout = function (layout) {
				var availableHeight = container.height();
				var availableWidth = container.width();
				var height = availableHeight;
				var width = availableWidth;

				//width / layout.width / layout.aspectRatio > height / layout.height ? width = height / layout.height * layout.aspectRatio * layout.width : height = width / layout.width / layout.aspectRatio * layout.height;

				var slotHeight = height / layout.height;
				var slotWidth = width / layout.width;
				return {
					availableHeight : availableHeight,
					availableWidth : availableWidth,
					height : Math.round(height),
					width : Math.round(width),
					slotHeight : Math.round(slotHeight),
					slotWidth : Math.round(slotWidth),
					aspectRatio : layout.aspectRatio
				};
			};

			var panelDimensionsForLayout = function (layout) {
				var dimensions = calculateDimensionsForLayout(layout);
				var topOffset = (dimensions.availableHeight - dimensions.height) / 2;
				var panelDimensions = $.map(layout.slots, function (element) {
						var height = element.height * dimensions.slotHeight;
						var width = element.width * dimensions.slotWidth;
						var top = topOffset + element.top * dimensions.slotHeight;
						var left = element.left * dimensions.slotWidth;
						return {
							height : Math.round(height),
							width : Math.round(width),
							top : Math.round(top),
							left : Math.round(left)
						};
					});
				return panelDimensions;
			};

			var setPanelEvents = function (panel) {
				if (settings.onPanelClicked) {
					panel.on('click', settings.onPanelClicked);
				}
				if (settings.onPanelHovered) {
					panel.on('mouseover', settings.onPanelHovered);
				}
			};

			var createLayout = function (length) {
				var panels = container.children();
				var start = 0;
				if (panels.length) {
					var delta = panels.length - length;
					if (delta > 0) {
						for (var i = length; i < panels.length; i++) {
							$(panels[i]).remove();
						}
						return;
					} else {
						start = panels.length;
					}
				}
				for (var j = start; j < length; j++) {
					var panel = $("<div />")
						.prop('id', instId + '-playerid' + j)
						.attr(settings.panelAttrs)
						.appendTo(container);
					var playerBox = $("<div />")
						.attr(settings.playerBoxAttrs)
						.prop('id', instId + '-jwplayer' + j)
						.appendTo(panel);
					setPanelEvents(panel);
				}
			};

			var getPanelById = function (panelId) {
				var panels = container.children();
				if (panels.length && panelId < panels.length) {
					return panels[panelId];
				}
				return -1;
			};

			var onShowPanel = function (panelId, newHeight, newWidth, newTop, newLeft) {
				var panel = getPanelById(panelId);
				$(panel).css('top', newTop.toString() + "px");
				$(panel).css('left', newLeft.toString() + "px");
				$(panel).height(newHeight - 1);
				$(panel).width(newWidth - 1);
			};

			var resizeContainer = function () {
				var i,
				panelDimensions = panelDimensionsForLayout(currentLayout);
				for (i = 0; i < panelDimensions.length; i++) {
					onShowPanel(i, panelDimensions[i].height, panelDimensions[i].width, panelDimensions[i].top, panelDimensions[i].left);
				}
			};

			var switchLayout = function (layout) {
				currentLayout = layout;
				createLayout(layout.length);
				resizeContainer();
			};

			$(window).resize(resizeContainer);

			var eventName = "switchLayoutEvent";
			container.on(eventName, function (event, arg1) {
				switchLayout(arg1);
			});
		});
	};
}(jQuery));
