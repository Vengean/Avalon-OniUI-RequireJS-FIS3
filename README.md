# Avalon-OniUI-RequireJS-FIS3
在开始写这篇说明之前，请允许我向以下人员致敬，是他们的指点才让我最终选择了这样的架构：

1. [@司徒正美](https://github.com/RubyLouvre) 去哪儿网前端架构师，AvalonJS、mass-Framework等框架的作者，著有《[Javascript框架设计](http://baike.baidu.com/link?url=xpRwJh3peIOv4-dLV6MA-ayaqqKMQ7AKX2fbH2EVDZPgiK5Xz2IEVb5cvG3K6iBwG7n4WLqv4l-v_7t-5W4E3vwbDU_H68PaBlVkyhODXo74F3bwE_dNeKi3vRxelqzG)》。

2. [@张云龙](https://github.com/fouber) 前百度工程师，FIS项目开发者之一，现任职UC。他在github上有几篇文章写得非常好，有兴趣可以一读[前端工程——基础篇](https://github.com/fouber/blog/issues/10)、[前端开发体系建设日记](https://github.com/fouber/blog/issues/2)，其他的文章可以关注他的github blog。

3. 以及Javascript罗浮宫5群所有给予我热心帮助的人。

## 为什么选择了Avalon
> “我们需要做一个O2O产品，但是我们的前端开发资源并不是很多，我希望能有一个框架像AngularJS那样简化前端人员的工作量，而且有很多现成的组件可以使用，并且要支持到IE8。” ——老板如是说

听完我的心拔凉拔凉的，这意味着我要放弃使用了两年的AngularJS了（IE8又增加了我对它的仇恨值），AngularJS 1.2版本虽然兼容IE8，但也有很多蛋疼的地方，并且核心团队不再解决IE8上的问题了。当然，放弃AngularJS并不仅仅只是兼容性问题，AngularJS其实我感觉还是比较适合做SPA（单页面应用程序），因为框架对于做多页应用来说我觉得显得有点杀鸡用牛刀的感觉（AngularJS其实有很多功能是用不上的，但不支持定制，而且整个框架不断添加一些东西最后就变得很重了）。另一方面是性能问题，饱受争议的脏值检查问题，当然这对于框架本身来说并不能说是缺点，但你没方法阻止开发人员滥用（不严格要求自己的码农随便到网上copy了些能实现自己功能的东西就这样commit了，最后有性能问题还是找架构师），AngularJS最大的优点是视图绑定，但也是缺点，在使用AngularJS的两年里，出现了很多页面层层嵌套绑定的情况，然后页面就卡死了，即使不卡，chrome打开的一个AngularJS Web App就占了900M内存。

其实老板的意思很明显了，我们需要一个支持IE8的MVVM或类似的框架，因为大家都用得很爽。度娘一遍，发现有以下几个框架：

1. [ReactJS](http://facebook.github.io/react/)：很多人拍手叫好，查了一些资料和Demo，发现ReactJS只是一个View，它很适合用来开发真正的Web Component，其JS + Html的写法个人不太喜欢，而且这和AngularJS的用法大相庭径（虽然要放弃AngularJS，但好歹也换个相似的免得学习成本太高），并且ReactJS要兼容IE8得加插件，不知道会遇到什么坑。

2. [BackboneJS](http://backbonejs.org/)：原生JS操作Dom，没有view binding，相当于jQuery + template，放弃。

3. [KnockoutJS](http://knockoutjs.com/)：微软团队出品，支持IE6，写法和AngularJS及其相似！！！我想这就是我需要的东西了...然后我发现KnockoutJS并没有什么UI库可以用，而且Google了一下发现有的评测显示其性能并不是很好（没有亲测，仅供参考）。![性能对比](https://github.com/Vengean/blog/blob/master/2015-11-12/performance.png?raw=true)

4. [VueJS](http://cn.vuejs.org/)：用法和Angular类似，体积小无依赖，有系统的文档和人气较高的社区...可惜不支持IE8，放弃。

5. [EmberJS](http://emberjs.com/)：它的logo（老鼠）还挺可爱的，虽然是与AngularJS相似的MVVM框架，但还是有很多地方不同，Handlebars的使用，使得DOM中充满了\<script>标记，有时很难分辨出哪些代码是自己的，对CSS样式和其它框架的整合也造成了一定影响，弃用。

6. [AvalonJS](http://avalonjs.github.io/)：写法和AngularJS极其相似，没有其它依赖，源码小，有一个[OniUI](http://ued.qunar.com/oniui/index.html)组件库，重要的是兼容到IE6！虽然文档比较乱社区也不是很活跃，但是能在Q群里联系到原作者，于是我心中突然有一种感觉：就是你了！

## 选好了框架/库，接下来就是考虑构建优化了
Web构建工具其实我只使用过Grunt和Yeoman，但是Team当中的开发人员基本就不知道有这些玩意，要重新学干脆考虑一下比较火的gulps，发现学习成本也不低，偶然发现了百度出品的[FIS3](http://fis.baidu.com/fis3/docs/beginning/intro.html)，这东西好就好在傻瓜式全套服务啊！就它了，还需要别的理由吗？

## 好了，构建优化也有了，接下来就是模块化开发框架了
为什么要模块化开发？分而治之！按需加载！组件重用！其实AvalonJS是自带模块加载器的，但是我暂时还没用过AvalonJS，不知道其AMD规范是否和RequireJS一样，担心FIS3对其AMD支持不够（后来发现这种担心可能是多余的，有兴趣的朋友可以试试直接用自带的加载器），所以选择了第三方的模块加载器RequireJS，并使用AvalonJS Shim版本（去掉模块加载器的版本）

## 组件开发
不重复造轮子，在面向对象编程中是很重要的思想（虽然我没有对象），如果什么组件都自己写，估计加班狗永远都找不到对象了，于是为了能找到对象，我们要充分利用好面向对象思想。[OniUI](http://ued.qunar.com/oniui/index.html)拥有丰富的组件库，丑是丑了点...但是有需求可以自己快速修改（分而治之的优势体现出来了）。FIS3很好的支持了内容嵌入，这样有很多Template组件就可以很方便被嵌入到页面了，比如页头和页脚。

## 关于这个框架的使用
下面将简单介绍一下这个框架的使用以及需要注意的地方（我想最大的意义不在于这个框架本身，而在于搭建这个框架过程中遇到的问题及解决办法）。

### 目录结构
![目录](https://github.com/Vengean/blog/blob/master/2015-11-12/project_direct.png?raw=true)

工程目录下面有四个子目录和一个名为'fis-config.js'文件，'fis-config.js'是[FIS3](http://fis.baidu.com/fis3/docs/beginning/intro.html)构建所需的配置文件，详细用法见官方文档，注意点我会在后面说。components用于存放组件，既可以是交互组件（widget）也可以是功能组件（如自己封装的ajax）。statics用于存放静态资源文件（images、css等）。vendor用于存放第三方库文件（avalon、jquery、require等）。views用于存放业务视图（包括业务自身相关的html、css、javascript文件），按照业务模块我们又分为module（如home、welcome等）。

### 运行demo
FIS3的安装请参考官网文档，这里不再赘述。建议用Webstorm打开工程，首先你要安装fis3-amd-hook、fis-parser-less、fis3-postpackager-loader等插件并打开自带终端Terminal，在终端输入fis3 release命令行开始构建（默认是发布到FIS3自带的server目录，你可以加上参数-d path指定构建目录，不够前期需要调试还是默认自带目录比较方便），然后通过命令行fis3 server start就可以run demo了，默认浏览地址是http://127.0.0.1:8080 ，但是端口号有可能被占用了，你可以通过参数-p指定端口号，打开demo目录下的demo.html，就可以浏览到demo了。

### demo说明
这个demo结合FIS3介绍了一些avalon的基本用法，比如双向绑定，模板，路由，使用OniUI以及编写自定义Avalon组件。需要注意的是，使用avalon路由mmState（路由里面需要require支持）的时候由于用到了FIS3的构建插件fis3-hook-amd，所以在构建的时候它会根据amd编程规范生成一个map去映射文件路径，就是相当于require里面的paths配置，一开始以为是这个插件的issue，所以报了个[issue](https://github.com/fex-team/fis3-hook-amd/issues/13)给插件开发者，错怪了它，大家可以看看这个issue的对话，就明白了。所以，如果你是动态配置路径，一定要这样配置path：
> 在js文件最顶端加注释@require.async "../welcome/welcome.js" 然后用__moduleID说明要处理的url，controllerUrl: __moduleId("../welcome/welcome.js")

## 总结
这个简易的框架只是一次简单的尝试，尤其是希望把avalon和fis3结合使用的人，对于打包，avalon的作者是提倡使用webpack的，所以这个demo仅供大家作为选用框架的参考，有说得不对的地方还请大家指教。
