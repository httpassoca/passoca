import { DirectiveOptions } from 'vue'

// export class Scroll {
//   el: HTMLElement;
//   maxTotal: number;
//   maxComplete: number;
//   timeout: any;
//   delay: number;
//   constructor (el: HTMLElement, delay = 500) {
//     this.el = el
//     this.maxTotal = -Infinity
//     this.maxComplete = -Infinity
//     this.timeout = null
//     this.delay = delay
//   }

//   listen () {
//     this.el.addEventListener('click', (e) => {
//       this.handleScroll(e)
//     })
//   }

//   handleScroll (e: Event) {
//     if (this.timeout) {
//       clearTimeout(this.timeout)
//     }
//     this.timeout = setTimeout(() => {
//       const progress = this.calculateComplete(e)
//       if (progress <= this.maxComplete) { return }
//       this.maxComplete = progress
//       this.dispatchEvent('progress', { progress, target: e.target })
//     }, this.delay)
//   }

//   calculateComplete (e: any) {
//     const {
//       scrollTop: top,
//       scrollHeight: total,
//       clientHeight: client
//     } = e.target
//     if (total > this.maxTotal) {
//       this.maxTotal = total
//       this.maxComplete = -Infinity
//     }
//     const read = (total - (top + client)) / total
//     console.log(Math.floor((1 - read) * 100))
//     return Math.floor((1 - read) * 100)
//   }

//   dispatchEvent (name: string, detail: any) {
//     this.el.dispatchEvent(new CustomEvent(name, { detail }))
//   }
// }

// export const elementScroll: DirectiveOptions = {
//   inserted: (el) => {
//     // eslint-disable-next-line no-param-reassign
//     const scroll = new Scroll(el)
//     scroll.listen()
//   }
// }

export const scroll: DirectiveOptions = {
  inserted (el, binding) {
    const f = function (evt: Event) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
}
