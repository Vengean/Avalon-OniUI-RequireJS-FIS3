/**
 * Created by vengean on 15/10/23.
 *
 * 之所以再封装一层是为了封装自己产品的一些请求信息,同时不污染mmRequest本身
 */
define(['avalon',
    '../../components/md5/md5',
    '../../components/oniui/mmRequest/mmRequest',
    '../../components/oniui/cookie/avalon.cookie'], function (avalon, md5) {
    return {
        lock: {},
        domain: 'http://127.0.0.1:8080/asd_online/',
        xhr: function (params) {
            if (!params.url) {
                alert("缺少参数");
                return false;
            }
            var appId = avalon.cookie.get("asdO2OAppID"), appPwd = avalon.cookie.get("asdO2OAppPwd"), method = params.url, timestamp = (new Date()).getTime();
            var options = avalon.mix(true, {}, {
                data: {
                    "appID": appId,
                    "method": method,
                    "timestamp": timestamp,
                    "sign": md5.hex_md5(appPwd + appId + method + timestamp + "ascender_secret" + appPwd)
                },
                type: "GET",
                success: null,
                error: function () {
                    alert("网络异常");
                }
            }, params);
            //post请求防连续提交
            var that = this, key = options.url.match(/^(\S*?)(\?[\s\S]*)?$/);
            key = key && key[1];
            if (options.type.toLowerCase() != "get" && key && that.lock[key]) {
                return false;
            }
            key && (that.lock[key] = true);
            //发请求
            avalon.ajax({
                url: that.domain + options.url,
                data: options.data,
                type: options.type.toUpperCase(),
                dataType: 'json',
                success: function (json) {
                    if (json) {
                        if (json.resultCode == 500) {
                            alert("服务器崩溃了,一帮猴子正在紧急处理...");
                            return;
                        }
                        if (json.resultCode == 501) {
                            window.top.location.href = "/view/login/login.html";
                            return;
                        }
                        if (json.resultCode == 502) {
                            alert("您没有访问权限!")
                            return;
                        }
                        options.succ && options.succ(json);
                        window.setTimeout(function () {
                            key && (that.lock[key] = false);
                        }, 500);
                    } else {
                        options.err && options.err();
                        key && (that.lock[key] = false);
                    }
                },
                error: function (xhrequest) {
                    options.error && options.error(xhrequest);
                    key && (that.lock[key] = false);
                }
            });
        },
        post: function (params) {
            this.xhr(avalon.mix({}, params, {type: "POST"}));
        },
        get: function (params) {
            this.xhr(params);
        }
    };
});