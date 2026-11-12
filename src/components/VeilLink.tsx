import { AnchorHTMLAttributes, MouseEvent, forwardRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { veil } from "../gl/PageVeil";
import { scrollToTarget, lenis } from "../motion/smooth";
import ScrollTrigger from "gsap/ScrollTrigger";

const raf2 = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

export function useVeilNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(async (to: string, origin: [number, number] = [0.5, 0.5]) => {
    const url = new URL(to, window.location.origin);
    if (url.pathname === location.pathname) {
      if (url.hash) {
        history.replaceState(null, "", url.pathname + url.hash);
        const targetId = url.hash.slice(1);
        scrollToTarget(url.hash, {
          duration: 1.3,
          offset: -96,
          onComplete: () => {
            window.dispatchEvent(new CustomEvent("meres:anchor-replay", { detail: { id: targetId } }));
          },
        });
      } else scrollToTarget(0, { offset: 0 });
      return;
    }
    lenis?.stop();
    await veil.cover(origin);
    ScrollTrigger.getAll().forEach((trigger) => {
      const target = trigger.trigger as Element | undefined;
      if (!target || document.getElementById("main")?.contains(target)) trigger.kill();
    });
    navigate(url.pathname + url.hash);
    await raf2();
    window.scrollTo(0, 0);
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    ScrollTrigger.refresh();
    if (url.hash) scrollToTarget(url.hash, { immediate: true });
    lenis?.start();
    await veil.reveal([0.5, 0.5]);
    const heading = document.querySelector<HTMLElement>(url.hash || "main h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [location.pathname, navigate]);
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };
export const VeilLink = forwardRef<HTMLAnchorElement, Props>(function VeilLink({ to, onClick, children, ...rest }, ref) {
  const go = useVeilNavigate();
  const handle = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void go(to, [event.clientX / window.innerWidth, event.clientY / window.innerHeight]);
  }, [go, onClick, to]);
  return <a ref={ref} href={to} onClick={handle} {...rest}>{children}</a>;
});
