"use client";

import { useState } from "react";
import type { ComponentConfig } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import { buttonFields, buttonDefaults } from "../../../lib/puck/button-fields";
import { StyledButton } from "../shared/StyledButton";

type FormField = {
  fieldType: string;
  label: string;
  placeholder: string;
  required: boolean;
  options: string;
};

type FormBuilderProps = {
  heading: string;
  description: string;
  fields: FormField[];
  submitLabel: string;
  submitAction: string;
  successMessage: string;
  formName: string;
  puck?: { isEditing: boolean };
};

export const formBuilderConfig: ComponentConfig<FormBuilderProps> = {
  label: "Form Builder",
  fields: {
    heading: { type: "text", label: "Form Heading" },
    description: { type: "text", label: "Description" },
    fields: {
      type: "array",
      label: "Form Fields",
      arrayFields: {
        fieldType: {
          type: "select",
          label: "Field Type",
          options: [
            { label: "Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Phone", value: "tel" },
            { label: "Textarea", value: "textarea" },
            { label: "Select / Dropdown", value: "select" },
            { label: "Checkbox", value: "checkbox" },
            { label: "Number", value: "number" },
            { label: "Date", value: "date" },
          ],
        },
        label: { type: "text", label: "Label" },
        placeholder: { type: "text", label: "Placeholder" },
        required: {
          type: "radio",
          label: "Required",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        options: {
          type: "text",
          label: "Options (comma-separated, for select)",
        },
      },
      defaultItemProps: {
        fieldType: "text",
        label: "Field Label",
        placeholder: "",
        required: false,
        options: "",
      },
      getItemSummary: (item: FormField) =>
        `${item.label} (${item.fieldType})${item.required ? " *" : ""}`,
    },
    submitLabel: { type: "text", label: "Submit Button Text" },
    formName: { type: "text", label: "Form Name (for tracking)" },
    submitAction: {
      type: "select",
      label: "On Submit",
      options: [
        { label: "Save to database", value: "database" },
        { label: "Create lead profile", value: "lead" },
        { label: "Send email notification", value: "email" },
      ],
    },
    successMessage: { type: "text", label: "Success Message" },
    ...buttonFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "Get in Touch",
    description: "",
    fields: [
      { fieldType: "text", label: "Full Name", placeholder: "Your name", required: true, options: "" },
      { fieldType: "email", label: "Email", placeholder: "you@example.com", required: true, options: "" },
      { fieldType: "tel", label: "Phone", placeholder: "(555) 000-0000", required: false, options: "" },
      { fieldType: "select", label: "Program Interest", placeholder: "Select a program", required: false, options: "Counseling, Social Work, Psychology, Other" },
      { fieldType: "textarea", label: "Message", placeholder: "Tell us about your goals...", required: false, options: "" },
    ],
    submitLabel: "Submit",
    formName: "contact-form",
    submitAction: "lead",
    successMessage: "Thank you! We'll be in touch shortly.",
    ...buttonDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: FormBuilder,
};

export function FormBuilder(allProps: FormBuilderProps) {
  const { heading, description, fields: formFields, submitLabel, submitAction, successMessage, formName, puck, ...rest } = allProps;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditing = puck?.isEditing;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isEditing) return;

    const form = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      data[key] = String(value);
    }

    setLoading(true);
    try {
      if (submitAction === "lead") {
        await fetch("/api/leads/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email || data.Email,
            first_name: data["full-name"] || data["Full Name"] || data.name,
            phone: data.phone || data.Phone || data.tel,
            source: `form:${formName}`,
          }),
        });
      } else {
        await fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form_name: formName, data }),
        });
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-lg">
          {heading && (
            <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mb-6 text-center text-sm text-slate-600">
              {description}
            </p>
          )}

          {submitted && !isEditing ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="font-medium text-emerald-800">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(formFields ?? []).map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>

                  {field.fieldType === "textarea" ? (
                    <textarea
                      name={field.label.toLowerCase().replace(/\s+/g, "-")}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  ) : field.fieldType === "select" ? (
                    <select
                      name={field.label.toLowerCase().replace(/\s+/g, "-")}
                      required={field.required}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="">{field.placeholder || "Select..."}</option>
                      {field.options
                        .split(",")
                        .map((o) => o.trim())
                        .filter(Boolean)
                        .map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                    </select>
                  ) : field.fieldType === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        name={field.label.toLowerCase().replace(/\s+/g, "-")}
                        required={field.required}
                        className="rounded border-slate-300"
                      />
                      {field.placeholder || field.label}
                    </label>
                  ) : (
                    <input
                      type={field.fieldType}
                      name={field.label.toLowerCase().replace(/\s+/g, "-")}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  )}
                </div>
              ))}

              <div className="pt-2">
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
            </form>
          )}
        </div>
      </section>
    </StyleWrapper>
  );
}
