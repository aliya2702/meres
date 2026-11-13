import { useState, useCallback, useEffect } from "react";
import { ContactCollage } from "@/components/contact/ContactCollage";
import { ContactDrawer } from "@/components/contact/ContactDrawer";
import "@/components/contact/contact.css";

/**
 * MERES — Contact Page (/contact).
 * One section, exactly 100svh tall on desktop.
 * Left Zone (55%): Forest-to-teal gradient with 5-slot image collage filling as required fields validate.
 * Right Drawer (45%): Opaque forest drawer (#2C382A) with thin underline inputs and internal scroll.
 * Footer is rendered once globally by App.tsx.
 */
export default function ContactPage() {
  const [validFields, setValidFields] = useState({
    name: false,
    email: false,
    city: false,
    projectType: false,
    project: false,
  });

  const [allValid, setAllValid] = useState(false);

  const handleValidityChange = useCallback((field: string, isValid: boolean) => {
    setValidFields((prev) => ({
      ...prev,
      [field]: isValid,
    }));
  }, []);

  const handleSubmitSuccess = useCallback(() => {
    setAllValid(true);
  }, []);

  // Set document title
  useEffect(() => {
    document.title = "Contact | MERES";
  }, []);

  return (
    <section
      id="contact"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#2C382A] lg:h-[100svh] lg:flex-row"
      data-theme="dark"
    >
      {/* LEFT ZONE: 55% width with Collage */}
      <ContactCollage
        nameValid={validFields.name}
        emailValid={validFields.email}
        cityValid={validFields.city}
        typeValid={validFields.projectType}
        projectValid={validFields.project}
        allValid={allValid}
      />

      {/* RIGHT DRAWER: 45% width with Project Inquiry Form */}
      <ContactDrawer
        onValidityChange={handleValidityChange}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </section>
  );
}
