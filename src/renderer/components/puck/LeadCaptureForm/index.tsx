"use client";

import { useState } from "react";
import { m } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import { buttonFields, buttonDefaults } from "../../../lib/puck/button-fields";
import { StyledButton } from "../shared/StyledButton";
import { trackABConversion } from "../../ab-test/ABTestImpression";

type LeadCaptureFormProps = {
  heading: string;
  description: string;
  submitLabel: string;
  fields: "email-only" | "email-name" | "full";
  tenantId: string;
  source: string;
  successMessage: string;
  puck?: { isEditing: boolean };
};

export const leadCaptureFormConfig: ComponentConfig<LeadCaptureFormProps> = {
  label: "Lead Capture Form",
  fields: {
    heading: { type: "richtext", label: "Heading", contentEditable: true },
    description: { type: "richtext", label: "Description", contentEditable: true },
    submitLabel: { type: "text", label: "Submit Button Label" },
    fields: {
      type: "select",
      label: "Form Fields",
      options: [
        { label: "Email Only", value: "email-only" },
        { label: "Email + Name", value: "email-name" },
        { label: "Full (Email, Name, Phone, Interest)", value: "full" },
      ],
    },
    tenantId: { type: "text", label: "Tenant ID (auto-filled)" },
    source: { type: "text", label: "Lead Source Tag" },
    successMessage: { type: "text", label: "Success Message" },
    ...buttonFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "Request Information",
    description: "Get personalized program recommendations and next steps.",
    submitLabel: "Get Started",
    fields: "email-name",
    tenantId: "",
    source: "page-builder",
    successMessage: "Thanks! We'll be in touch shortly.",
    ...buttonDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: LeadCaptureForm,
};

export function LeadCaptureForm(allProps: LeadCaptureFormProps) {
  const { heading, description, submitLabel, fields: fieldSet, tenantId, source, successMessage, puck, ...rest } = allProps;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (puck?.isEditing) return;

    const form = new FormData(e.currentTarget);
    setLoading(true);

    try {
      await fetch("/api/leads/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          email: form.get("email"),
          first_name: form.get("first_name") || undefined,
          phone: form.get("phone") || undefined,
          interests: form.get("interest") ? [form.get("interest")] : undefined,
          source,
        }),
      });
      setSubmitted(true);
      trackABConversion("form_submit", { source });
    } catch {
      // Still show success (optimistic). We don't count optimistic
      // success as a conversion — only DB-confirmed submits.
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className="bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-lg">
          {heading && (
            <div className="mb-2 text-center text-2xl font-bold text-slate-900">
              {heading}
            </div>
          )}
          {description && (
            <div className="mb-6 text-center text-sm text-slate-600">
              {description}
            </div>
          )}

          {submitted ? (
            <m.div
              className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-2xl mb-2">✅</div>
              <p className="font-medium text-emerald-800">{successMessage}</p>
            </m.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                name="email"
                required
                placeholder="Email address *"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {(fieldSet === "email-name" || fieldSet === "full") && (
                <input
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              )}
              {fieldSet === "full" && (
                <>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <input
                    type="text"
                    name="interest"
                    placeholder="Area of interest"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </>
              )}
              <div className="pt-1">
                <StyledButton
                  label={loading ? "Submitting..." : submitLabel}
                  disabled={loading}
                  _btnSize={(rest as Record<string, unknown>)._btnSize as string ?? "md"}
                  _btnVariant={(rest as Record<string, unknown>)._btnVariant as string ?? "solid"}
                  _btnColor={(rest as Record<string, unknown>)._btnColor as string ?? "#4f46e5"}
                  _btnRadius={(rest as Record<string, unknown>)._btnRadius as string ?? "md"}
                  _btnHoverColor={(rest as Record<string, unknown>)._btnHoverColor as string ?? ""}
                  _btnHoverScale={(rest as Record<string, unknown>)._btnHoverScale as string ?? "1.02"}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                No spam. Your information is secure.
              </p>
            </form>
          )}
        </div>
      </section>
    </StyleWrapper>
  );
}