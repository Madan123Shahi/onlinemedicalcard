import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, FileCheck2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { icon: FileCheck2, title: "Fill out your info", desc: "A short medical questionnaire from your phone." },
  { icon: Stethoscope, title: "Talk to a doctor", desc: "A licensed physician reviews your case over video." },
  { icon: ShieldCheck, title: "Get approved", desc: "Same-day approval with a money-back guarantee." },
  { icon: Clock, title: "Download card", desc: "Your digital medical card is ready instantly." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }, // ⚡ FIXED HERE
};

export default function Home() { 
  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Your medical marijuana card, <span className="text-primary">100% online</span>
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} className="max-w-xl text-lg text-muted-foreground">
          Talk to a licensed physician from home and get approved in minutes.
        </motion.p>
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Button size="lg" asChild>
            <Link to="/register">Start my evaluation</Link>
          </Button>
        </motion.div>
      </section>

      <section id="how-it-works" className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold">How it works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step) => (
              <motion.div key={step.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="h-full">
                  <CardHeader>
                    <step.icon className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {step.desc}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
