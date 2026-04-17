import type { Config } from "@puckeditor/core";
import { heroSectionConfig } from "./components/puck/HeroSection";
import { contentBlockConfig } from "./components/puck/ContentBlock";
import { programGridConfig } from "./components/puck/ProgramGrid";
import { statCardConfig } from "./components/puck/StatCard";
import { ctaBannerConfig } from "./components/puck/CTABanner";
import { testimonialSectionConfig } from "./components/puck/TestimonialSection";
import { headerNavConfig } from "./components/puck/HeaderNav";
import { footerConfig } from "./components/puck/Footer";
import { teaserCardsConfig } from "./components/puck/TeaserCards";
import { dataTableConfig } from "./components/puck/DataTable";
import { formEmbedConfig } from "./components/puck/FormEmbed";
import { dividerConfig } from "./components/puck/Divider";
import { imageBlockConfig } from "./components/puck/ImageBlock";
import { faqSectionConfig } from "./components/puck/FAQSection";
import { videoBlockConfig } from "./components/puck/VideoBlock";
import { sectionConfig } from "./components/puck/Section";
import { columnsConfig } from "./components/puck/Columns";
import { buttonBlockConfig } from "./components/puck/ButtonBlock";
import { spacerConfig } from "./components/puck/Spacer";
import { featureGridConfig } from "./components/puck/FeatureGrid";
import { logoStripConfig } from "./components/puck/LogoStrip";
import { tabsConfig } from "./components/puck/Tabs";
import { codeEmbedConfig } from "./components/puck/CodeEmbed";
import { salaryWidgetConfig } from "./components/puck/SalaryWidget";
import { jobCountWidgetConfig } from "./components/puck/JobCountWidget";
import { outcomeWidgetConfig } from "./components/puck/OutcomeWidget";
import { leadCaptureFormConfig } from "./components/puck/LeadCaptureForm";
import { formBuilderConfig } from "./components/puck/FormBuilder";
import { contentListConfig } from "./components/puck/ContentList";
import { schemaJsonLdConfig } from "./components/puck/SchemaJsonLd";
import { countdownTimerConfig } from "./components/puck/CountdownTimer";
import { socialProofBarConfig } from "./components/puck/SocialProofBar";
import { pricingTableConfig } from "./components/puck/PricingTable";

type AnyComponentConfig = Config["components"][string];

export const puckConfig: Config = {
  components: {
    HeroSection: heroSectionConfig as AnyComponentConfig,
    ContentBlock: contentBlockConfig as AnyComponentConfig,
    ProgramGrid: programGridConfig as AnyComponentConfig,
    StatCard: statCardConfig as AnyComponentConfig,
    CTABanner: ctaBannerConfig as AnyComponentConfig,
    TestimonialSection: testimonialSectionConfig as AnyComponentConfig,
    HeaderNav: headerNavConfig as AnyComponentConfig,
    Footer: footerConfig as AnyComponentConfig,
    TeaserCards: teaserCardsConfig as AnyComponentConfig,
    DataTable: dataTableConfig as AnyComponentConfig,
    FormEmbed: formEmbedConfig as AnyComponentConfig,
    Divider: dividerConfig as AnyComponentConfig,
    ImageBlock: imageBlockConfig as AnyComponentConfig,
    FAQSection: faqSectionConfig as AnyComponentConfig,
    VideoBlock: videoBlockConfig as AnyComponentConfig,
    Section: sectionConfig as AnyComponentConfig,
    Columns: columnsConfig as AnyComponentConfig,
    ButtonBlock: buttonBlockConfig as AnyComponentConfig,
    Spacer: spacerConfig as AnyComponentConfig,
    FeatureGrid: featureGridConfig as AnyComponentConfig,
    LogoStrip: logoStripConfig as AnyComponentConfig,
    Tabs: tabsConfig as AnyComponentConfig,
    CodeEmbed: codeEmbedConfig as AnyComponentConfig,
    SalaryWidget: salaryWidgetConfig as AnyComponentConfig,
    JobCountWidget: jobCountWidgetConfig as AnyComponentConfig,
    OutcomeWidget: outcomeWidgetConfig as AnyComponentConfig,
    LeadCaptureForm: leadCaptureFormConfig as AnyComponentConfig,
    FormBuilder: formBuilderConfig as AnyComponentConfig,
    ContentList: contentListConfig as AnyComponentConfig,
    SchemaJsonLd: schemaJsonLdConfig as AnyComponentConfig,
    CountdownTimer: countdownTimerConfig as AnyComponentConfig,
    SocialProofBar: socialProofBarConfig as AnyComponentConfig,
    PricingTable: pricingTableConfig as AnyComponentConfig,
  },
};