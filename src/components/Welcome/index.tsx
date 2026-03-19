import chalk from 'chalk'
import { Box, Text, useStdout } from 'ink'
import { useEffect, useState } from 'react'

const LOGO = `
 ██╗  ██╗███████╗
 ╚██╗██╔╝██╔════╝
  ╚███╔╝ ███████╗
  ██╔██╗ ╚════██║
 ██╔╝ ██╗███████║
 ╚═╝  ╚═╝╚══════╝
`.trimEnd()

const LOGO_WIDTH = 18
const TWO_COL_MIN_WIDTH = 50

export function Welcome() {
  const { stdout } = useStdout()
  const [cols, setCols] = useState(stdout.columns ?? 80)

  useEffect(() => {
    const onResize = () => setCols(stdout.columns ?? 80)
    stdout.on('resize', onResize)
    return () => {
      stdout.off('resize', onResize)
    }
  }, [stdout])

  const twoCol = cols >= TWO_COL_MIN_WIDTH

  const info = (
    <Box flexDirection="column">
      <Text>{chalk.cyan.bold('XS S2H CLI')}</Text>
      <Text color="gray">一个基于 Ink + TypeScript 的现代化交互式 CLI 工具</Text>
      <Text color="gray">{`v1.0.0 · Node ${process.version}`}</Text>
    </Box>
  )

  if (!twoCol) {
    return (
      <Box borderColor="gray" borderStyle="round" flexDirection="column" marginBottom={1}>
        <Text color="cyan">{LOGO}</Text>
        <Box marginTop={1}>{info}</Box>
      </Box>
    )
  }

  return (
    <Box borderColor="gray" borderStyle="round" marginBottom={1}>
      <Box alignItems="center" justifyContent="center" width={LOGO_WIDTH + 2}>
        <Text color="cyan">{LOGO}</Text>
      </Box>
      <Box alignItems="center" marginLeft={2}>
        {info}
      </Box>
    </Box>
  )
}
