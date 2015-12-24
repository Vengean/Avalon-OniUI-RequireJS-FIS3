/**
 * Created by vengean on 12/24/15.
 */
define(['avalon'], function (avalon) {
    var vm = avalon.define({
        $id: "center",
        msg: "Hello, This is center!"
    });

    return avalon.controller(function ($ctrl) {
        $ctrl.$vmodels = [];
    });
})