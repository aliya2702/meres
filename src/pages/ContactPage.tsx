import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { VeilLink } from "@/components/VeilLink";
import { ReadMoreDrawer } from "@/components/ReadMoreDrawer";
import { StackSection, Panel } from "@/components/StackSection";
import { magnetic, revealLines } from "@/motion/helpers";
import { scrollToTarget } from "@/motion/smooth";
import { EASE } from "@/motion/tokens";
import { contact } from "@/content/copy";
import { images } from "@/content/images";

gsap.registerPlugin(ScrollTrigger);

const imageById = (id: string) => images.find((image) => image.id === id)!;

type Status = "idle" | "sending" | "success" | "error";

type FormData = {
  name: string;
  email: string;
  city: string;
  projectType: string;
  project: string;
  phone: string;
  timing: string;
  budget: string;
  company: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(key: keyof FormData, value: string): string | undefined {
  const v = value.trim();
  if (key === "name" && !v) return "Please enter your name.";
  if (key === "email" && !v) return "Please enter your email address.";
  if (key === "email" && v && !EMAIL_RE.test(v)) return "Please enter a valid email address.";
  if (key === "project" && !v) return "Please tell us about your project.";
}

function submitInquiry(payload: Record<string, string>): Promise<boolean> {
  const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;
  if (!endpoint) {
    console.warn("VITE_INQUIRY_ENDPOINT is not configured. Inquiry was not sent.");
    return Promise.resolve(false);
  }
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => res.ok).catch(() => false);
}

