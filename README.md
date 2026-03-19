# trip

一个基于 Java 11 内置 HTTP 服务实现的中文旅行攻略网站首版，聚焦中国 10 大热门旅游景点，包含首页、景点列表页、景点详情页、关于页和联系反馈页。

## 功能概览

- 首页主视觉与热门景点推荐
- 10 大热门景点统一攻略展示
- 景点列表筛选与关键词搜索
- 独立详情页展示亮点、路线、门票、交通、美食、住宿与贴士
- 响应式布局，适配桌面端和移动端

## 运行方式

### 方式一：使用 Maven

```bash
mvn compile
mvn exec:java
```

默认启动地址：`http://localhost:8080`

### 方式二：使用 IDE

直接运行 `com.example.App`。

## 目录说明

- `src/main/java/com/example/App.java`：网站启动入口与静态资源服务
- `src/main/resources/site/`：前端页面、样式、脚本与景点数据
- `旅行攻略网站需求.md`：需求细化文档

## 页面清单

- `/index.html`：首页
- `/attractions.html`：景点列表页
- `/detail.html?id=forbidden-city`：景点详情页示例
- `/about.html`：关于我们
- `/contact.html`：联系反馈

