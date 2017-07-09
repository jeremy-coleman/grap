import * as React from "react"
import * as ReactDOM from "react-dom"
import { css } from "glamor"
import BlockRecord from "./records/Block"
import App from "./components/App"

css.global("html, body", {
	padding: 0,
	margin: 0,
	boxSizing: "border-box",
})

async function main() {
	await BlockRecord.load()
	const root = document.createElement("div")
	document.body.appendChild(root)
	ReactDOM.render(<App />, root)
}

main()
