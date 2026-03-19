import { createRequire } from 'node:module'

import chalk from 'chalk'
import { Box, Text, useStdout } from 'ink'
import { useEffect, useState } from 'react'

const require = createRequire(import.meta.url)
const { name, description, version } = require('../../../package.json')

const LOGO = `
 ██╗  ██╗███████╗
 ╚██╗██╔╝██╔════╝
  ╚███╔╝ ███████╗
  ██╔██╗ ╚════██║
 ██╔╝ ██╗███████║
 ╚═╝  ╚═╝╚══════╝
`.trimEnd()

const LOGO_WIDTH = 18
const TWO_COL_MIN_WIDTH = 100

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
    <Box alignItems="center" flexDirection="column">
      <Text color="gray">{chalk.green.bold(name) + ' · ' + `v${version}`}</Text>
      <Text color="gray">{description}</Text>
      <Text color="gray">{`Node ${process.version}`}</Text>
      <Text color="gray">{`${process.platform} ${process.arch}`}</Text>
    </Box>
  )

  if (!twoCol) {
    return (
      <Box
        alignItems="center"
        borderColor="gray"
        borderStyle="round"
        flexDirection="column"
        justifyContent="center"
        marginBottom={1}
      >
        <Text color="green">{LOGO}</Text>
        <Box marginTop={1}>{info}</Box>
      </Box>
    )
  }

  return (
    <Box borderColor="gray" borderStyle="round">
      <Box alignItems="center" flexGrow={1} justifyContent="center">
        <Text color="green">{LOGO}</Text>
      </Box>
      <Box alignItems="center" justifyContent="center">
        <Text color="gray">{'│\n'.repeat(8).trimEnd()}</Text>
      </Box>
      <Box alignItems="center" flexGrow={2} justifyContent="center">
        {info}
      </Box>
    </Box>
  )
}
