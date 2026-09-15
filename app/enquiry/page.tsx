import { EnquiryHero } from "@/components/enquiry/enquiry-hero/enquiry-hero";
import { EnquiryFormSection } from "@/components/enquiry/enquiry-form-section/enquiry-form-section";
import { Footer } from "@/components/layout/footer/footer";
import { Navbar } from "@/components/layout/navbar/navbar";

export default function Page() {
  return (
    <>
      <Navbar />

      <main>
        <EnquiryHero />
        <EnquiryFormSection />
      </main>

      <Footer />
    </>
  );
}
