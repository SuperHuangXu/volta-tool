import inquirer from 'inquirer'
import { execa } from 'execa'
import chalk from 'chalk'
import ora from 'ora'

const BRAND = chalk.hex('#8B5CF6')
const DIM = chalk.dim

function printBanner() {
  console.log()
  console.log(BRAND('  ╔══════════════════════════════╗'))
  console.log(BRAND('  ║') + chalk.bold('      ⚡ Volta Node Switch      ') + BRAND('║'))
  console.log(BRAND('  ╚══════════════════════════════╝'))
  console.log()
}

async function printCurrentVersions() {
  const spinner = ora({ text: DIM('读取版本信息…'), color: 'magenta' }).start()

  const { stdout: voltaOutput } = await execa('volta', ['ls', 'node', '--format', 'plain'])
  const lines = voltaOutput.split('\n')
  const defaultLine = lines.find((l) => l.includes('(default)'))
  const globalVersion = defaultLine?.match(/node@(\d+\.\d+\.\d+)/)?.[1] ?? 'unknown'

  let projectVersion = 'none'
  try {
    const fs = await import('fs')
    const pkgPath = `${process.cwd()}/package.json`
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const pinned = pkg?.volta?.node
    if (pinned) projectVersion = pinned
  } catch {
    // no package.json or no volta field
  }

  spinner.stop()

  const globalLabel = chalk.cyan('  全局 Node 版本')
  const projectLabel = chalk.yellow('  当前目录版本  ')

  const globalVal = chalk.bold.green(`v${globalVersion}`)
  const projectVal =
    projectVersion === 'none'
      ? chalk.dim('未固定')
      : chalk.bold.yellow(`v${projectVersion}`)

  console.log(chalk.dim('  ┌─────────────────────────────┐'))
  console.log(`  │ ${globalLabel}  ${globalVal}`)
  console.log(`  │ ${projectLabel}  ${projectVal}`)
  console.log(chalk.dim('  └─────────────────────────────┘'))
  console.log()
}

async function getVersionList() {
  const { stdout: lsAll } = await execa('volta', ['ls', 'node', '--format', 'plain'])
  return lsAll
    .split('\n')
    .map((line) => line.match(/node@(\d+\.\d+\.\d+)/)?.[1])
    .filter(Boolean) as string[]
}

function formatChoice(version: string) {
  return {
    name: chalk.bold(`v${version}`),
    value: version,
    short: `v${version}`,
  }
}

async function main() {
  printBanner()
  await printCurrentVersions()

  const spinner = ora({ text: DIM('获取本地 Node 列表…'), color: 'magenta' }).start()
  const nodeList = await getVersionList()
  spinner.stop()

  const { version } = await inquirer.prompt({
    type: 'list',
    name: 'version',
    message: chalk.cyan('切换到哪个版本？'),
    choices: nodeList.map(formatChoice),
    pageSize: 10,
  })

  console.log()
  const switching = ora({
    text: `${chalk.dim('正在切换到')} ${chalk.bold.green(`v${version}`)} ${chalk.dim('…')}`,
    color: 'green',
  }).start()

  const { exitCode, stdout, stderr } = await execa('volta', ['install', `node@${version}`])

  if (exitCode === 0) {
    switching.succeed(chalk.green(`已切换到 Node `) + chalk.bold.green(`v${version}`) + chalk.green(' ✔'))
  } else {
    switching.fail(chalk.red('切换失败') + chalk.dim(` ${stdout ?? stderr}`))
  }
  console.log()
}

main().catch((err) => {
  if (err.name === 'ExitPromptError') {
    process.exit(0)
  }
  console.error(chalk.red('错误:'), err.message ?? err)
  process.exit(1)
})
