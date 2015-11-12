# Avalon-OniUI-RequireJS-FIS3
在开始写这篇说明之前，请允许我向以下人员致敬，是他们的指点才让我最终选择了这样的架构：

1. [@司徒正美](https://github.com/RubyLouvre) 去哪儿网前端架构师，AvalonJS、mass-Framework等框架的作者，著有《[Javascript框架设计](http://baike.baidu.com/link?url=xpRwJh3peIOv4-dLV6MA-ayaqqKMQ7AKX2fbH2EVDZPgiK5Xz2IEVb5cvG3K6iBwG7n4WLqv4l-v_7t-5W4E3vwbDU_H68PaBlVkyhODXo74F3bwE_dNeKi3vRxelqzG)》。

2. [@张云龙](https://github.com/fouber) 前百度工程师，FIS项目开发者之一，现任职UC。他在github上有几篇文章写得非常好，有兴趣可以一读[前端工程——基础篇](https://github.com/fouber/blog/issues/10)、[前端开发体系建设日记](https://github.com/fouber/blog/issues/2)，其他的文章可以关注他的github blog。

3. 以及Javascript罗浮宫5群所有给予我热心帮助的人。

## 为什么选择了Avalon
> “我们需要做一个O2O产品，但是我们的前端开发资源并不是很多，我希望能有一个框架像AngularJS那样简化前端人员的工作量，而且有很多现成的组件可以使用，并且要支持到IE8。” ——老板如是说

听完我的心拔凉拔凉的，这意味着我要放弃使用了两年的AngularJS了（IE8又增加了我对它的仇恨值），AngularJS 1.2版本虽然兼容IE8，但也有很多蛋疼的地方，并且核心团队不再解决IE8上的问题了。当然，放弃AngularJS并不仅仅只是兼容性问题，AngularJS其实我感觉还是比较适合做SPA（单页面应用程序），因为框架对于做多页应用来说我觉得显得有点杀鸡用牛刀的感觉（AngularJS其实有很多功能是用不上的，但不支持定制，而且整个框架不断添加一些东西最后就变得很重了）。另一方面是性能问题，饱受争议的脏值检查问题，当然这对于框架本身来说并不能说是缺点，但你没方法阻止开发人员滥用（不严格要求自己的码农随便到网上copy了些能实现自己功能的东西就这样commit了，最后有性能问题还是找架构师），AngularJS最大的优点是视图绑定，但也是缺点，在使用AngularJS的两年里，出现了很多页面层层嵌套绑定的情况，然后页面就卡死了，即使不卡，chrome打开的一个AngularJS Web App就占了900M内存。

其实老板的意思很明显了，我们需要一个支持IE8的MVVM或类似的框架，因为大家都用得很爽。于是我上网查了一下现在有哪些其它的MVVM框架
