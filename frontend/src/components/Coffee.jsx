import { motion } from "framer-motion";
import { Coffee as CoffeeIcon, Heart } from "lucide-react";

const COFFEE_IMG =
  "https://static.prod-images.emergentagent.com/jobs/cf313e6c-1ef6-480f-8538-031db3fc25ba/images/40c54adcf14c80d65270dce38357b0aae75298f8f0f0f8376df625e75f24b3b0.png";

export default function Coffee() {
  return (
    <section
      id="coffee"
      data-testid="coffee-section"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* warm radial */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(194,123,102,0.16), transparent 60%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <motion.div
          className="md:col-span-7 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
        >
          <p className="section-eyebrow mb-5 justify-center md:justify-start">
            — 04 / If you'd like
          </p>
          <h2 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1]">
            Buy us a
            <br />
            <span className="italic text-[var(--terracotta)]">slow coffee.</span>
          </h2>
          <p className="mt-6 text-[var(--ink-soft)] text-lg leading-relaxed max-w-md mx-auto md:mx-0">
            Everything we make is free. If something here helped your day, a
            warm cup keeps the lights on and the ghosts well-fed.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="btn-pill terra"
              data-testid="buy-coffee-btn"
            >
              <CoffeeIcon size={16} />
              Buy us a coffee
            </a>
            <a
              href="#waitlist"
              className="btn-pill ghost"
              data-testid="coffee-waitlist"
            >
              <Heart size={14} />
              Or just say hi
            </a>
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-5 flex justify-center"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1 }}
        >
          <motion.img
            src={COFFEE_IMG}
            alt="A small ceramic coffee cup"
            className="w-64 md:w-80 drop-shadow-2xl"
            animate={{ y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            data-testid="coffee-image"
          />
        </motion.div>
      </div>
    </section>
  );
}
