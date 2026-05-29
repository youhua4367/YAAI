import type { Directive } from 'vue'

/** 进入视口时触发回调（原首页 Index.vue） */
export const vIntersect: Directive<HTMLElement, (el: Element) => void> = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            binding.value(el)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
  }
}
