/**
 * Created by vengean on 15/10/19.
 * @require.async "../welcome/welcome.js"
 * @require.async "../home/home.js"
 * @require.async "../center/center.js"
 */
require(["avalon", "domReady!", "ajax",
    "../../components/oniui/fileuploader/avalon.fileuploader",
    "../../components/userinfo/userinfo",
    "../../components/menu/menu"], function (avalon, domReady, ajax) {
    var vm1 = avalon.define({
        $id: "first",
        msg: "Hello Avalon!",
        alertMsg: function () {
            alert(vm1.array[1]);
        },
        array: [1, 2, 3]
    });

    var vm2 = avalon.define({
        $id: "testSkip",
        msg: "Normally, this message should be skip.",
        skipAttr: "This attribute would not be displayed."
    });

    var vm3 = avalon.define({
        $id: "testTpl",
        tpl: "tpl2.html"
    });

    var vm4 = avalon.define({
        $id: "testBinding",
        text: "<p>binding text</p>"
    });

    var vm5 = avalon.define({
        $id: ""
    });

    var vm6 = avalon.define({
        $id: "testWidget",
        $uploaderOptions: {
            addButtonText: "添加文件",
            uploadButtonText: "开始上传",
            acceptFileTypes: "image.*,*.txt,*.js",
            serverConfig: {
                url: "../../Handler1.ashx",
                userName: undefined,
                password: undefined,
                keyGenUrl: "../../getFileKey.ashx"
            },
            onFileOverSize: function (fileObj) {
                alert(fileObj.name + "超出了文件尺寸限制")
            },
            onFilePoolOverSize: function (fileObj, poolSize) {
                alert("文件缓存池达已满，不能继续添加文件。")
            },
            onSameFileAdded: function () {
                alert("不能添加相同的文件");
            },

            enableDragDrop: true,
            enableRemoteKeyGen: false,
            chunked: true,
            chunkSize: 1024 * 1024
        }
    });

    var vm7 = avalon.define({
        $id: "testCustomWidget",
        userinfo: {
            name: "Vengean",
            imgUrl: __uri("../../statics/images/user-photo.jpeg"),
            content: "I'm a programmer."
        }
    });

    var vm8 = avalon.define({
        $id: "testMenu",
        $menuOpts: {
            items: [{
                title: "测试菜单1",
                name: "welcome",
                active: true,
                subs: [
                    {
                        title: "子菜单1",
                        name: "welcome",
                        url: "/welcome",
                        templateUrl: "/views/welcome/welcome.html",
                        controllerUrl: __moduleId("../welcome/welcome.js")
                    },
                    {
                        title: "子菜单2",
                        name: "center",
                        url: "/center",
                        templateUrl: "/views/center/center.html",
                        controllerUrl: __moduleId("../center/center.js")
                    }
                ]
            }, {
                title: "测试菜单1",
                name: "home",
                url: "/home",
                templateUrl: "/views/home/home.html",
                controllerUrl: __moduleId("../home/home.js")
            }],
            errorback: function () {
                avalon.router.go("home", {}, {replace: true});
            },
            default: "welcome"

        }
    });
    /*ajax.get({
     url: "user/login",
     data: {
     inputID: "admin",
     userPwd: "123456",
     keepAlive: true
     },
     succ: function(json) {
     console.log(json);
     },
     err: function(json) {
     console.log(json);
     }
     });*/

    avalon.scan(document.body);
});