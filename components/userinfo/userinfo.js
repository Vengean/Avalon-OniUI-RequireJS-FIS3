/**
 * Created by vengean on 15/10/21.
 */
define(['avalon',
    'text!../../components/userinfo/userinfo.html',
    'css!../../components/userinfo/userinfo.css',
    '../../components/oniui/dialog/avalon.dialog.js'], function (avalon, html) {
    var widget = avalon.ui.userinfo = function (element, data, vmodels) {

        var options = data.userinfoOptions;

        var vmodel = avalon.define(data.userinfoId, function (vm) {
            avalon.mix(vm, options);
            vm.$init = function () {
                element.innerHTML = html;
                avalon.scan(element, [vmodel].concat(vmodels));
                if (typeof options.onInit === "function") {
                    options.onInit.call(element, vmodel, options, vmodels)
                }

            };

            vm.$opts = {
                title: "Test modal dialog"
            };

            vm.sayHello = function (id) {
                avalon.vmodels[id].toggle = true;
            };

            vm.$remove = function () {
                element.innerHTML = "";
            };
        });

        return vmodel;
    };

    widget.defaults = {
        name: "unknown",
        imgUrl: __uri("no-pic.jpg"),
        content: "unknown"
    };

    return avalon;
});