"use client";
import { useEffect, useRef } from "react";
import styles from "./TOC.module.css";
import { debounce } from "./debouce";
import { filterNonNull } from "./filterNonNull";

export function TOC({ children }: { children: React.ReactNode }) {
  const refAside = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aside = refAside.current;
    if (aside == null) return;
    const list = filterNonNull(
      Array.from(aside.querySelectorAll("li")).map((li) => {
        const id = li
          .querySelector("a")
          ?.getAttribute("href")
          ?.replace("#", "");
        if (id == null) return null;
        const el = document.getElementById(decodeURIComponent(id));
        return {
          id,
          li,
          el,
        };
      })
    );
    const highlight = () => {
      const scrollTop = window.scrollY;
      const active = list.findLast(({ el }, i) => {
        if (el == null) return i === 0;
        return el.offsetTop <= scrollTop + 100;
      });
      list.forEach((item) => {
        const { li, el, id } = item;
        // if el is empty, try to fetch it again
        // because the target might just show up
        if (el == null) {
          item.el = document.getElementById(id);
        }

        // if el is still empty, disable it
        if (el == null && id != "") {
          li.classList.remove("enabled");
        } else {
          li.classList.add("enabled");
        }

        li.classList.remove("active");
      });

      if (active != null) {
        active.li.classList.add("active");
      }
    };

    const debouncedHighlight = debounce(highlight, 100);

    window.addEventListener("scroll", debouncedHighlight, {
      passive: true,
    });

    debouncedHighlight();

    return () => {
      window.removeEventListener("scroll", debouncedHighlight);
    };
  }, []);

  return (
    <div ref={refAside} className={styles.toc}>
      {children}
    </div>
  );
}
