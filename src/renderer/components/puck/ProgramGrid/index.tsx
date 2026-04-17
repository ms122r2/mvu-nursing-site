"use client";

import { m, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import {
  animationVariants,
  staggerContainer,
  animationVariantOptions,
  getMotionProps,
  type AnimationVariant,
} from "../../../lib/motion/variants";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { typographyFields, typographyDefaults, getHeadingClasses, getHeadingStyle, extractTypographyProps } from "../../../lib/puck/typography-fields";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { hoverFields, hoverDefaults, getHoverAnimation, getTapAnimation, getFocusAnimation, extractInteractionProps } from "../../../lib/puck/hover-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type Program = {
  id: string;
  name: string;
  vertical: string | null;
  modality: string | null;
  default_program_cost: number | null;
};

type ProgramGridProps = {
  heading: string;
  verticalFilter: string;
  modalityFilter: string;
  limit: number;
  animationVariant: AnimationVariant;
  programs?: Program[];
  puck?: { isEditing: boolean };
};

export const programGridConfig: ComponentConfig<ProgramGridProps> = {
  label: "Program Grid",
  fields: {
    heading: { type: "richtext", label: "Section Heading", contentEditable: true },
    verticalFilter: {
      type: "text",
      label: "Filter by Vertical",
    },
    modalityFilter: {
      type: "select",
      label: "Filter by Modality",
      options: [
        { label: "All", value: "" },
        { label: "Online", value: "online" },
        { label: "On Campus", value: "on-campus" },
        { label: "Hybrid", value: "hybrid" },
      ],
    },
    limit: {
      type: "number",
      label: "Max Programs",
      min: 1,
      max: 24,
    },
    animationVariant: {
      type: "select",
      label: "Animation",
      options: animationVariantOptions,
    },
    ...animationEnhancedFields,
    ...scrollFields,
    ...typographyFields,
    ...hoverFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "Explore Programs",
    verticalFilter: "",
    modalityFilter: "",
    limit: 6,
    animationVariant: "stagger",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...hoverDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  resolveData: async ({ props }) => {
    const params = new URLSearchParams();
    if (props.verticalFilter) params.set("vertical", props.verticalFilter);
    if (props.modalityFilter) params.set("modality", props.modalityFilter);
    params.set("limit", String(props.limit || 6));

    try {
      const res = await fetch(`/api/puck/programs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch programs");
      const programs = await res.json();
      return { props: { ...props, programs }, readOnly: { programs: true } };
    } catch {
      return {
        props: { ...props, programs: [] },
        readOnly: { programs: true },
      };
    }
  },
  render: ProgramGrid,
};

function ProgramCard({ program, index, hoverAnim, tapAnim, focusAnim }: { program: Program; index: number; hoverAnim: ReturnType<typeof getHoverAnimation>; tapAnim: ReturnType<typeof getTapAnimation>; focusAnim: ReturnType<typeof getFocusAnimation> }) {
  return (
    <m.div
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      variants={animationVariants.stagger}
      custom={index}
      whileHover={hoverAnim}
      whileTap={tapAnim}
      whileFocus={focusAnim}
    >
      <div className="mb-3 flex items-center gap-2">
        {program.vertical && (
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            {program.vertical}
          </span>
        )}
        {program.modality && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {program.modality}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
        {program.name}
      </h3>
      {program.default_program_cost != null && (
        <p className="mt-2 text-sm text-slate-500">
          ${program.default_program_cost.toLocaleString()}
        </p>
      )}
    </m.div>
  );
}

const PLACEHOLDER_PROGRAMS: Program[] = Array.from({ length: 6 }, (_, i) => ({
  id: `placeholder-${i}`,
  name: `Program ${i + 1}`,
  vertical: "Sample",
  modality: "Online",
  default_program_cost: 15000 + i * 5000,
}));

export function ProgramGrid(allProps: ProgramGridProps) {
  const { heading, animationVariant, programs, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));
  const interaction = extractInteractionProps(rest as Record<string, unknown>);
  const hoverAnim = getHoverAnimation(interaction._hoverEffect);
  const tapAnim = getTapAnimation(interaction._tapScale);
  const focusAnim = getFocusAnimation(interaction._focusRing, interaction._hoverEffect);
  const displayPrograms =
    programs && programs.length > 0
      ? programs
      : puck?.isEditing
        ? PLACEHOLDER_PROGRAMS
        : [];

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {(heading || puck?.isEditing) && (
          <m.div
            className="mb-10 text-center"
            variants={animationVariants[variant]}
            {...mp}
            transition={transition}
            {...scrollMotion}
          >
            <h2
              className={`text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl${headingExtra ? ` ${headingExtra}` : ""}`}
              {...(headingStyle ? { style: headingStyle } : {})}
            >{heading}</h2>
          </m.div>
        )}
        <m.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          {...mp}
          transition={transition}
        >
          {displayPrograms.map((program, i) => (
            <ProgramCard key={program.id} program={program} index={i} hoverAnim={hoverAnim} tapAnim={tapAnim} focusAnim={focusAnim} />
          ))}
        </m.div>
        {displayPrograms.length === 0 && !puck?.isEditing && (
          <p className="text-center text-slate-500">No programs found.</p>
        )}
      </div>
    </section>
    </StyleWrapper>
  );
}
