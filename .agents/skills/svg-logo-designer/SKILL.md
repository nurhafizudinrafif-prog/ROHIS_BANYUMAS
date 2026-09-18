---
name: svg-logo-designer
description: Create professional SVG logos, brand marks, emblems, icons, and vector symbols from descriptions and design specifications. Generates multiple logo variations with different layouts (horizontal lockup, vertical lockup, square badge, icon-only, monogram). Produces clean, scalable vector graphics suitable for website headers, favicons, and branding. Use this skill when asked to create or redesign logos, emblems, badges, favicons, or vector icons.
---

# SVG Logo & Brand Mark Designer

This skill creates professional, scalable vector graphic (SVG) logos and visual brand marks from design specifications, offering multiple variations and layout options.

## When to Use This Skill
Activate this skill when the user requests:
- Create or redesign a logo from a description or specification
- Design a brand identity, emblem, seal, or visual mark
- Generate logo variations (horizontal header, vertical stack, square badge, circular seal)
- Create scalable SVG icons, symbols, or favicons
- Design monograms, lettermarks, or wordmarks
- Optimize SVG code for web performance and crisp rendering across all screen resolutions

## Core Workflow

### Phase 1: Requirements & Brand Information
1. **Brand Identity & Personality**:
   - Organization/brand name, sub-brand or tagline
   - Personality: Prestigious, institutional, modern, solemn, energetic, etc.
   - Core values and cultural/visual motifs (e.g. Islamic geometry, Banyumas heritage, book/qalam, crescents, rosettes)
2. **Logo Type Selection**:
   - **Combination Mark**: Icon/symbol + text (best for websites and headers)
   - **Emblem / Seal**: Text contained inside geometric shield or circular medallion (ideal for official institutions/ROHIS)
   - **Lettermark / Monogram**: Stylized abbreviation (e.g. "RB" for Rohis Banyumas)
   - **Pictorial Mark**: Standalone icon/symbol
3. **Color Harmony**:
   - Align with brand color tokens (Deep Pine `#07140E`, `#0D2319`, Antique Brass `#C8A85B`, `#DFBF73`, Warm Alabaster `#F7F5F0`)
   - Ensure high contrast against both dark and light surfaces

### Phase 2: Layout Variations
For any logo or emblem request, consider generating these formats:
1. **Layout A: Horizontal Header Lockup**
   - Icon on the left, typography on the right. Aspect ratio ~3:1 or 4:1. Best for website navigation bars.
2. **Layout B: Square / Circular Medallion**
   - Centered icon with enclosing boundary (1:1 aspect ratio). Best for favicons, avatar profiles, app icons.
3. **Layout C: Vertical Stack**
   - Centered icon on top, formal institution name below. Best for splash screens and document headers.
4. **Layout D: Standalone Symbol / Favicon**
   - Simplified icon mark without text, optimized for 32x32px or 64x64px legibility.

### Phase 3: SVG Engineering Best Practices
1. **Clean ViewBox & Scaling**:
   - Always specify `viewBox="0 0 W H"` and avoid hardcoded pixel limits on root `<svg>`.
2. **Semantic Structure & Grouping**:
   - Group elements into `<g id="symbol">`, `<g id="text-primary">`, `<g id="tagline">`, `<g id="accents">`.
3. **Defs & Reusability**:
   - Define gradients, clipping paths, and drop filters in `<defs>` once with descriptive IDs.
4. **Crisp Precision**:
   - Use integer or 2-decimal coordinates.
   - Use `shape-rendering="geometricPrecision"` for sharp lines and vector clarity.
