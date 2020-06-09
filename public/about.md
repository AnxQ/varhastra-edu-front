# 欢迎使用 Varhastra Edu 教学平台
## 项目构成
第一次写这种前后端完全隔离的项目，架构可能不甚完善，欢迎提供建议和Issue<br/>
技术栈如下
- 后端：
  - SpringBoot + MySQL + Redis 数据库存取和缓存
  - GraphQL-Java 提供向前端暴露的查询/修改/订阅API
  - Nginx 静态资源服务，本地反向代理（使得静态资源和API同域，也方便之后添加SSL支持、负载均衡）
- 前端：
  - VueJS + TypeScript 前端框架`
  - Vuetify 样式库
  - Vue-Apollo 网络传输，并处理Cookies，完成鉴权
## 特性
- 前后端绝对隔离，所有查询都是AJAX，可以将前端的Webpack部署于CDN，实现极快的启动速度。
- 由于GraphQL查询的优良特性，API十分易于调用，可以根据不同的页面场景，查询出不同的东西
- 后端大部分连表查询采用懒加载，并由Hibernate缓存，可以保证一定的并发性能
- 群组功能使用了WebSocket，不同于轮询，实现了真正的实时通讯；后段消息处理采用响应式Java核心，可以缓存任意时间内的消息，无需向数据库查询。
- 原生PDF浏览，H5视频播放器，因此建议使用Chromium内核的浏览器以获得最佳的体验。