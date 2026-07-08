window.addEventListener('DOMContentLoaded', () => {
  (function c(i, o, s) {
    if (window.__framer_disable_appear_effects_optimization__ || typeof animator > "u") return;
    let e = {
      detail: {
        bg: document.hidden
      }
    };
    requestAnimationFrame(() => {
      let a = "framer-appear-start";
      performance.mark(a, e);
      animator.animateAppearEffects(
        window.__framer__appearAnimationsContent_data,
        (m, p, d) => {
          let t = document.querySelector(m);
          if (t) {
            for (let [r, f] of Object.entries(p)) {
              animator.startOptimizedAppearAnimation(t, r, f, d[r]);
            }
          }
        },
        i,
        o,
        s && window.matchMedia("(prefers-reduced-motion:reduce)").matches === !0,
        animator.getActiveVariantHash(window.__framer__breakpoints_data)
      );
      let n = "framer-appear-end";
      performance.mark(n, e);
      performance.measure("framer-appear", {
        start: a,
        end: n,
        detail: e.detail
      });
    });
  })("data-framer-appear-id", "__Appear_Animation_Transform__", false);
});