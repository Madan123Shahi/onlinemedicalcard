import { useRef } from "react";

// A clearly fictional sample card. It tilts toward the pointer (user-triggered motion only).
export default function MedicalCard() {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 14}deg`);
    el.style.setProperty("--rx", `${-y * 14}deg`);
    el.style.setProperty("--hx", `${(x + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--hx", "0%");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="omc-card relative aspect-[1.586/1] w-full max-w-md select-none overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-2xl shadow-ink/30"
      role="img"
      aria-label="Sample medical card for a fictional patient named Asha Verma, valid until March 2028"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-bold">OnlineMedicalCard</p>
          <p className="text-xs text-white/60">Physician-verified patient card</p>
        </div>
        <span className="rounded-md border border-white/30 px-2 py-1 text-xs font-semibold">
          Sample
        </span>
      </div>

      <div className="omc-holo mt-5 h-2.5 w-full rounded-full" />

      <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
        <div className="col-span-2">
          <dt className="text-xs text-white/55">Patient</dt>
          <dd className="font-display text-xl font-semibold">Asha Verma</dd>
        </div>
        <div>
          <dt className="text-xs text-white/55">Card no.</dt>
          <dd className="font-medium tabular-nums">OMC 0000 4821</dd>
        </div>
        <div>
          <dt className="text-xs text-white/55">Valid until</dt>
          <dd className="font-medium tabular-nums">03 / 2028</dd>
        </div>
      </dl>

      {/* Decorative verification pattern */}
      <svg
        className="absolute bottom-5 right-5 h-14 w-14 text-white/85"
        viewBox="0 0 7 7"
        fill="currentColor"
        aria-hidden="true"
      >
        {[
          "1111101", "1000101", "1011101", "1011101", "1000101", "1111101", "0101010",
        ].flatMap((row, y) =>
          [...row].map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null))
        )}
      </svg>
    </div>
  );
}
