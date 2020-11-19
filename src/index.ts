import app from "./app/index"
import { HTML } from "./utils/html-template-tag-async"

// @ts-ignore
addEventListener('fetch', fetchHandler)

function fetchHandler(e: FetchEvent) {
    e.respondWith(handleRequest(e.request))
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(_: Request) {
  return streamResponse(app)
  // return new Response('Hello worker!', {
  //   headers: { 'content-type': 'text/plain' },
  // })
}

const encoder = new TextEncoder()
async function streamResponse(html: HTML) {
    let { readable, writable } = new TransformStream()
    const writer =  writable.getWriter()
    const send = (item: string) => writer.write(encoder.encode(item))
    html.start(send).then(async () => await writer.close())
    return new Response(readable, { headers: { "content-type": "text/html; charset=utf-8" }})
}
