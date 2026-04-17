"use client";

import { useState } from "react";
import { m, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import { AssetField } from "../fields/AssetField";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type NavItem = {
  label: string;
  href: string;
};

type HeaderNavProps = {
  logo: string;
  logoAlt: string;
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
  sticky: boolean;
  puck?: { isEditing: boolean };
};

export const headerNavConfig: ComponentConfig<HeaderNavProps> = {
  label: "Header / Nav",
  fields: {
    logo: { type: "custom", label: "Logo", render: AssetField },
    logoAlt: { type: "text", label: "Logo Alt Text" },
    navItems: {
      type: "array",
      label: "Navigation Items",
      arrayFields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "URL" },
      },
      defaultItemProps: { label: "Link", href: "#" },
    },
    ctaLabel: { type: "text", label: "CTA Button Label" },
    ctaHref: { type: "text", label: "CTA Button URL" },
    sticky: {
      type: "radio",
      label: "Sticky Header",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    logo: "",
    logoAlt: "Logo",
    navItems: [
      { label: "Programs", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Resources", href: "#" },
    ],
    ctaLabel: "Get Started",
    ctaHref: "#",
    sticky: false,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: HeaderNav,
};

export function HeaderNav(allProps: HeaderNavProps) {
  const { logo, logoAlt, navItems, ctaLabel, ctaHref, sticky, puck, ...rest } = allProps;
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const editing = puck?.isEditing;

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <header
      className={`border-b border-slate-200 bg-white px-6 py-4 ${sticky ? "sticky top-0 z-50" : ""}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href={puck?.isEditing ? "#" : "/"} className="flex-shrink-0">
          {logo ? (
            <img src={logo} alt={logoAlt} className="h-8" />
          ) : (
            <span className="text-xl font-bold text-slate-900">{logoAlt || "Logo"}</span>
          )}
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {(navItems ?? []).map((item, i) => (
            <a
              key={i}
              href={puck?.isEditing ? "#" : item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
          {(ctaLabel || editing) && (
            <a
              href={editing ? "#" : ctaHref}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              {ctaLabel}
            </a>
          )}
        </nav>

        <button
          className="md:hidden text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <m.nav
          className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 md:hidden"
          initial={reduce ? undefined : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {(navItems ?? []).map((item, i) => (
            <a
              key={i}
              href={puck?.isEditing ? "#" : item.href}
              className="text-sm font-medium text-slate-600"
            >
              {item.label}
            </a>
          ))}
          {ctaLabel && (
            <a
              href={puck?.isEditing ? "#" : ctaHref}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {ctaLabel}
            </a>
          )}
        </m.nav>
      )}
    </header>
    </StyleWrapper>
  );
}