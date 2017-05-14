import { Value } from "reactive-magic"

// https://github.com/atom/one-dark-syntax/blob/master/styles/colors.less

const hue = 220
const sat = 13
const light = 18

const mono1 = `hsl(${hue}, 14%, 71%)`
const mono2 = `hsl(${hue}, 9%, 55%)`
const mono3 = `hsl(${hue}, 10%, 40%)`

const cyan = "hsl(187, 47%, 55%)"
const blue = "hsl(207, 82%, 66%)"
const purple = "hsl(286, 60%, 67%)"
const green = "hsl( 95, 38%, 62%)"

const red = "hsl(355, 65%, 65%)"
const red2 = "hsl(5, 48%, 51%)"

const orange = "hsl(29, 54%, 61%)"
const orange2 = "hsl(39, 67%, 69%)"

const fg = mono1
const bg = `hsl(${hue}, ${sat}%, ${light}%)`
const gutter = `hsl(${hue}, ${sat}%, ${light / 1.26}%)`
const block = `hsl(${hue}, ${sat}%, ${light / 1.46}%)`
const border = `hsl(${hue}, ${sat}%, ${light / 1.86}%)`
const guide = `hsla(${hue}, ${sat}%, ${light}%, 0.85)`
const accent = `hsl(${hue}, 100%, 66%)`

export default class ThemeStore {
  text = new Value(fg)
  block = new Value(block)
  border = new Value(border)
  background = new Value(bg)
  gutter = new Value(gutter)

  primary = new Value(blue)
  secondary = new Value(green)
  accent = new Value(accent)
}
