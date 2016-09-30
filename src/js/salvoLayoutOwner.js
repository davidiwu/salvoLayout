
(function ($) {

    $.fn.salvoLayoutOwner = function (allLayouts, options, panelContainer) {

		return this.each(function () {

			var viewContainer = $(this);
			var instId = viewContainer.prop('id');
			var viewElems = $('<div class="dropdown">\
									<button type="button" class="btn btn-default dropdown-toggle layout-menu" data-toggle="dropdown">\
											<span data-bind="label" class="layout-icon"></span>&nbsp;\
											<span class="layout-icon-text">View Layout</span>&nbsp;&nbsp;\
											<span class="caret"></span>\
									</button>\
									<div class="dropdown-menu pull-right" aria-labelledby="layout-menu">\
										 <div class="btn-group" role="group" aria-label="View Layout" id="' + instId + '-layout-group"></div>\
									</div>\
								</div>')
				.appendTo(viewContainer);

			var createSvgButton = function (layout) {
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

			var switchLayout = function (layoutId) {
				var layout = $.grep(allLayouts, function (element) {
						return element.length === layoutId;
					});
				var eventName = "switchLayoutEvent";
                if(panelContainer) {
                    panelContainer.trigger(eventName, [layout[0]]);
                }
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

			var createLayoutMenu = function () {
				var layoutGroup = $('#' + instId + '-layout-group');
				layoutGroup.empty();
				$.each(allLayouts, function (index, value) {
					var layoutBtn = $('<button type="button" class="btn btn-layout"></button>');
					layoutBtn.prop('id', instId + '-layout' + value.length);
					layoutBtn.prop('data-layoutId', value.length);
					layoutBtn.on('click', btnLayoutClick);
					layoutGroup.append(layoutBtn);
					var layoutDetail = $('<div class="layout-detail"></div>')
						.appendTo(layoutBtn);
					layoutDetail.append($(createSvgButton(value)));
				});
			};

			var switchToDefaultLayout = function () {
				var defaultLayout = $('#' + instId + '-layout1');
				defaultLayout.closest('.dropdown')
				.find('[data-bind="label"]')
				.empty()
				.append(defaultLayout.find('.layout-detail').clone());
				switchLayout(1);
			};

			createLayoutMenu();
			switchToDefaultLayout();
		});
	};
}(jQuery));
