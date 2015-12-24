/**
 * Created by vengean on 15/11/13.
 */
define(['avalon'], function (avalon) {
    var vm = avalon.define({
        $id: "home",
        msg: "Hello, This is home!"
    });

    return avalon.controller(function ($ctrl) {
        $ctrl.$vmodels = [];
    });
});