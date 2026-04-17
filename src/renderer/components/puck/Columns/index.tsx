"use client";

import type { ComponentConfig } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type ColumnsProps = {
  layout: "50-50" | "33-67" | "67-33" | "33-33-33" | "25-50-25";
  gap: "none" | "sm" | "md" | "lg";
  verticalAlign: "top" | "center" | "bottom";
  puck?: { isEditing: boolean };
};

export const columnsConfig: ComponentConfig<ColumnsProps> = {
  label: "Columns",
  fields: {
    layout: {
      type: "select",
      label: "Layout",
      options: [
        { label: "50 / 50", value: "50-50" },
        { label: "33 / 67", value: "33-67" },
        { label: "67 / 33", value: "67-33" },
        { label: "33 / 33 / 33", value: "33-33-33" },
        { label: "25 / 50 / 25", value: "25-50-25" },
      ],
    },
    gap: {
      type: "select",
      label: "Gap",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    verticalAlign: {
      type: "select",
      label: "Vertical Align",
      options: [
        { label: "Top", value: "top" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "bottom" },
      ],
    },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    layout: "50-50",
    gap: "md",
    verticalAlign: "top",
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: Columns,
};

const gapClasses: Record<string, string> = {
  none: "gap-0",
  sm: "gap-4",
  md: "gap-8",
  lg: "gap-12",
};

const alignClasses: Record<string, string> = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
};

const layoutConfigs: Record<string, string[]> = {
  "50-50": ["flex-1", "flex-1"],
  "33-67": ["w-1/3", "w-2/3"],
  "67-33": ["w-2/3", "w-1/3"],
  "33-33-33": ["flex-1", "flex-1", "flex-1"],
  "25-50-25": ["w-1/4", "w-1/2", "w-1/4"],
};

export function Columns(allProps: ColumnsProps) {
  const { layout, gap, verticalAlign, puck, ...rest } = allProps;
  const cols = layoutConfigs[layout] ?? layoutConfigs["50-50"];

  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <div
      className={`flex flex-col lg:flex-row ${gapClasses[gap]} ${alignClasses[verticalAlign]}`}
    >
      {cols.map((widthClass, i) => (
        <div key={i} className={`min-w-0 ${widthClass}`}>
          <DropZone zone={`column-${i}`} />
        </div>
      ))}
    </div>
    </StyleWrapper>
  );
}
