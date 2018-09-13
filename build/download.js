// Modified upon https://github.com/mui-org/material-ui/blob/851e847764ea3a7640c7aca7b8a72f089521d0f3/packages/material-ui-icons/scripts/download.js

import fse from 'fs-extra'
import path from 'path'
import yargs from 'yargs'
import Queue from './modules/waterfall/Queue'
import sleep from './modules/waterfall/sleep'
import retry from './modules/waterfall/retry'
import axios from 'axios'
import SocksProxyAgent from 'socks-proxy-agent'

const proxyHost = '127.0.0.1'
const proxyPort = '1086'
const proxyOptions = `socks5://${proxyHost}:${proxyPort}`
const httpsAgent = new SocksProxyAgent(proxyOptions)
const baseURL = 'https://material.io'
const client = axios.create({
  baseURL,
  httpsAgent,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36'
  }
})

const themeMap = {
  baseline: '', // filled
  outline: '_outlined',
  round: '_rounded',
  twotone: '_two_tone',
  sharp: '_sharp'
}

function downloadIcon (icon) {
  console.log(`downloadIcon ${icon.index}: ${icon.id}`)

  return Promise.all(
    Object.keys(themeMap).map(async theme => {
      let endUrl
      if (icon.imageUrls && icon.imageUrls[theme]) {
        endUrl = icon.imageUrls[theme]
      } else {
        endUrl = `${theme}-${icon.id}-24px.svg`
      }
      const size = endUrl.match(/^.*-([0-9]+)px.svg$/)[1]
      const { data } = await client.get(`/tools/icons/static/icons/${endUrl}`)
      await fse.writeFile(
        path.join(
          __dirname,
          `../assets/material-io-tools-icons/ic_${icon.id}${themeMap[theme]}_${size}px.svg`
        ),
        data
      )
    })
  )
}

async function run () {
  try {
    const argv = yargs
      .usage('Download the SVG from material.io/tools/icons')
      .describe('start-after', 'Resume at the following index').argv
    console.log('run', argv)
    await fse.ensureDir(path.join(__dirname, '../assets/material-io-tools-icons'))
    const { data } = await client.get('/tools/icons/static/data.json')
    let icons = data.categories.reduce((acc, item) => {
      return acc.concat(item.icons)
    }, [])
    icons = icons.map((icon, index) => ({ index, ...icon }))
    icons = icons.splice(argv.startAfter || 0)
    console.log(`${icons.length} icons to download`)

    const queue = new Queue(
      async icon => {
        await retry(async ({ tries }) => {
          await sleep((tries - 1) * 100)
          await downloadIcon(icon)
        })
      },
      { concurrency: 5 }
    )
    queue.push(icons)
    await queue.wait({ empty: true })
  } catch (err) {
    console.log('err', err)
    throw err
  }
}

run()
