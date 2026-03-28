# volta-tool

一个基于 [Volta](https://volta.sh/) 的交互式 Node.js 版本切换工具，通过简洁的命令行菜单快速切换已安装的 Node 版本。

## 功能

- 自动列出本地所有通过 Volta 安装的 Node.js 版本
- 交互式选择菜单，操作直观
- 一键切换全局默认 Node 版本

## 前提条件

- 已安装 [Volta](https://volta.sh/)
- 通过 Volta 安装了至少一个 Node.js 版本

## 安装

```bash
pnpm install
```

## 使用

```bash
pnpm dev
```

运行后会出现交互式菜单，列出本机所有已安装的 Node.js 版本，选择后即切换为全局默认版本。

## 构建

```bash
pnpm build
```

构建产物输出至 `dist/` 目录，可直接通过 `node .` 运行。

## 技术栈

- [TypeScript](https://www.typescriptlang.org/)
- [inquirer](https://github.com/SBoudrias/Inquirer.js) — 交互式命令行 UI
- [execa](https://github.com/sindresorhus/execa) — 子进程执行

## License

MIT
