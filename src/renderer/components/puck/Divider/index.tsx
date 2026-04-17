"use client";

import type { ComponentConfig } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type DividerProps = {
  style: "line" | "dots" | "space";
  spacing: "sm" | "md" | "lg";
  puck?: { isEditing: boolean };
};

export const dividerConfig: ComponentConfig<DividerProps> = {
  label: "Divider",
  fields: {
    style: {
      type: "radio",
      label: "Style",
      options: [
        { label: "Line", value: "line" },
        { label: "Dots", value: "dots" },
        { label: "Space Only", value: "space" },
      ],
    },
    spacing: {
      type: "radio",
      label: "Spacing",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    style: "line",
    spacing: "md",
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: Divider,
};

const spacingClasses = {
  sm: "py-4",
  md: "py-8",
  lg: "py-16",
};

export function Divider(allProps: DividerProps) {
  const { style, spacing, ...rest } = allProps;
  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <div className={`px-6 ${spacingClasses[spacing]}`}>
      <div className="mx-auto max-w-6xl">
        {style === "line" && <hr className="border-slate-200" />}
        {style === "dots" && (
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          </div>
        )}
      </div>
    </div>
    </StyleWrapper>
  );
}
