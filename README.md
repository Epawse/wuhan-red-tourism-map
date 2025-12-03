# 武汉红色旅游地图故事 (Wuhan Red Tourism Map Story)

![Project Preview](main.png)

本项目是一个基于 Web 的交互式地图应用，旨在通过“地图故事”的形式可视化展示武汉市的红色旅游线路。项目结合了叙事元素与空间数据，引导用户探索历史地标与文化遗迹。

## 技术架构

本项目已从传统的静态 HTML/jQuery 代码库现代化重构为基于 Vue 3 的单页应用 (SPA)，技术栈如下：

- **核心框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **开发语言**: TypeScript
- **地图引擎**: Leaflet (集成高德卫星瓦片)
- **状态管理**: Vue Reactivity System
- **路由管理**: Vue Router
- **数据处理**: PapaParse (CSV 解析)

## 功能特性

- **交互式地图**: 集成全屏卫星底图，并针对武汉市区域进行了掩膜处理，突出显示核心区域。
- **路线导航**: 通过悬浮式顶部导航栏切换不同的红色旅游主题线路。
- **景点详情**: 提供详细的地点标记（Marker），支持查看景点介绍与历史背景。
- **轨迹可视化**: 集成高德地图 API，动态绘制地点间的步行路径动画（蛇形线效果）。
- **现代化 UI**: 采用卡片式设计与毛玻璃（Glassmorphism）效果，提供流畅的平移、缩放与列表交互体验。

## 项目结构

```
src/
├── assets/             # 静态资源（图片、图标）
├── components/         # 可复用 Vue 组件 (如 MapContainer)
├── router/             # 路由配置
├── types/              # TypeScript 类型定义
├── utils/              # 工具脚本与 Leaflet 插件适配
├── views/              # 主要视图页面 (RedTourismView)
├── App.vue             # 根组件
├── main.ts             # 入口文件
└── style.css           # 全局样式
public/
├── data/               # GeoJSON 地理数据与 CSV 业务数据
└── images/             # 地图相关图标资源
```

## 安装与运行

请确保您的环境中已安装 Node.js (v18+)。

1.  **安装依赖**:
    ```bash
    npm install
    ```

2.  **启动开发服务器**:
    ```bash
    npm run dev
    ```

3.  **构建生产版本**:
    ```bash
    npm run build
    ```
    构建产物将输出至 `dist/` 目录。

## 许可证

遵循 MIT 开源协议。
