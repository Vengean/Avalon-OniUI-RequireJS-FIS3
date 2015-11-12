/**
 * Created by vengean on 15/10/13.
 */
fis.match('::packager', {
    spriter: fis.plugin('csssprites'),
    postpackager: fis.plugin('loader', {
        resourceType: 'amd',
        useInlineMap: true
    })
});

fis.match('*.{js,css,png,less}', {
    useHash: true
});

fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});

fis.match('*.js', {
    optimizer: fis.plugin('uglify-js')
    //isMod: true
});

fis.match('*.less', {
    rExt: '.css',
    parser: fis.plugin('less')
});

fis.match('*.{css,less}', {
    useSprite: true,
    optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
    optimizer: fis.plugin('png-compressor')
});

fis.media('debug').match('*.{js,css,png,less}', {
    useHash: false,
    useSprite: false,
    optimizer: null
});

fis.hook('amd', {
    paths: {
        jquery: 'vendor/jquery/jquery-1.11.3',
        avalon: "vendor/avalon/avalon.shim",
        text: 'vendor/require/text',
        domReady: 'vendor/require/domReady',
        css: 'vendor/require/css',
        md5: 'components/md5/md5',
        ajax: 'components/ajax/ajax'
    },
    shim: {
        jquery: {
            exports: "jQuery"
        },
        avalon: {
            exports: "avalon"
        }
    },
    globalAsyncAsSync: true
});

