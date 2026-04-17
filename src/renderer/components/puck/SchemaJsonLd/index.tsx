"use client";

import type { ComponentConfig } from "@puckeditor/core";

type SchemaJsonLdProps = {
  programName: string;
  provider: string;
  description: string;
  cipCode: string;
  credentialType: string;
  modality: string;
  cost: string;
  duration: string;
  url: string;
  puck?: { isEditing: boolean };
};

export const schemaJsonLdConfig: ComponentConfig<SchemaJsonLdProps> = {
  label: "Schema.org (SEO)",
  fields: {
    programName: { type: "text", label: "Program Name" },
    provider: { type: "text", label: "Institution Name" },
    description: { type: "textarea", label: "Program Description" },
    cipCode: { type: "text", label: "CIP Code" },
    credentialType: {
      type: "select",
      label: "Credential Type",
      options: [
        { label: "Certificate", value: "Certificate" },
        { label: "Associate", value: "Associate" },
        { label: "Bachelor's", value: "Bachelor" },
        { label: "Master's", value: "Master" },
        { label: "Doctoral", value: "Doctoral" },
      ],
    },
    modality: {
      type: "select",
      label: "Modality",
      options: [
        { label: "Online", value: "Online" },
        { label: "On Campus", value: "OnCampus" },
        { label: "Hybrid", value: "Hybrid" },
      ],
    },
    cost: { type: "text", label: "Total Cost (number)" },
    duration: { type: "text", label: "Duration (e.g. 24 months)" },
    url: { type: "text", label: "Program URL" },
  },
  defaultProps: {
    programName: "",
    provider: "",
    description: "",
    cipCode: "",
    credentialType: "Master",
    modality: "Online",
    cost: "",
    duration: "",
    url: "",
  },
  render: SchemaJsonLd,
};

export function SchemaJsonLd({
  programName,
  provider,
  description,
  cipCode,
  credentialType,
  modality,
  cost,
  duration,
  url,
  puck,
}: SchemaJsonLdProps) {
  if (!programName) {
    if (puck?.isEditing) {
      return (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-400">
          <div className="text-lg mb-1">🔗</div>
          Schema.org JSON-LD — fill in program details in the sidebar
        </div>
      );
    }
    return <></>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: programName,
    description,
    provider: provider
      ? {
          "@type": "EducationalOrganization",
          name: provider,
        }
      : undefined,
    educationalCredentialAwarded: credentialType,
    occupationalCategory: cipCode ? { "@type": "CategoryCode", codeValue: cipCode } : undefined,
    educationalProgramMode: modality,
    offers: cost
      ? {
          "@type": "Offer",
          price: cost,
          priceCurrency: "USD",
        }
      : undefined,
    timeToComplete: duration ? `P${duration.replace(/D/g, "")}M` : undefined,
    url: url || undefined,
  };

  // Clean undefined values
  const cleaned = JSON.parse(JSON.stringify(jsonLd));

  if (puck?.isEditing) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span>🔗</span>
          <span className="text-xs font-semibold text-emerald-700">
            Schema.org EducationalOccupationalProgram
          </span>
        </div>
        <pre className="text-[10px] text-emerald-800 overflow-auto max-h-32 bg-white rounded p-2 border border-emerald-100">
          {JSON.stringify(cleaned, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleaned) }}
    />
  );
}