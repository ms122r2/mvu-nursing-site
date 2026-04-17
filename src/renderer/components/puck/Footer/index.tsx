"use client";

import type { ComponentConfig } from "@puckeditor/core";
import { AssetField } from "../fields/AssetField";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type FooterColumn = {
  heading: string;
  content: string;
};

type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  logo: string;
  logoAlt: string;
  columns: FooterColumn[];
  bottomLinks: FooterLink[];
  copyright: string;
  puck?: { isEditing: boolean };
};

export const footerConfig: ComponentConfig<FooterProps> = {
  label: "Footer",
  fields: {
    logo: { type: "custom", label: "Logo", render: AssetField },
    logoAlt: { type: "text", label: "Logo Alt Text" },
    columns: {
      type: "array",
      label: "Footer Columns",
      arrayFields: {
        heading: { type: "text", label: "Column Heading" },
        content: { type: "textarea", label: "Content (one link per line)" },
      },
      defaultItemProps: { heading: "Links", content: "Link 1\nLink 2\nLink 3" },
    },
    bottomLinks: {
      type: "array",
      label: "Bottom Links",
      arrayFields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "URL" },
      },
      defaultItemProps: { label: "Privacy Policy", href: "#" },
    },
    copyright: { type: "text", label: "Copyright Text" },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    logo: "",
    logoAlt: "Logo",
    columns: [
      { heading: "Programs", content: "Counseling\nSocial Work\nPsychology" },
      { heading: "Resources", content: "Blog\nFAQ\nSupport" },
      { heading: "Contact", content: "Phone: 555-0100\nemail@example.com" },
    ],
    bottomLinks: [
      { label: "Terms of Use", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
    copyright: "© 2026 All rights reserved.",
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: Footer,
};

export function Footer(allProps: FooterProps) {
  const { logo, logoAlt, columns, bottomLinks, copyright, puck, ...rest } = allProps;
  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {logo ? (
              <img src={logo} alt={logoAlt} className="h-8 brightness-0 invert" />
            ) : (
              <span className="text-lg font-bold">{logoAlt || "Logo"}</span>
            )}
          </div>
          {(columns ?? []).map((col, i) => (
            <div key={i}>
              {col.heading && (
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  {col.heading}
                </h3>
              )}
              <div className="space-y-2 text-sm text-slate-300">
                {col.content.split("\n").map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <p className="text-xs text-slate-500">{copyright}</p>
          <div className="flex gap-4">
            {(bottomLinks ?? []).map((link, i) => (
              <a
                key={i}
                href={puck?.isEditing ? "#" : link.href}
                className="text-xs text-slate-500 transition-colors hover:text-slate-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
    </StyleWrapper>
  );
}
