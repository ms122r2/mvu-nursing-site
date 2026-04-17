"use client";

import type { ComponentConfig } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";
import { AnimatedNumber } from "../shared/AnimatedNumber";

type JobCountWidgetProps = {
  cipCode: string;
  heading: string;
  activePostings: string;
  occupation1Title: string;
  occupation1Openings: string;
  occupation1Growth: string;
  occupation2Title: string;
  occupation2Openings: string;
  occupation2Growth: string;
  puck?: { isEditing: boolean };
};

export const jobCountWidgetConfig: ComponentConfig<JobCountWidgetProps> = {
  label: "Job Postings",
  fields: {
    cipCode: { type: "text", label: "CIP Code (e.g. 51.3801)" },
    heading: { type: "text", label: "Heading" },
    activePostings: { type: "text", label: "Active Postings" },
    occupation1Title: { type: "text", label: "Occupation 1 Title" },
    occupation1Openings: { type: "text", label: "Occupation 1 Openings" },
    occupation1Growth: { type: "text", label: "Occupation 1 Growth %" },
    occupation2Title: { type: "text", label: "Occupation 2 Title" },
    occupation2Openings: { type: "text", label: "Occupation 2 Openings" },
    occupation2Growth: { type: "text", label: "Occupation 2 Growth %" },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    cipCode: "51.3801",
    heading: "Current Job Openings",
    activePostings: "",
    occupation1Title: "",
    occupation1Openings: "",
    occupation1Growth: "",
    occupation2Title: "",
    occupation2Openings: "",
    occupation2Growth: "",
    ...styleDefaults,
    ...responsiveDefaults,
  },
  resolveData: async ({ props }) => {
    // Only fetch if fields are empty (first load or CIP change)
    if (!props.cipCode || props.occupation1Title) {
      return { props };
    }
    try {
      const res = await fetch(`/api/market-intelligence?cip_code=${props.cipCode}`);
      if (!res.ok) return { props };
      const data = await res.json();

      const occs = (data.occupations ?? []).slice(0, 2);
      const postings = data.live_postings?.total_active_postings;

      return {
        props: {
          ...props,
          activePostings: postings ? postings.toLocaleString() : "",
          occupation1Title: occs[0]?.title ?? "",
          occupation1Openings: occs[0]?.annual_openings ? occs[0].annual_openings.toLocaleString() : "",
          occupation1Growth: occs[0]?.growth_rate ? String(occs[0].growth_rate) : "",
          occupation2Title: occs[1]?.title ?? "",
          occupation2Openings: occs[1]?.annual_openings ? occs[1].annual_openings.toLocaleString() : "",
          occupation2Growth: occs[1]?.growth_rate ? String(occs[1].growth_rate) : "",
        },
        readOnly: {
          activePostings: true,
          occupation1Title: true,
          occupation1Openings: true,
          occupation1Growth: true,
          occupation2Title: true,
          occupation2Openings: true,
          occupation2Growth: true,
        },
      };
    } catch {
      return { props };
    }
  },
  render: JobCountWidget,
};

export function JobCountWidget(allProps: JobCountWidgetProps) {
  const {
    heading, activePostings,
    occupation1Title, occupation1Openings, occupation1Growth,
    occupation2Title, occupation2Openings, occupation2Growth,
    cipCode, puck, ...rest
  } = allProps;

  const hasData = occupation1Title || activePostings;

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
      <section className="bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {heading && (
            <h2 className="mb-6 text-center font-bold text-2xl text-slate-900">
              {heading}
            </h2>
          )}
          {hasData ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {activePostings && (
                <div className="rounded-xl bg-indigo-600 p-6 text-center text-white">
                  <div className="text-4xl font-bold">
                    <AnimatedNumber value={activePostings} animated={!puck?.isEditing} delay={0} />
                  </div>
                  <div className="mt-1 text-sm text-indigo-200">Active Job Postings</div>
                  <div className="mt-1 text-[10px] text-indigo-300">via Adzuna</div>
                </div>
              )}
              {occupation1Title && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                  <div className="text-3xl font-bold text-slate-900">
                    <AnimatedNumber value={occupation1Openings} animated={!puck?.isEditing} delay={0.15} />
                  </div>
                  <div className="mt-1 text-sm text-slate-500">Annual Openings</div>
                  {occupation1Growth && (
                    <div className="mt-2 text-xs font-medium text-emerald-600">
                      +<AnimatedNumber value={occupation1Growth} animated={!puck?.isEditing} delay={0.5} />% growth
                    </div>
                  )}
                  <div className="mt-1 text-xs text-slate-400">{occupation1Title}</div>
                </div>
              )}
              {occupation2Title && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                  <div className="text-3xl font-bold text-slate-900">
                    <AnimatedNumber value={occupation2Openings} animated={!puck?.isEditing} delay={0.3} />
                  </div>
                  <div className="mt-1 text-sm text-slate-500">Annual Openings</div>
                  {occupation2Growth && (
                    <div className="mt-2 text-xs font-medium text-emerald-600">
                      +<AnimatedNumber value={occupation2Growth} animated={!puck?.isEditing} delay={0.6} />% growth
                    </div>
                  )}
                  <div className="mt-1 text-xs text-slate-400">{occupation2Title}</div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-slate-400 text-sm py-8">
              {puck?.isEditing ? "Enter a CIP code — job data will auto-populate from BLS + Adzuna" : "Loading job data..."}
            </p>
          )}
          <div className="mt-4 text-center text-[10px] text-slate-400">
            CIP: {cipCode} — Sources: BLS Occupational Outlook + Adzuna
          </div>
        </div>
      </section>
    </StyleWrapper>
  );
}