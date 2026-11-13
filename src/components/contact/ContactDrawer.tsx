import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type FocusEvent,
} from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { magnetic } from "@/motion/helpers";
import { prefersReducedMotion } from "@/motion/tokens";

export interface ContactDrawerProps {
  onValidityChange: (field: string, isValid: boolean) => void;
  onSubmitSuccess: () => void;
}

export type FormDataState = {
  name: string;
  email: string;
  city: string;
  projectType: string;
  project: string;
  phone: string;
  timing: string;
  budget: string;
  company: string; // Honeypot
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

const PROJECT_TYPES = [
  "Kitchen",
  "Bathroom",
  "Whole-home renovation",
  "Addition",
  "Custom home",
  "Other",
  "Not sure yet",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ContactDrawer (Right Drawer 45% width).
 * Opaque forest background #2C382A, padding 96px 4vw 6vh.
 * Fixed 100svh panel that scrolls internally when needed (data-lenis-prevent, overscroll-behavior: contain).
 * Slides in from right on load (translateX 100% to 0 in 1.0s power4.inOut).
 */
export function ContactDrawer({
  onValidityChange,
  onSubmitSuccess,
}: ContactDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const uid = useId();
  const fieldIds = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    city: `${uid}-city`,
    projectType: `${uid}-projectType`,
    project: `${uid}-project`,
    phone: `${uid}-phone`,
    timing: `${uid}-timing`,
    budget: `${uid}-budget`,
  };

  const [data, setData] = useState<FormDataState>({
    name: "",
    email: "",
    city: "",
    projectType: "",
    project: "",
    phone: "",
    timing: "",
    budget: "",
    company: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Entrance animation: slides from right (translateX 100% to 0, 1.0s power4.inOut)
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        drawer,
        { xPercent: 100 },
        {
          xPercent: 0,
          duration: 1.0,
          ease: "power4.inOut",
          delay: 0.1,
        }
      );
    }, drawer);

    return () => ctx.revert();
  }, []);

  // Magnetic hover on submit button
  useEffect(() => {
    const btn = submitBtnRef.current;
    if (!btn) return;
    return magnetic(btn);
  }, [isSuccess]);

  // Validate single field
  const validateField = useCallback((key: keyof FormDataState, val: string): string | undefined => {
    const v = val.trim();
    if (key === "name") {
      if (!v) return "Your name is required.";
      if (v.length < 2) return "Please enter your full name.";
    }
    if (key === "email") {
      if (!v) return "Email address is required.";
      if (!EMAIL_REGEX.test(v)) return "Please enter a valid email address.";
    }
    if (key === "city") {
      if (!v) return "Project city is required.";
    }
    if (key === "projectType") {
      if (!v) return "Please select a project type.";
    }
    if (key === "project") {
      if (!v) return "Please tell us about your project.";
      if (v.length < 8) return "Please provide a few details about your project.";
    }
    return undefined;
  }, []);

  // Handle field change
  const handleChange = (
    key: keyof FormDataState,
    value: string
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
    // Clear error for field if any
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // Handle blur for required fields (triggers collage frame reveal)
  const handleBlur = (
    key: keyof FormDataState,
    e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const err = validateField(key, e.target.value);
    const isValid = !err && e.target.value.trim().length > 0;

    if (submitted) {
      setErrors((prev) => ({ ...prev, [key]: err }));
    }
    onValidityChange(key, isValid);
  };

  // Submit handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Spam honeypot
    if (data.company.trim()) return;

    const newErrors: FormErrors = {};
    const requiredKeys: Array<keyof FormDataState> = [
      "name",
      "email",
      "city",
      "projectType",
      "project",
    ];

    requiredKeys.forEach((k) => {
      const err = validateField(k, data[k]);
      if (err) newErrors[k] = err;
      onValidityChange(k, !err);
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first invalid field
      for (const k of requiredKeys) {
        if (newErrors[k]) {
          const el = document.getElementById(fieldIds[k as keyof typeof fieldIds]);
          el?.focus();
          break;
        }
      }
      return;
    }

    // SUCCESS
    /* NOTE: A real backend or form service is needed before launch. In demo mode, details are stored in component state and verified locally. */
    setIsSuccess(true);
    onSubmitSuccess();

    if (!prefersReducedMotion() && formRef.current) {
      gsap.to(formRef.current, {
        y: -25,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          if (successRef.current) {
            gsap.fromTo(
              successRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
            );
          }
        },
      });
    }
  };

  // Focus first field if landing via hash #project-inquiry
  useEffect(() => {
    if (window.location.hash === "#project-inquiry") {
      const timer = window.setTimeout(() => {
        const firstField = document.getElementById(fieldIds.name);
        firstField?.focus({ preventScroll: true });
      }, 400);
      return () => window.clearTimeout(timer);
    }
  }, [fieldIds.name]);

  return (
    <aside
      ref={drawerRef}
      className="contact-drawer-scroll relative h-full w-full overflow-y-auto bg-[#2C382A] text-[#E8DECE] lg:w-[45%]"
      data-lenis-prevent
      style={{
        padding: "96px 4vw 6vh 4vw",
      }}
    >
      <div className="mx-auto w-full max-w-xl">
        {/* Top Header Information */}
        <div className="mb-8">
          <span className="block font-sans text-xs font-semibold tracking-[0.22em] text-[#AD9680] uppercase">
            PROJECT INQUIRY
          </span>
          <p className="mt-2 font-sans text-[13px] text-[#E8DECE]/75">
            Fields marked * are required.
          </p>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div
            ref={successRef}
            className="my-12 rounded-sm border border-[#AD9680]/30 bg-[#243022]/70 p-8 shadow-xl"
            role="status"
            aria-live="polite"
          >
            <span className="mb-2 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
              CONFIRMATION
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-snug text-[#E8DECE]">
              Thank you for sharing your project with MERES.
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-[#E8DECE]/85">
              We have received your details.
            </p>
            <div className="mt-8 border-t border-[rgba(232,222,206,0.18)] pt-6">
              <span className="block font-sans text-xs font-semibold tracking-[0.22em] text-[#AD9680] uppercase">
                WHAT HAPPENS NEXT
              </span>
              <p className="mt-2 font-sans text-[14px] leading-relaxed text-[#E8DECE]/85">
                We review your details and get back to you about next steps.
              </p>
            </div>
          </div>
        ) : (
          /* Inquiry Form */
          <form
            ref={formRef}
            id="project-inquiry"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Project inquiry form"
            className="space-y-7"
          >
            {/* Honeypot for spam detection */}
            <div aria-hidden="true" className="sr-only">
              <label htmlFor={`${uid}-company`}>Company</label>
              <input
                id={`${uid}-company`}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={data.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </div>

            {/* 1. Your name * */}
            <div className="contact-field-wrap">
              <label htmlFor={fieldIds.name} className="contact-label">
                Your name *
              </label>
              <input
                id={fieldIds.name}
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined}
                value={data.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={(e) => handleBlur("name", e)}
                placeholder="First and last name"
                className="contact-input"
              />
              <div className="contact-input-track" />
              <div className="contact-input-highlight" />
              {errors.name && (
                <p
                  id={`${fieldIds.name}-error`}
                  role="alert"
                  className="mt-1.5 font-sans text-[14px] text-[#E08A7C]"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* 2. Email address * */}
            <div className="contact-field-wrap">
              <label htmlFor={fieldIds.email} className="contact-label">
                Email address *
              </label>
              <input
                id={fieldIds.email}
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined}
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e)}
                placeholder="name@example.com"
                className="contact-input"
              />
              <div className="contact-input-track" />
              <div className="contact-input-highlight" />
              {errors.email && (
                <p
                  id={`${fieldIds.email}-error`}
                  role="alert"
                  className="mt-1.5 font-sans text-[14px] text-[#E08A7C]"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* 3. Project city * */}
            <div className="contact-field-wrap">
              <label htmlFor={fieldIds.city} className="contact-label">
                Project city *
              </label>
              <input
                id={fieldIds.city}
                type="text"
                autoComplete="address-level2"
                required
                aria-required="true"
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? `${fieldIds.city}-error` : undefined}
                value={data.city}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={(e) => handleBlur("city", e)}
                placeholder="e.g. Bellevue, Mercer Island, Seattle"
                className="contact-input"
              />
              <div className="contact-input-track" />
              <div className="contact-input-highlight" />
              {errors.city && (
                <p
                  id={`${fieldIds.city}-error`}
                  role="alert"
                  className="mt-1.5 font-sans text-[14px] text-[#E08A7C]"
                >
                  {errors.city}
                </p>
              )}
            </div>

            {/* 4. Project type * */}
            <div className="contact-field-wrap">
              <label htmlFor={fieldIds.projectType} className="contact-label">
                Project type *
              </label>
              <select
                id={fieldIds.projectType}
                required
                aria-required="true"
                aria-invalid={!!errors.projectType}
                aria-describedby={
                  errors.projectType ? `${fieldIds.projectType}-error` : undefined
                }
                value={data.projectType}
                onChange={(e) => handleChange("projectType", e.target.value)}
                onBlur={(e) => handleBlur("projectType", e)}
                className="contact-input contact-select"
              >
                <option value="" disabled>
                  Select a service category
                </option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="contact-input-track" />
              <div className="contact-input-highlight" />
              {errors.projectType && (
                <p
                  id={`${fieldIds.projectType}-error`}
                  role="alert"
                  className="mt-1.5 font-sans text-[14px] text-[#E08A7C]"
                >
                  {errors.projectType}
                </p>
              )}
            </div>

            {/* 5. Tell us about your project * */}
            <div className="contact-field-wrap">
              <label htmlFor={fieldIds.project} className="contact-label">
                Tell us about your project *
              </label>
              <textarea
                id={fieldIds.project}
                rows={4}
                required
                aria-required="true"
                aria-invalid={!!errors.project}
                aria-describedby={
                  errors.project ? `${fieldIds.project}-error` : undefined
                }
                value={data.project}
                onChange={(e) => handleChange("project", e.target.value)}
                onBlur={(e) => handleBlur("project", e)}
                placeholder="What would you like to change, and what matters most?"
                className="contact-input resize-y"
              />
              <div className="contact-input-track" />
              <div className="contact-input-highlight" />
              {errors.project && (
                <p
                  id={`${fieldIds.project}-error`}
                  role="alert"
                  className="mt-1.5 font-sans text-[14px] text-[#E08A7C]"
                >
                  {errors.project}
                </p>
              )}
            </div>

            {/* 6. Phone number (optional) */}
            <div className="contact-field-wrap">
              <label htmlFor={fieldIds.phone} className="contact-label">
                Phone number (optional)
              </label>
              <input
                id={fieldIds.phone}
                type="tel"
                autoComplete="tel"
                value={data.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(206) 000-0000"
                className="contact-input"
              />
              <div className="contact-input-track" />
              <div className="contact-input-highlight" />
            </div>

            {/* 7. Preferred timing (optional) */}
            <div className="contact-field-wrap">
              <label htmlFor={fieldIds.timing} className="contact-label">
                Preferred timing (optional)
              </label>
              <input
                id={fieldIds.timing}
                type="text"
                value={data.timing}
                onChange={(e) => handleChange("timing", e.target.value)}
                placeholder="Dates or circumstances that matter to you"
                className="contact-input"
              />
              <div className="contact-input-track" />
              <div className="contact-input-highlight" />
            </div>

            {/* 8. Approximate budget (optional) */}
            <div className="contact-field-wrap">
              <label htmlFor={fieldIds.budget} className="contact-label">
                Approximate budget (optional)
              </label>
              <input
                id={fieldIds.budget}
                type="text"
                value={data.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                placeholder="If you have a range in mind, you can share it here"
                className="contact-input"
              />
              <div className="contact-input-track" />
              <div className="contact-input-highlight" />
            </div>

            {/* Controls: Submit pill and Privacy notice */}
            <div className="flex flex-wrap items-center gap-6 pt-5">
              <button
                ref={submitBtnRef}
                type="submit"
                data-cursor="link"
                className="contact-submit-btn group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[rgba(232,222,206,0.4)] bg-[#E8DECE] px-8 py-4 font-sans text-base font-semibold text-[#2C382A] shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <span className="contact-submit-sweep" aria-hidden="true" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Send project details</span>
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </button>

              <span
                role="link"
                tabIndex={0}
                className="cursor-pointer font-sans text-[13px] text-[#E8DECE]/75 underline decoration-[#AD9680]/60 underline-offset-4 transition-colors hover:text-[#E8DECE]"
              >
                Privacy notice
              </span>
            </div>
          </form>
        )}

        {/* Note at the bottom in 14px */}
        <div className="mt-12 border-t border-[rgba(232,222,206,0.18)] pt-8">
          <p className="font-sans text-[14px] leading-relaxed text-[#E8DECE]/85">
            You don't need to have every answer before starting the conversation.
          </p>
          <div className="mt-6">
            <span className="block font-sans text-xs font-semibold tracking-[0.22em] text-[#AD9680] uppercase">
              WHAT HAPPENS NEXT
            </span>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-[#E8DECE]/85">
              We review your details and get back to you about next steps.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

