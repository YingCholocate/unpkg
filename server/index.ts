import cors from 'cors'
import express from 'express'
import Analysis from '../lib/analysis.js'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { AddressInfo } from 'node:net'
import { IncomingMessage, ServerResponse } from 'node:http'
import http from 'http'
const __dirname = dirname(fileURLToPath(import.meta.url))
const Express = express()

export function generateServer(
  root?: string,
  prod?: boolean,
  deep?: number,
  port?: number,
): Promise<{
  Server: http.Server<typeof IncomingMessage, typeof ServerResponse>
  Port: number
}> {
  return new Promise((resolve) => {
    Express.use(
      cors({
        origin: '*',
      }),
    )
    const analysis = new Analysis(root, prod, deep, port)
    Express.get('/data', (_, res) => {
      analysis.unpkg_node_modules()
      res.send(JSON.stringify(analysis.echartsFormatData))
    })
    Express.get('/json', (req, res) => {
      const { json } = req.query
      analysis.unpkg_node_modules()
      analysis.printJsonBash(json as string)
      res.send({
        state: 200,
      })
    })
    Express.use('/view', express.static(path.join(__dirname, './public')))
    const Server = Express.listen(port)
    const res: {
      Server: http.Server<typeof IncomingMessage, typeof ServerResponse>
      Port: number
    } = {
      Server: Server,
      Port: 0,
    }
    Server.on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        Server.listen()
        res.Port = (Server.address() as AddressInfo).port
        resolve(res)
      }
    })
    res.Port = (Server.address() as AddressInfo)?.port
    if (res.Port) {
      resolve(res)
    }
  })
}
