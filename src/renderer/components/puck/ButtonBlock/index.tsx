"use client";

import type { ComponentConfig } from "@puckeditor/core";
import { buttonFields, buttonDefaults } from "../../../lib/puck/button-fields";
import { StyledButton } from "../shared/StyledButton";
import { styleFields, styleDefaults } from "../../../lib/puck/style-fields";
import { StyleWrapper, extractStyleProps } from "../shared/StyleWrapper";
import { responsiveFields, responsiveDefaults } from "../../../lib/puck/responsive-fields";

type ButtonBlockProps = {
  label: string;
  href: string;
  openInNewTab: boolean;
  alignment: "left" | "center" | "right";
  _btnSize: string;
  _btnVariant: string;
  _btnColor: string;
  _btnRadius: string;
  _btnHoverColor: string;
  _btnHoverScale: string;
  puck?: { isEditing: boolean };
};

export const buttonBlockConfig: ComponentConfig<ButtonBlockProps> = {
  label: "Button",
  fields: {
    label: { type: "text", label: "Button Label" },
    href: { type: "text", label: "URL" },
    openInNewTab: {
      type: "radio",
      label: "Open in New Tab",
      options: [
        { label: "No", value: false },
        { label: "Yes", value: true },
      ],
    },
    alignment: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    ...buttonFields,
    ...styleFields,
    ...responsiveFields,
  },
  defaultProps: {
    label: "Get Started",
    href: "#",
    openInNewTab: false,
    alignment: "center",
    ...buttonDefaults,
    ...styleDefaults,
    ...responsiveDefaults,
  },
  render: ButtonBlock,
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function ButtonBlock(allProps: ButtonBlockProps) {
  const { label, href, openInNewTab, alignment, _btnSize, _btnVariant, _btnColor, _btnRadius, _btnHoverColor, _btnHoverScale, puck, ...rest } = allProps;
  return (
    <StyleWrapper {...extractStyleProps(rest as Record<string, unknown>)}>
    <div className={`py-4 ${alignClasses[alignment]}`}>
      <StyledButton
        label={label}
        href={puck?.isEditing ? "#" : href}
        _btnSize={_btnSize}
        _btnVariant={_btnVariant}
        _btnColor={_btnColor}
        _btnRadius={_btnRadius}
        _btnHoverColor={_btnHoverColor}
        _btnHoverScale={_btnHoverScale}
      />
    </div>
    </StyleWrapper>
  );
}
