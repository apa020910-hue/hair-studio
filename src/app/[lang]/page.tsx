import { About } from "@/components/About";
import { Benefits } from "@/components/Benefits";
import { Booking } from "@/components/Booking";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Reviews } from "@/components/Reviews";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang = rawLang;
  const dict = getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Benefits items={dict.benefits} />
      <Services dict={dict.services} common={dict.common} />
      <About dict={dict.about} />
      <Team dict={dict.team} />
      <Reviews dict={dict.reviews} starsLabel={dict.a11y.stars} />
      <Booking
        lang={lang}
        dict={dict.booking}
        common={dict.common}
        categoryLabels={dict.services.tabs}
        serviceNames={dict.services.items}
        members={dict.team.members}
      />
      <Faq dict={dict.faq} callLabel={dict.common.call} />
      <Contact dict={dict.contact} common={dict.common} />
    </>
  );
}
