import { useState, useEffect, useRef } from 'react';

export function useScrollSpy(ids: string[], offset = 100): string {
  const [active, setActive] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [ids, offset]);

  return active;
}
