"use client";

import { m, useReducedMotion } from "motion/react";
import type { ComponentConfig } from "@puckeditor/core";
import {
  animationVariants,
  animationVariantOptions,
  getMotionProps,
  type AnimationVariant,
} from "../../../lib/motion/variants";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { typographyFields, typographyDefaults, getHeadingClasses, getHeadingStyle, extractTypographyProps } from "../../../lib/puck/typography-fields";
import { animationEnhancedFields, animationEnhancedDefaults, getTransition, extractAnimationEnhancedProps } from "../../../lib/puck/animation-fields";
import { scrollFields, scrollDefaults, getScrollMotionProps, extractScrollProps } from "../../../lib/puck/scroll-fields";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type TableRow = {
  cells: string;
};

type DataTableProps = {
  heading: string;
  headers: string;
  rows: TableRow[];
  striped: boolean;
  animationVariant: AnimationVariant;
  puck?: { isEditing: boolean };
};

export const dataTableConfig: ComponentConfig<DataTableProps> = {
  label: "Data Table",
  fields: {
    heading: { type: "richtext", label: "Table Heading", contentEditable: true },
    headers: {
      type: "text",
      label: "Column Headers (comma-separated)",
    },
    rows: {
      type: "array",
      label: "Rows",
      arrayFields: {
        cells: {
          type: "text",
          label: "Cell Values (comma-separated)",
        },
      },
      defaultItemProps: { cells: "Value 1, Value 2, Value 3" },
    },
    striped: {
      type: "radio",
      label: "Striped Rows",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    animationVariant: {
      type: "select",
      label: "Animation",
      options: animationVariantOptions,
    },
    ...animationEnhancedFields,
    ...scrollFields,
    ...typographyFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    heading: "",
    headers: "Feature, Basic, Premium",
    rows: [
      { cells: "Users, 10, Unlimited" },
      { cells: "Storage, 5 GB, 100 GB" },
      { cells: "Support, Email, 24/7 Phone" },
    ],
    striped: true,
    animationVariant: "fadeUp",
    ...animationEnhancedDefaults,
    ...scrollDefaults,
    ...typographyDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: DataTableComponent,
};

function parseCSV(str: string): string[] {
  return str.split(",").map((s) => s.trim());
}

export function DataTableComponent(allProps: DataTableProps) {
  const { heading, headers, rows, striped, animationVariant, puck, ...rest } = allProps;
  const reduce = useReducedMotion();
  const variant = reduce ? "none" : animationVariant;
  const mp = getMotionProps(puck?.isEditing);
  const headerCells = parseCSV(headers);
  const typo = extractTypographyProps(rest as Record<string, unknown>);
  const headingExtra = getHeadingClasses(typo);
  const headingStyle = getHeadingStyle(typo);
  const animProps = extractAnimationEnhancedProps(rest as Record<string, unknown>);
  const transition = getTransition(animProps);
  const scrollMotion = getScrollMotionProps(extractScrollProps(rest as Record<string, unknown>));

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <section className="bg-white px-6 py-16">
      <m.div
        className="mx-auto max-w-6xl"
        variants={animationVariants[variant]}
        {...mp}
        transition={transition}
        {...scrollMotion}
      >
        {(heading || puck?.isEditing) && (
          <div className="mb-8">
            <h2
              className={`text-2xl font-bold tracking-tight text-slate-900${headingExtra ? ` ${headingExtra}` : ""}`}
              {...(headingStyle ? { style: headingStyle } : {})}
            >{heading}</h2>
          </div>
        )}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {headerCells.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-semibold text-slate-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-slate-100 ${
                    striped && i % 2 === 1 ? "bg-slate-50/50" : ""
                  }`}
                >
                  {parseCSV(row.cells).map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-slate-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </m.div>
    </section>
    </StyleWrapper>
  );
}