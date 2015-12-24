/**
 * Created by vengean on 15/11/13.
 */
define(["avalon", "css!./welcome.css"], function (avalon) {
    var vm = avalon.define({
        $id: "welcome",
        msg: "Hello This is welcome!"
    });

    return avalon.controller(function ($ctrl) {
        $ctrl.$vmodels = [];
    });
});