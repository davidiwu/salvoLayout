

	var LayoutSlot = function (top, left, width, height) {
		this.top = 0,
		this.left = 0,
		this.width = 0,
		this.height = 0,
		"undefined" != typeof top && (this.top = top),
		"undefined" != typeof left && (this.left = left),
		"undefined" != typeof width && (this.width = width),
		"undefined" != typeof height && (this.height = height);
	};

	var Layout = function (name, width, height, length, slots, aspectRatio, ws) {
		this.name = "Unnamed",
		this.width = 0,
		this.height = 0,
		this.length = 0,
		this.slots = [],
		this.aspectRatio = 4 / 3,
		this.ws = false,
		"undefined" != typeof name && (this.name = name),
		"undefined" != typeof width && (this.width = width),
		"undefined" != typeof height && (this.height = height),
		"undefined" != typeof length && (this.length = length),
		"undefined" != typeof slots && (this.slots = slots),
		"undefined" != typeof aspectRatio && (this.aspectRatio = aspectRatio),
		"undefined" != typeof ws && (this.ws = ws);
	};
	
(function ($) {

	var layouts = [];
	layouts.push(new Layout("1 Camera Layout", 1, 1, 1, [new LayoutSlot(0, 0, 1, 1)], 4 / 3, !1));
	layouts.push(new Layout("4 Camera Layout", 4, 4, 4, [new LayoutSlot(0, 0, 2, 2), new LayoutSlot(0, 2, 2, 2),
				new LayoutSlot(2, 0, 2, 2), new LayoutSlot(2, 2, 2, 2)], 4 / 3, !1));
	layouts.push(new Layout("9 Camera Layout", 3, 3, 9, [new LayoutSlot(0, 0, 1, 1), new LayoutSlot(0, 1, 1, 1),
				new LayoutSlot(0, 2, 1, 1), new LayoutSlot(1, 0, 1, 1), new LayoutSlot(1, 1, 1, 1),
				new LayoutSlot(1, 2, 1, 1), new LayoutSlot(2, 0, 1, 1), new LayoutSlot(2, 1, 1, 1),
				new LayoutSlot(2, 2, 1, 1)], 4 / 3, !1));
	layouts.push(new Layout("7 Camera Layout", 4, 4, 7, [new LayoutSlot(0, 0, 2, 2), new LayoutSlot(0, 2, 2, 2),
				new LayoutSlot(2, 0, 2, 2), new LayoutSlot(2, 2, 1, 1), new LayoutSlot(2, 3, 1, 1),
				new LayoutSlot(3, 2, 1, 1), new LayoutSlot(3, 3, 1, 1)], 4 / 3, !1));
	layouts.push(new Layout("8 Camera Layout", 4, 4, 8, [new LayoutSlot(0, 0, 3, 3), new LayoutSlot(0, 3, 1, 1),
				new LayoutSlot(1, 3, 1, 1), new LayoutSlot(2, 3, 1, 1), new LayoutSlot(3, 0, 1, 1),
				new LayoutSlot(3, 1, 1, 1), new LayoutSlot(3, 2, 1, 1), new LayoutSlot(3, 3, 1, 1)], 4 / 3, !1));

	var uuid = new Date().getTime();

	$.fn.salvoViews = function (newLayouts, options) {
		
		if (!newLayouts) {
			newLayouts = [];
		}
		var allLayouts = $.merge($.merge([], layouts), newLayouts);				
		return this.each(function () {
			uuid += 1;

			var viewContainer = $(this);
			var viewElems = $('<div id="viewer-menu">\
									<div class="dropdown">\
										<button type="button" class="btn btn-default dropdown-toggle" id="layout-menu"\
										data-toggle="dropdown">\
											<span data-bind="label" id="layout-icon"></span>&nbsp;\
											<span id="layout-icon-text">View Layout</span>&nbsp;&nbsp;\
											<span class="caret"></span>\
										</button>\
										<div class="dropdown-menu dropdown-menu-right" aria-labelledby="layout-menu">\
											<div class="btn-group" role="group" aria-label="View Layout" id="' + uuid + '-layout-group"></div>\
										</div>\
									</div>\
								</div>')
				.appendTo(viewContainer);

			var panelContainer = $('<div />')
				.attr({
					id : uuid,
					class : 'layout-container'
				})
				.insertAfter(viewElems);

			panelContainer.salvoLayout(newLayouts, options);
			var instId = panelContainer.prop('id');

			var createSVGbutton = function (layout) {
				var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				$(svgElement).width(30);
				$(svgElement).height(30);
				var widthRatio = 30 / layout.width;
				var heightRatio = 30 / layout.height;
				$.each(layout.slots, function (index, value) {
					var svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					$(svgRect).attr({
						x : (value.left * widthRatio),
						y : (value.top * heightRatio),
						width : (value.width * widthRatio),
						height : (value.height * heightRatio)
					});
					$(svgElement).append($(svgRect));
					$(svgRect).attr({
						fill : 'white',
						stroke : 'black'
					});
				});
				return svgElement;
			};

			var createLayoutMenu = function () {
				var layoutGroup = $('#' + instId + '-layout-group');
				layoutGroup.empty();
				$.each(allLayouts, function (index, value) {
					var layoutBtn = $('<button type="button" class="btn btn-layout"></button>');
					layoutBtn.prop('id', instId + 'layout' + value.length);
					layoutBtn.prop('data-layoutId', value.length);
					layoutBtn.on('click', btnLayoutClick);
					layoutGroup.append(layoutBtn);
					var layoutDetail = $('<div class="layout-detail"></div>')
						.appendTo(layoutBtn);
					layoutDetail.append($(createSVGbutton(value)));
				});
			};

			var switchLayout = function (layoutId) {
				var layout = $.grep(allLayouts, function (element) {
						return element.length === layoutId;
					});
				var eventName = "switchLayoutEvent";
				panelContainer.trigger(eventName, [layout[0]]);
			};

			var switchToDefaultLayout = function () {
				var defaultLayout = $('#' + instId + 'layout1');
				defaultLayout.closest('.dropdown')
				.find('[data-bind="label"]')
				.empty()
				.append(defaultLayout.find('.layout-detail').clone());
				switchLayout(1);
			};

			var btnLayoutClick = function (e) {
				var tar = $(e.currentTarget);
				tar.closest('.dropdown')
				.find('[data-bind="label"]')
				.empty()
				.append(tar.find('.layout-detail').clone())
				.end()
				.find('.dropdown-toggle')
				.dropdown('toggle');

				var layoutId = tar.prop("data-layoutId");
				switchLayout(layoutId);
				return false;
			};

			createLayoutMenu();
			switchToDefaultLayout();
		});
	};

	$.fn.salvoLayout = function (options) {
		
		return this.each(function () {			
		
			var container = $(this);
			var instId = container.prop('id');

			var selectPanel = function (e) {
				var tar = $(e.currentTarget);
				tar.parent().children().each(function (index, value) {
					$(value).prop('style').removeProperty('outline')
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
					class : "default-salvo-panel"
				},
				playerBoxAttrs : {
					class : 'jwplayerBox',
				}
			};

			var settings = $.extend({}, defaults, options);
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
						.prop('id', instId + 'playerid' + j)
						.attr(settings.panelAttrs)
						.appendTo(container);
					var playerBox = $("<div />")
						.attr(settings.playerBoxAttrs)
						.prop('id', instId + 'jwplayer' + j)
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
