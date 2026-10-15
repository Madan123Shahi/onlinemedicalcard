import { Link } from "react-router-dom";
import MedicalCard from "../components/MedicalCard.jsx";

const steps = [
  { title: "Pick a time", body: "Choose a service and a 30-minute slot that suits you. Booking takes about two minutes." },
  { title: "Meet the doctor", body: "Join a private video call. Keep a photo ID and any past medical records nearby." },
  { title: "Get the decision", body: "The doctor tells you the outcome before the call ends, and explains it if you are not approved." },
  { title: "Download your card", body: "Approved patients get a digital card in their account, ready to print or save to a phone." },
];

const faqs = [
  {
    q: "Who will I speak to?",
    a: "A licensed physician. The doctor reviews your history during the call and makes the decision, not an algorithm.",
  },
  {
    q: "What if I am not approved?",
    a: "The doctor explains why and what would change the outcome. Review the refund terms for your service before you book.",
  },
  {
    q: "What should I have ready?",
    a: "A valid photo ID, a quiet place with a stable connection, and any records or prescriptions that relate to your condition.",
  },
  {
    q: "Can I cancel or move a visit?",
    a: "Yes. Cancel from My visits and the slot opens up for someone else. Then book a new time.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            See a doctor by video. Leave with a decision.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Book a 30-minute visit with a licensed physician from home. If you qualify, your
            medical card is in your account the same day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="btn btn-primary px-6 py-3 text-base">
              Book a visit
            </Link>
            <Link to="/services" className="btn btn-ghost px-6 py-3 text-base">
              See services and prices
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <MedicalCard />
        </div>
      </section>

      <section className="border-y border-line bg-white" aria-labelledby="how">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 id="how" className="text-3xl font-bold">How a visit works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-mint font-display text-base font-bold text-teal-deep">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16" aria-labelledby="faq">
        <h2 id="faq" className="text-3xl font-bold">Questions people ask first</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {f.q}
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-prose text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-14 md:flex-row md:items-center">
          <h2 className="max-w-xl text-3xl font-bold">Ready when you are. Slots open every 30 minutes, 10:00 to 17:30.</h2>
          <Link to="/book" className="btn bg-white px-6 py-3 text-base text-ink hover:bg-mint">
            Book a visit
          </Link>
        </div>
      </section>
    </>
  );
}
