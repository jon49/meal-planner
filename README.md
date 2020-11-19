# 👷 `worker-template` Hello World

A template for kick starting a Cloudflare worker project.

[`index.js`](https://github.com/cloudflare/worker-template/blob/master/index.js) is the content of the Workers script.

#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).


### To build

`npx esbuild .\src\index.ts --bundle --outfile=index.js`

with minification:

`npx esbuild .\src\index.ts --bundle | minify --type js -o ./index.js`

### To Run

```
wrangler preview --watch
```
