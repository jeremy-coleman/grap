import * as React from "react"
import Component from "reactive-magic/component"
import Layout from "./Layout"
import Canvas from "./Canvas"

interface AppProps {}

export default class App extends Component<AppProps> {
  view() {
    return <Layout canvas={<Canvas />} />
  }
}
