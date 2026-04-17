"use client";

import type { ComponentConfig } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import { AnimatedNumber } from "../shared/AnimatedNumber";

type SalaryWidgetProps = {
  cipCode: string;
  heading: string;
  displayStyle: "card" | "inline" | "banner";
  medianSalary: string;
  entrySalary: string;
  topSalary: string;
  occupationTitle: string;
  puck?: { isEditing: boolean };
};

export const salaryWidgetConfig: ComponentConfig<SalaryWidgetProps> = {
  label: "Salary Data",
  fields: {
    cipCode: { type: "text", label: "CIP Code (e.g. 51.3801)" },
    heading: { type: "text", label: "Heading" },
    occupationTitle: { type: "text", label: "Occupation Title" },
    medianSalary: { type: "text", label: "Median Salary" },
    entrySalary: { type: "text", label: "Entry Salary" },
    topSalary: { type: "text", label: "Top Salary" },
    displayStyle: {
      type: "select",
      label: "Display Style",
      options: [
        { label: "Card", value: "card" },
        { label: "Inline Bar", value: "inline" },
        { label: "Banner", value: "banner" },
      ],
    },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    cipCode: "51.3801",
    heading: "Salary Outlook",
    occupationTitle: "",
    medianSalary: "",
    entrySalary: "",
    topSalary: "",
    displayStyle: "card",
    ...styleDefaults,
    ...responsiveDefaults,
  },
  resolveData: async ({ props }) => {
    // Only fetch if we have a CIP code and fields are empty (first load)
    if (!props.cipCode || props.medianSalary) {
      return { props };
    }
    try {
      const res = await fetch(`/api/market-intelligence/salary?cip_code=${props.cipCode}`);
      if (!res.ok) return { props };
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.occupations ?? [];
      const top = items[0];
      if (!top) return { props };

      return {
        props: {
          ...props,
          occupationTitle: top.title ?? top.onet_title ?? "",
          medianSalary: `$${Math.round(top.median ?? top.salary_median ?? 0).toLocaleString()}`,
          entrySalary: `$${Math.round(top.p10 ?? top.salary_pct10 ?? 0).toLocaleString()}`,
          topSalary: `$${Math.round(top.p90 ?? top.salary_pct90 ?? 0).toLocaleString()}`,
        },
        readOnly: {
          occupationTitle: true,
          medianSalary: true,
          entrySalary: true,
          topSalary: true,
        },
      };
    } catch {
      return { props };
    }
  },
  render: SalaryWidget,
};

export function SalaryWidget(allProps: SalaryWidgetProps) {
  const { heading, displayStyle, medianSalary, entrySalary, topSalary, occupationTitle, puck, ...rest } = allProps;

  const hasSalary = medianSalary && medianSalary !== "$0";

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className={`px-6 py-12 ${displayStyle === "banner" ? "bg-indigo-600 text-white" : displayStyle === "card" ? "bg-white" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-4xl">
          {heading && (
            <h2 className={`mb-6 text-center font-bold text-2xl ${displayStyle === "banner" ? "text-white" : "text-slate-900"}`}>
              {heading}
            </h2>
          )}
          {hasSalary ? (
            <>
              {displayStyle === "card" && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-emerald-600">
                      <AnimatedNumber value={medianSalary} animated={!puck?.isEditing} delay={0.1} />
                    </div>
                    <div className="mt-1 text-sm text-slate-500">Median Salary</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-slate-700">
                      <AnimatedNumber value={entrySalary} animated={!puck?.isEditing} delay={0.25} />
                    </div>
                    <div className="mt-1 text-sm text-slate-500">Entry Level</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-600">
                      <AnimatedNumber value={topSalary} animated={!puck?.isEditing} delay={0.4} />
                    </div>
                    <div className="mt-1 text-sm text-slate-500">Top Earners</div>
                  </div>
                </div>
              )}
              {displayStyle === "banner" && (
                <div className="text-center">
                  <div className="text-5xl font-bold">
                    <AnimatedNumber value={medianSalary} animated={!puck?.isEditing} />
                  </div>
                  <div className="mt-2 text-lg text-white/80">Median Annual Salary — {occupationTitle}</div>
                </div>
              )}
              {displayStyle === "inline" && (
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-600">
                      <AnimatedNumber value={entrySalary} animated={!puck?.isEditing} delay={0} />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Entry</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      <AnimatedNumber value={medianSalary} animated={!puck?.isEditing} delay={0.15} />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Median</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      <AnimatedNumber value={topSalary} animated={!puck?.isEditing} delay={0.3} />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Top</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-slate-400 text-sm py-8">
              {puck?.isEditing ? "Enter a CIP code — salary data will auto-populate" : "Loading salary data..."}
            </p>
          )}
          <div className="mt-4 text-center text-[10px] text-slate-400">
            Source: Bureau of Labor Statistics
          </div>
        </div>
      </section>
    </StyleWrapper>
  );
}