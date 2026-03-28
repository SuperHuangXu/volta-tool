import inquirer from 'inquirer'
import { execa } from 'execa'

async function main() {
  const nodeList = await getVersionList()
  const { version } = await inquirer.prompt({
    type: 'list',
    name: 'version',
    message: '选择本地 node 版本',
    choices: nodeList,
  })
  const { exitCode, stdout, stderr } = await installNode(version)
  if (exitCode === 0) {
    console.log('切换成功')
  } else {
    console.log('切换失败:', stdout ?? stderr)
  }
}

async function getVersionList() {
  const { stdout: lsAll } = await execa('volta', [
    'ls',
    'node',
    '--format',
    'plain',
  ])
  /**
   * runtime node@14.21.3 (default)
   * runtime node@16.20.2
   * runtime node@18.20.2
   * runtime node@20.12.1
   */
  return lsAll
    .split('\n')
    .map((line) => line.match(/node@(\d+\.\d+\.\d+)/)?.[1]) as string[]
}

function installNode(version: string) {
  return execa('volta', ['install', `node@${version}`])
}

main()
