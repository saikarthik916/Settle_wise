export const designTokens = {
  "colors": {
    "primary": {
      "main": "#3B4876",
      "foreground": "#ffffff",
      "description": "Primary brand color - buttons, links, headers"
    },
    "secondary": {
      "main": "#005163",
      "foreground": "#ffffff",
      "description": "Secondary accent color - secondary CTAs, highlights"
    },
    "background": {
      "main": "#F1F3F4",
      "description": "Main page background"
    },
    "accent": {
      "main": "#A8AEAF",
      "foreground": "#091A2B",
      "description": "Accent color - subtle highlights, borders"
    },
    "text": {
      "primary": "#091A2B",
      "secondary": "#64748b",
      "description": "Text colors - primary for headings/body, secondary for muted text"
    },
    "card": {
      "background": "#ffffff",
      "foreground": "#091A2B",
      "description": "Card background color"
    },
    "border": "#e2e8f0",
    "success": {
      "main": "#10b981",
      "foreground": "#ffffff",
      "description": "Success states - good metrics, positive indicators"
    },
    "warning": {
      "main": "#f59e0b",
      "foreground": "#091A2B",
      "description": "Warning states - moderate metrics, caution indicators"
    },
    "destructive": {
      "main": "#dc2626",
      "foreground": "#ffffff",
      "description": "Error/destructive states - poor metrics, alerts"
    },
    "chart": {
      "1": "#3B4876",
      "2": "#005163",
      "3": "#10b981",
      "4": "#f59e0b",
      "5": "#ef4444",
      "description": "Chart colors for data visualization"
    },
    "glassmorphism": {
      "background": "rgba(255, 255, 255, 0.5)",
      "backgroundDark": "rgba(59, 72, 118, 0.4)",
      "border": "rgba(255, 255, 255, 0.08)",
      "blur": "6px",
      "description": "Glass effect for main summary stat card and area summary panel"
    }
  },
  "typography": {
    "fontFamily": {
      "primary": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      "description": "Primary font family - Inter"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "description": "Font weights - 400 (normal), 500 (medium), 600 (semibold), 700 (bold)"
    },
    "fontSize": {
      "dataLabel": {
        "xs": "12px",
        "sm": "14px",
        "description": "Data labels - 12-14px"
      },
      "body": {
        "sm": "14px",
        "base": "16px",
        "description": "Body text - 14-16px"
      },
      "header": {
        "lg": "18px",
        "xl": "20px",
        "2xl": "24px",
        "description": "Headers - 18-24px"
      }
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px",
    "description": "Spacing scale for margins, padding, and gaps"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px",
    "2xl": "16px",
    "full": "9999px",
    "glass": "10px",
    "description": "Border radius values - glass panels use 8-12px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    "description": "Box shadow definitions"
  },
  "components": {
    "button": {
      "height": {
        "sm": "32px",
        "md": "40px",
        "lg": "48px"
      },
      "padding": {
        "sm": "8px 16px",
        "md": "12px 24px",
        "lg": "16px 32px"
      },
      "borderRadius": "8px"
    },
    "card": {
      "padding": "24px",
      "borderRadius": "8px",
      "shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      "border": "1px solid #e2e8f0"
    },
    "input": {
      "height": "40px",
      "padding": "8px 12px",
      "borderRadius": "6px",
      "border": "1px solid #e2e8f0"
    },
    "glassmorphism": {
      "blur": "4-6px",
      "opacity": "40-60%",
      "border": "1px solid rgba(255, 255, 255, 0.08)",
      "borderRadius": "8-12px",
      "applyTo": ["main summary stat card", "area summary panel"],
      "note": "Do not apply to maps, charts, or long lists"
    }
  },
  "breakpoints": {
    "mobile": "0-767px",
    "tablet": "768px-1023px",
    "desktop": "1024px+",
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px",
    "description": "Responsive breakpoints - Desktop / Tablet / Mobile"
  },
  "accessibility": {
    "contrast": {
      "standard": "WCAG AA - minimum 4.5:1 for normal text, 3:1 for large text",
      "enhanced": "WCAG AAA - minimum 7:1 for normal text, 4.5:1 for large text"
    },
    "focusIndicator": {
      "color": "#3B4876",
      "width": "2px",
      "style": "solid",
      "offset": "2px"
    }
  },
  "tailwindMapping": {
    "colors": {
      "primary": "bg-primary text-primary border-primary",
      "secondary": "bg-secondary text-secondary border-secondary",
      "background": "bg-background",
      "accent": "bg-accent text-accent",
      "text": "text-foreground"
    },
    "note": "See AboutPage for full CSS variable mapping"
  }
};

export default designTokens;
