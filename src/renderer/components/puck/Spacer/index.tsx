"use client";

import type { ComponentConfig } from "@puckeditor/core";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type SpacerProps = {
  height: "16" | "24" | "32" | "48" | "64" | "96" | "128";
  puck?: { isEditing: boolean };
};

export const spacerConfig: ComponentConfig<SpacerProps> = {
  label: "Spacer",
  fields: {
    height: {
      type: "select",
      label: "Height",
      options: [
        { label: "16px", value: "16" },
        { label: "24px", value: "24" },
        { label: "32px", value: "32" },
        { label: "48px", value: "48" },
        { label: "64px", value: "64" },
        { label: "96px", value: "96" },
        { label: "128px", value: "128" },
      ],
    },
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    height: "48",
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: Spacer,
};

export function Spacer(allProps: SpacerProps) {
  const { height, puck, ...rest } = allProps;
  const h = Number(height);
  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <div
      style={{ height: `${h}px` }}
      className={
        puck?.isEditing
          ? "bg-indigo-50/50 border border-dashed border-indigo-200 flex items-center justify-center"
          : ""
      }
    >
      {puck?.isEditing && (
        <span className="text-[10px] text-indigo-300">{h}px</span>
      )}
    </div>
    </StyleWrapper>
  );
}
