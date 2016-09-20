
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

var createSVGbutton = function (layout) {
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    //$(svgElement).attr('viewbox', '0 0 100 100');
    $(svgElement).width(30);
    $(svgElement).height(30);

    var widthRatio = 30 / layout.width;
    var heightRatio = 30 / layout.height;

    $.each(layout.slots, function (index, value) {
        var svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        $(svgRect).attr({
            x: (value.left * widthRatio),
            y: (value.top * heightRatio),
            width: (value.width * widthRatio),
            height: (value.height * heightRatio)
        });
        $(svgElement).append($(svgRect));
        $(svgRect).attr({ fill: 'white', stroke: 'black' });
    });
    return svgElement;
};

var createLayoutMenu = function () {
    var layoutGroup = $('#layout-group');
    layoutGroup.empty();
    $.each(layouts, function (index, value) {
        var template = $('#hidden-layout').html();
        var layoutBtn = $(template).clone();
        $(layoutBtn).prop('id', 'layout' + value.length);
        layoutGroup.append(layoutBtn);
        var svgContainer = $(layoutBtn).find('.layout-detail');
        $(svgContainer).append($(createSVGbutton(value)));
    });
};

var calculateDimensionsForLayout = function (layout) {
    var rightNode = $("#layout-container");

    var availableHeight = rightNode.height();
    var availableWidth = rightNode.width();

    var height = availableHeight;
    var width = availableWidth;

    //width / layout.width / layout.aspectRatio > height / layout.height ? width = height / layout.height * layout.aspectRatio * layout.width : height = width / layout.width / layout.aspectRatio * layout.height;

    var slotHeight = height / layout.height;
    var slotWidth = width / layout.width;
    return {
        availableHeight: availableHeight,
        availableWidth: availableWidth,
        height: Math.round(height),
        width: Math.round(width),
        slotHeight: Math.round(slotHeight),
        slotWidth: Math.round(slotWidth),
        aspectRatio: layout.aspectRatio
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
            height: Math.round(height),
            width: Math.round(width),
            top: Math.round(top),
            left: Math.round(left)
        };
    });
    return panelDimensions;
};

var selectPanel = function (e) {
    $('.default-salvo-panel').each(function (index, value) { $(value).prop('style').removeProperty('outline') });
    var tar = $(e.currentTarget);
    tar.css('outline', '2px solid black');
};

var createLayout = function (length) {
    var container = $('#layout-container');
    var panels = $('.default-salvo-panel');
    var start = 0;
    if (panels.length) {
        var delta = panels.length - length;
        if (delta > 0) {
            for (var i = length; i < panels.length; i++) {
                $(panels[i]).remove();
            }
            return;
        }
        else {
            start = panels.length;
        }
    }
    for (var j = start; j < length; j++) {
        var template = $('#hidden-template').html();
        var panel = $(template).clone();
        $(panel).prop('id', 'playerid' + j);
        $(panel).find('.jwplayerBox').prop("id", 'jwplayer' + j);
        container.append(panel);
        $('#playerid' + j).on('mouseover', selectPanel);
    }
};

var getPanelById = function (panelId) {
    var panels = $('.default-salvo-panel');
    if (panels && panelId < panels.length) {
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

var currentLayout = layouts[0];

var resizeContainer = function () {
    var i, panelDimensions = panelDimensionsForLayout(currentLayout);
    for (i = 0; i < panelDimensions.length; i++) {
        onShowPanel(i, panelDimensions[i].height, panelDimensions[i].width, panelDimensions[i].top, panelDimensions[i].left);
    }
};

var switchLayout = function (layoutId) {
    var layoutLength = parseInt(layoutId.substr(6), 10);
    var layout = $.grep(layouts, function (element) {
        return element.length === layoutLength;
    });
    currentLayout = layout[0];
    createLayout(layoutLength);
    resizeContainer();
};

var switchToDefaultLayout = function () {
    var defaultLayout = $('#layout1');
    defaultLayout.closest('.dropdown')
                .find('[data-bind="label"]')
                .empty()
                .append(defaultLayout.find('.layout-detail').clone());
    switchLayout('layout1');
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

    var layoutId = tar.attr("id");
    switchLayout(layoutId);
    return false;
};

$(document).ready(function () {

    createLayoutMenu();

    $('.btn-layout').on('click', btnLayoutClick);

    switchToDefaultLayout();
});

$(window).resize(resizeContainer);