function FieldGroup({ label, id, required, error, children }: { label: string; id: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="field-wrap">
      <label htmlFor={id} className="field-label text-sm text-linen/70 transition-all duration-[350ms]">{label}{required && " *"}</label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}

export default function ContactPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const buttonWrapRef = useRef<HTMLSpanElement>(null);

  const uid = useId();
  const fieldIds = useMemo(() => ({
    name: `${uid}-name`,
    email: `${uid}-email`,
    city: `${uid}-city`,
    projectType: `${uid}-projectType`,
    project: `${uid}-project`,
    phone: `${uid}-phone`,
    timing: `${uid}-timing`,
    budget: `${uid}-budget`,
    company: `${uid}-company`,
  }), [uid]);

  const [data, setData] = useState<FormData>({ name: "", email: "", city: "", projectType: "", project: "", phone: "", timing: "", budget: "", company: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const updateField = useCallback((key: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const focusFirstInvalid = useCallback((errs: Errors) => {
    const order: Array<keyof FormData> = ["name", "email", "project"];
    for (const key of order) {
      if (errs[key]) { document.getElementById(fieldIds[key])?.focus(); break; }
    }
  }, [fieldIds]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    const newErrors: Errors = {};
    (["name", "email", "project"] as const).forEach((key) => {
      const error = validateField(key, data[key]);
      if (error) newErrors[key] = error;
    });
    if (data.company.trim()) return;

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setStatus("error");
      setStatusMessage(contact.error);
      focusFirstInvalid(newErrors);
      if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        (["name", "email", "project"] as const).forEach((key) => {
          if (newErrors[key]) {
            const el = document.getElementById(fieldIds[key]);
            if (el) gsap.fromTo(el, { x: -6 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
          }
        });
      }
      return;
    }

    setStatus("sending");
    setStatusMessage("");
    if (buttonWrapRef.current) gsap.to(buttonWrapRef.current, { opacity: 0.4, duration: 0.2 });

    const payload: Record<string, string> = {
      name: data.name.trim(),
      email: data.email.trim(),
      city: data.city.trim(),
      projectType: data.projectType,
      project: data.project.trim(),
      phone: data.phone.trim(),
      timing: data.timing.trim(),
      budget: data.budget.trim(),
      submittedAt: new Date().toISOString(),
    };

    const ok = await submitInquiry(payload);

    if (!ok) {
      setStatus("error");
      setStatusMessage(contact.error);
      if (buttonWrapRef.current) gsap.to(buttonWrapRef.current, { opacity: 1, duration: 0.3 });
      return;
    }

    setStatus("success");
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      const fields = Array.from(formRef.current?.querySelectorAll<HTMLElement>(".field-wrap") || []);
      gsap.to(fields, {
        y: -20, opacity: 0, duration: 0.6, ease: "power3.in", stagger: 0.04,
        onComplete: () => {
          if (successRef.current) {
            successRef.current.style.display = "block";
            revealLines(successRef.current.querySelector("p")!)();
            const msg = successRef.current.querySelector<HTMLElement>("p");
            if (msg) { msg.tabIndex = -1; msg.focus({ preventScroll: true }); }
          }
        },
      });
    } else {
      if (successRef.current) {
        successRef.current.style.display = "block";
        const msg = successRef.current.querySelector<HTMLElement>("p");
        if (msg) { msg.tabIndex = -1; msg.focus({ preventScroll: true }); }
      }
    }
  }, [data, status, focusFirstInvalid, fieldIds]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", async () => {
      await document.fonts.ready;
      if (titleRef.current) cleanups.push(revealLines(titleRef.current));
      if (headingRef.current) cleanups.push(revealLines(headingRef.current));
      const fields = formRef.current?.querySelectorAll<HTMLElement>(".field-wrap");
      if (fields) {
        const ctx = gsap.context(() => {
          gsap.fromTo(fields, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE.soft, stagger: 0.07, delay: 0.4 });
        });
        cleanups.push(() => ctx.revert());
      }
    });
    return () => { cleanups.forEach((c) => c()); mm.revert(); };
  }, []);

  useEffect(() => {
    if (submitRef.current) return magnetic(submitRef.current);
    return;
  }, []);

  const handleButtonEnter = useCallback(() => {
    if (!fillRef.current || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    gsap.to(fillRef.current, { clipPath: "inset(0 0 0 0)", duration: 0.5, ease: EASE.soft });
  }, []);
  const handleButtonLeave = useCallback(() => {
    if (!fillRef.current || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    gsap.to(fillRef.current, { clipPath: "inset(0 100% 0 0)", duration: 0.5, ease: EASE.soft });
  }, []);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const el = e.target;
    gsap.to(el, { borderBottomColor: "#EFE9DE", duration: 0.5, ease: EASE.soft });
    const label = el.closest(".field-wrap")?.querySelector(".field-label");
    if (label) gsap.to(label, { y: -4, fontSize: "0.75rem", color: "#AD9680", duration: 0.35, ease: EASE.soft });
  }, []);
  const handleFieldBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const el = e.target;
    gsap.to(el, { borderBottomColor: "rgba(239, 233, 222, 0.25)", duration: 0.5, ease: EASE.soft });
    const label = el.closest(".field-wrap")?.querySelector(".field-label");
    if (label) gsap.to(label, { y: 0, fontSize: "", color: "", duration: 0.35, ease: EASE.soft });
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#project-inquiry" && sectionRef.current) {
      const timer = window.setTimeout(() => {
        scrollToTarget("#project-inquiry", { duration: 1.2 });
        headingRef.current?.focus({ preventScroll: true });
      }, 400);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const inputClass = "w-full border-0 border-b border-linen/25 bg-transparent px-0 py-3 text-base text-linen outline-none transition-colors duration-300";
  const selectClass = inputClass + " appearance-none cursor-pointer";

  const introImage = imageById("second-kitchen");

  return (
    <section ref={sectionRef} id="project-inquiry" className="scroll-mt-24">
      <StackSection>
        {/* P1: Intro with title + lead */}
        <Panel zIndex={1} background="var(--forest)">
          <div className="absolute inset-0">
            <img
              src={introImage.src["1672"]}
              alt={introImage.alt}
              width={1672} height={941}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-forest/60" />
            <span className="concept-chip absolute bottom-3 left-3 z-10">Concept visualization</span>
          </div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
            <h1 ref={titleRef} className="headline-clamp font-serif text-linen">{contact.title}</h1>
            <p className="lead-clamp mt-6 font-serif text-linen/80" data-panel-line>{contact.paragraphs[0]}</p>
            <div className="mt-6">
              <ReadMoreDrawer heading={contact.title}>
                <p>{contact.paragraphs[1]}</p>
                <div className="mt-6 border-t border-linen/20 pt-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-taupe">{contact.next.title}</p>
                  <p className="mt-4 text-base leading-relaxed text-linen/85">{contact.next.body}</p>
                </div>
              </ReadMoreDrawer>
            </div>
          </div>
        </Panel>

        {/* P2: Form */}
        <Panel zIndex={2} background="var(--forest)">
          <div className="relative z-10 flex h-full items-center justify-center px-6 py-12 md:px-12 md:py-20">
            <div className="mx-auto w-full max-w-md">
              <h2 ref={headingRef} tabIndex={-1} className="font-serif text-3xl leading-tight text-linen md:text-4xl">Project inquiry</h2>
              <p className="mt-8 text-xs uppercase tracking-[0.22em] text-taupe">{contact.requiredNote}</p>
              <span className="mb-10 block h-px w-full origin-left bg-linen/30" />

              {status !== "success" && (
                <form ref={formRef} onSubmit={handleSubmit} noValidate aria-describedby={`${uid}-status`}>
                  <div className="space-y-8">
                    <div className="grid gap-8 sm:grid-cols-2">
                      <FieldGroup label={contact.fields.name} id={fieldIds.name} required error={errors.name}>
                        <input id={fieldIds.name} type="text" autoComplete="name" aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${fieldIds.name}-error` : undefined} value={data.name} onChange={(e) => updateField("name", e.target.value)} onFocus={handleFocus} onBlur={handleFieldBlur} className={inputClass} />
                      </FieldGroup>
                      <FieldGroup label={contact.fields.email} id={fieldIds.email} required error={errors.email}>
                        <input id={fieldIds.email} type="email" autoComplete="email" aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${fieldIds.email}-error` : undefined} value={data.email} onChange={(e) => updateField("email", e.target.value)} onFocus={handleFocus} onBlur={handleFieldBlur} className={inputClass} />
                      </FieldGroup>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2">
                      <FieldGroup label={contact.fields.city} id={fieldIds.city}>
                        <input id={fieldIds.city} type="text" autoComplete="address-level2" value={data.city} onChange={(e) => updateField("city", e.target.value)} onFocus={handleFocus} onBlur={handleFieldBlur} className={inputClass} />
                      </FieldGroup>
                      <FieldGroup label={contact.fields.projectType} id={fieldIds.projectType}>
                        <select id={fieldIds.projectType} value={data.projectType} onChange={(e) => updateField("projectType", e.target.value)} onFocus={handleFocus} onBlur={handleFieldBlur} className={selectClass}>
                          <option value="">Select one</option>
                          {contact.fields.types.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </FieldGroup>
                    </div>
                    <FieldGroup label={contact.fields.project} id={fieldIds.project} required error={errors.project}>
                      <textarea id={fieldIds.project} rows={5} aria-required="true" aria-invalid={!!errors.project} aria-describedby={errors.project ? `${fieldIds.project}-error` : undefined} placeholder={contact.fields.projectGuidance} value={data.project} onChange={(e) => updateField("project", e.target.value)} onFocus={handleFocus} onBlur={handleFieldBlur} className={inputClass + " resize-y"} />
                    </FieldGroup>
                    <div className="border-t border-linen/15 pt-8">
                      <div className="mb-6 flex items-baseline gap-3">
                        <p className="text-sm font-medium text-linen">{contact.fields.optionalGroup}</p>
                        <span className="text-xs uppercase tracking-[0.16em] text-taupe/60">{contact.fields.optionalTag}</span>
                      </div>
                      <div className="space-y-8">
                        <FieldGroup label={contact.fields.phone} id={fieldIds.phone}>
                          <input id={fieldIds.phone} type="tel" autoComplete="tel" value={data.phone} onChange={(e) => updateField("phone", e.target.value)} onFocus={handleFocus} onBlur={handleFieldBlur} className={inputClass} />
                        </FieldGroup>
                        <FieldGroup label={contact.fields.timing} id={fieldIds.timing}>
                          <input id={fieldIds.timing} type="text" value={data.timing} onChange={(e) => updateField("timing", e.target.value)} placeholder={contact.fields.timingGuidance} onFocus={handleFocus} onBlur={handleFieldBlur} className={inputClass} />
                        </FieldGroup>
                        <FieldGroup label={contact.fields.budget} id={fieldIds.budget}>
                          <input id={fieldIds.budget} type="text" value={data.budget} onChange={(e) => updateField("budget", e.target.value)} placeholder={contact.fields.budgetGuidance} onFocus={handleFocus} onBlur={handleFieldBlur} className={inputClass} />
                        </FieldGroup>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor={fieldIds.company}>Company</label>
                      <input id={fieldIds.company} type="text" tabIndex={-1} autoComplete="off" value={data.company} onChange={(e) => updateField("company", e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-6 pt-4">
                      <div className="relative">
                        <button ref={submitRef} type="submit" disabled={status === "sending"} onMouseEnter={handleButtonEnter} onMouseLeave={handleButtonLeave} data-cursor="link" className="group relative overflow-hidden rounded-full border border-linen px-6 py-3.5 text-sm text-linen transition-colors">
                          <span ref={fillRef} className="absolute inset-0 bg-linen" style={{ clipPath: "inset(0 100% 0 0)" }} aria-hidden="true" />
                          <span ref={buttonWrapRef} className="relative flex items-center gap-2">
                            <span className="transition-colors duration-300 group-hover:text-forest">{contact.submit}</span>
                            <ArrowUpRight size={16} className="transition-colors duration-300 group-hover:text-forest" />
                          </span>
                          {status === "sending" && (
                            <span className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden">
                              <span className="block h-full w-full origin-left animate-pulse bg-taupe" />
                            </span>
                          )}
                        </button>
                      </div>
                      <span className="text-xs text-linen/55">{contact.privacyLabel}{" · "}<a href="#" className="underline decoration-taupe underline-offset-4 hover:text-linen" aria-label="Privacy policy — placeholder">Privacy policy</a></span>
                    </div>
                  </div>
                </form>
              )}
              <div ref={successRef} style={{ display: "none" }} className="max-w-md" aria-live="polite">
                <p className="font-serif text-2xl leading-snug text-linen md:text-3xl">{contact.success}</p>
                <VeilLink to="/" data-cursor="link" className="mt-8 inline-flex items-center text-linen underline decoration-taupe underline-offset-4">Return home<ArrowUpRight className="ml-2" size={16} /></VeilLink>
              </div>
              <p ref={statusRef} id={`${uid}-status`} aria-live="polite" className="mt-6 min-h-[1.25rem] text-sm">
                {status === "error" && <span className="text-red-300">{statusMessage}</span>}
                {status === "sending" && <span className="text-linen/70">Sending…</span>}
              </p>
            </div>
          </div>
        </Panel>
      </StackSection>
    </section>
  );
}
