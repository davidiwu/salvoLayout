
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

    var pluginName = 'smartView';

    var SmartView = function (uuid, element, newLayout, options) {

        if (!newLayout) {
            newLayout = [];
        }
        var allLayouts = $.merge($.merge([], layouts), newLayout);

        var viewContainer = $(element);
        viewContainer.empty();
        var panelContainer = $('<div />')
            .attr({
                id: 'container-' + uuid,
                'class': 'layout-container'
            });

        var salvoOwner = $('<div />')
            .attr({
                id: 'menu-' + uuid,
                'class': 'viewer-menu'
            })
            .appendTo(viewContainer);

        panelContainer.insertAfter(salvoOwner);
        panelContainer.salvoLayout(options);
        salvoOwner.salvoLayoutOwner(allLayouts, options, panelContainer);
    };


    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    // Prevent against multiple instantiations,
    // handle updates and method calls
    $.fn[pluginName] = function (options, newLayout, args) {
        var uuid = new Date().getTime();
        var result;

        this.each(function () {
            uuid += 1;

            var cachedThis = $.data(this, pluginName);
            if (typeof options === 'string') {
                if (!cachedThis) {
                    logError('Not initialized, can not call method : ' + options);
                }
                else if (!$.isFunction(cachedThis(options)) || options.charAt(0) === '_') {
                    logError('No such method : ' + options);
                } else {
                    if (!(args instanceof Array)) {
                        args = [args];
                    }
                }
            }
            else if (typeof options === 'boolean') {
                result = cachedThis;
            } else {
                $.data(this, pluginName, new SmartView(uuid, this, newLayout, options));
            }
        });
        return result || this;
    }
}(jQuery));
