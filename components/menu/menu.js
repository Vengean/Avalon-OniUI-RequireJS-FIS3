/**
 * Created by vengean on 15/11/13.
 */
define(['avalon',
    'text!../../components/menu/menu.html',
    'css!../../components/menu/menu.css',
    "../../components/oniui/mmRouter/mmState"], function (avalon, html) {
    var widget = avalon.ui.menu = function (element, data, vmodels) {

        var options = data.menuOptions;

        var vmodel = avalon.define(data.menuId, function (vm) {
            avalon.mix(vm, options);
            vm.$init = function () {
                element.innerHTML = html;
                var items = options.items;
                if (items && items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var subs = items[i].subs;
                        if (subs && subs.length > 0) {
                            for (var j = 0; j < subs.length; j++) {
                                avalon.state(subs[j].name, {
                                    url: subs[j].url,
                                    views: {
                                        "": {
                                            templateUrl: subs[j].templateUrl,
                                            controllerUrl: subs[j].controllerUrl
                                        }
                                    }

                                });
                            }
                        } else {
                            avalon.state(items[i].name, {
                                url: items[i].url,
                                views: {
                                    "": {
                                        templateUrl: items[i].templateUrl,
                                        controllerUrl: items[i].controllerUrl
                                    }
                                }
                            });
                        }
                    }
                }

                avalon.router.errorback = options.errorback;
                //启动路由
                avalon.history.start({
                    basepath: location.pathname.split("avalon.mmRouter")[0],
                    fireAnchor: true
                });

                avalon.router.go(options.default, {}, {replace: true});

                avalon.scan(element, [vmodel].concat(vmodels));
                if (typeof options.onInit === "function") {
                    options.onInit.call(element, vmodel, options, vmodels)
                }

            };

        });

        return vmodel;
    };

    widget.defaults = {
        items: [],
        errorback: null,
        default: ""
    };

    return avalon;
});