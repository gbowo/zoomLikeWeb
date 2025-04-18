# zoomLikeWeb

基于Next.js15的全栈开发类zoom网页项目。

**技术栈** : Next.js 15、Tailwind CSS 4、TypeScript、React

**本项目使用的组件库**:

1. 第三方登陆注册组件：clerk
2. CSS组件库：shadCN
3. 日期选择组件：react-datepicker
4. 加载动画组件：react-loading-indicator
5. 视频流组件：stream-react-sdk
6. 弹窗组件：shadCN-sonner
7. 卡片组件：shadCN-card
8. 下拉菜单组件：shadCN-dropdown-menu

**项目部署**: Vercel

**原型设计**：https://www.figma.com/design/LNsTB8B803svMccCH2gh0M/zoomLikeWeb?node-id=0-1&t=MNf4ytwWaUQQoOB1-1

**个人项目成果网址：** bloggbowo.xyz(国内地址，使用阿里云域名，cloudflare代理,用的之前做博客没用到的域名，后续可能失效)，gbowo-olmeeting-app.vercel.app/(使用vercel部署的网址，国内被墙)
截至2025/4/13，项目已完成基本开发，开源
**项目参考**: 国外克隆zoom项目lets-talk，感谢大佬开源。

**部署要注意的点**：
1. 先在项目根目录输入
```
npm install
```
2. 然后输入
```
npm run dev
```
3. 打开浏览器，输入以下网址即可看到项目运行效果。
```
http://localhost:3000
```
4. 如果开发时遇到项目不可预知错误，请根据以下指令重新加载依赖:
```
npm cache clean --force
rm -rf node_modules .next
npm install
npm run dev
```
5. 在本地运行项目请在项目根目录下添加.env.local文件，在里面输入以下内容，空白部分的key需要在组件官网上创建相应项目获取
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=
NEXT_PUBLIC_BASE_URL='http://localhost:3000'
```

可能（一定会遇到以下问题）：
   1. **你的clerk报红**：去clerk官网下依赖，创建一个免费项目，里面设计想要的认证方式，然后在本地项目根目录创建.env.local文件，在里面输入你的clerk项目publishable key和secret key，还有register和login对应的路由就可以了。
   ```
      npm install @clerk/nextjs # 安装指令
   ```
   2. **没安装shadCN依赖**：这个依赖是用来管理组件库的，在NavBar组件中用到了，需要安装一下。输入以下命令即可安装（或直接搜shadCN ui官网复制命令）后，它会自动添加utilities.ts文件，里面包含了cn函数。还有个坑是会报无法tail解析windcss-animate的错，这个如果直接运行项目的话应该不会报，因为我已经修复了，只是提醒下自己，要把globals.css文件里面的@import "tw-animate-css";暂时注释掉。**后面又可以解析了**
   ```
   npx shadcn@latest init
   ```
   3. **没安装shadCN dialog/textarea/input/button依赖**：同2，上官网搜dialog下载该组件，这个组件支撑了首页方块交互功能的实现
   ```
   npx shadcn@latest add dialog # 安装textarea就把dialog换成textarea/input/button就好
   ```
   4. **没安装React Datepicker依赖**：输入以下指令安装，官网有很多的日期选择模板，可以选择其中一个
   ```
   npm install react-datepicker --save # --save可省略
   ```
   5. **没安装react-loading-indicator依赖**:用来提供加载时动画的，输入以下指令安装
   ``` 
   npm install react-loading-indicators
   ```
   6. **没安装stream的前后端依赖**：搜索getstreamio官网，输入以下指令后导入包即可：
   ```
   // 后端依赖
   npm install @stream-io/node-sdk
   // or using yarn
   yarn add @stream-io/node-sdk

   // 前端依赖
   npm install @stream-io/video-react-sdk
   ```
   7. **没安装shadCN的toast依赖**：这个组件用来显示报错信息，官网有很多模板，输入以下指令即可安装，安装sonner是因为新版本shadCN官方将toast打包进了sonner中，用toast指令已经无法下载。
   ```
   npx shadcn@latest add sonner 
   ```
   8. **没安装shadCN的Card依赖**：同上 把add后面的换成card就好
   ```
   npx shadcn@latest add card
   ```
   9. **没安装shadCN的DropdownMenu依赖**：同上 把add后面的换成dropdown-menu就好
   ```
   npx shadcn@latest add dropdown-menu
   ```
   10. 完成项目后可以在vercel上部署（要翻墙才能访问部署后网址，可以使用cloudflare配置国内可访问域名）使用谷歌浏览器访问最佳
---------------------

## 开发（踩坑）日志

1. 在使用MenuItemCard组件时，通过props传递hoverColor，比如hover:bg-blue-800，但可能由于Tailwind的类名动态生成导致无法正确应用。Tailwind在构建时会清除未使用的类名，动态拼接的类名可能不会被识别，因此需要将悬停效果写在CSS即global.css文件中，再进行调用，而且不能全部写在globals.css的@apply内，要用transform、transition等单独写出来。
2. 之前的MenuItemCard使用了动态的${hoverColor}，这可能不起作用，因为Tailwind无法识别动态类名。正确的做法是在global.css文件中定义悬停状态，然后在MenuItemCard组件中调用。
3. 在CSS中统一处理悬停颜色，例如使用滤镜（filter）或亮度调整（brightness）来变暗颜色。例如： .menu-item-card:hover { filter: brightness(90%); } 这样无论原始颜色是什么，悬停时都会变暗。
4. 一句话概括，使用Tailwind的类似于hover的变体时，放弃使用动态类名，改用CSS文件定义悬停效果，并在组件中调用。颜色同理。
5. shadCN在Tailwind CSS4版本不完全兼容，给inputs设置css样式后在Mainmenu的设置行数为4的部分会失效,估计写在globals.css里也能解决，但是影响不大，先放着。**后续：发现框的宽度设置为弹性了，虽然宽度设置失效是事实但没啥影响。**
6. 后面发现连cursor pointer写在类名里也无法生效，一起提出来放进globals.css了，而且hover后颜色变深的那一段颜色设置因为优先级的问题会被cover掉，得设置成!important。（不是tailwind 4取消!important了吗怎么还能用）
7. 在 JavaScript 和 TypeScript 中，使用对象解构（Object Destructuring）时，将 user 用 {} 括起来是为了从一个对象中提取特定的属性。具体来说，const { user } = useUser(); 这行代码的目的是从 useUser 钩子返回的对象中提取 user 属性。
8. 开发完会议室设置和会议室页面后，发现会报这个错，原因在于客户端使用Token的时间早于Token的签发时间，我在Getstream上设置的新加坡时区，理论上应该没有太大误差，但还是会报这个错。翻了下国外社区发现我这个问题都没有人提出，最后问了下AI才发现Stream SDK的Node.js版本存在已知问题：当未显式设置 iat (issued at) 时，可能生成基于错误时间戳的 Token。所以我修改了服务端生成token的逻辑，显示设定签发时间（显式使用UTC时区，这一步最关键），并补偿1分钟的时间差，这样就可以保证token不会过期。
   ```
   // 错误信息如下
   StreamProvider.tsx:23 [client]: Failed to connect a user (0) Error: {"code":42,"StatusCode":401,"message":"WS failed with code: 42 and reason: JWTAuth error: token used before issue at (iat)","isWSFailure":false}
    at StableWSConnection.connect (connection.ts:135:17)
    at async StreamClient.connect (client.ts:645:12)
   ```
9. 设置会议室的那几个globals.css的样式，下划线是两个，不是一个，一个会导致样式不生效。后面我索性把按钮样式都抽取出来放进了globals.css，这样修改也方便调用也方便
10. 截至2025/4/13：项目基本完成，后续可能有一些细节调整，但基本功能已经实现。项目通过vercel部署到服务器上，分别配置了国内和国外的域名可访问，使用谷歌浏览器访问最佳，其他浏览器可能css有兼容性问题会发生部分偏移(目前发现用edge首页点击方块后出现的方框会偏右下，后续有空再修了)
11. 发现一个bug，使用国内网址虽然能登，但是会议分享链接还是基于Vercel自带的链接生成的，要打开会议链接还是要翻墙。