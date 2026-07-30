/**
 * lib/projects.ts — the gallery data, and the vocabularies that describe it.
 * ─────────────────────────────────────────────────────────────
 * Split out of pages/Projects.tsx 2026-07-30. The array is the runtime source
 * of truth for BOTH /projects (the four gallery layouts) and /projects/:id
 * (every piece its own page). Keeping it in the page module meant a visitor
 * landing on a detail page downloaded all four layout components to read a
 * data array, and made the two routes impossible to code-split apart.
 *
 * Data only — no JSX, no framer-motion. Keep it that way.
 *
 * New entries must set `tech`, `hasStatic`, and `hasInteractive`; the types
 * make them required.
 */

export interface Project {
  id: string;
  index: string;
  title: string;
  editorialTitle: string[];   // headline split for italic treatment
  subtitle: string;
  category: string;
  domain: DomainKey;
  accent: string;
  accentLabel: string;
  description: string;
  insight: string;
  method: string;
  image: string;
  images?: string[];          // optional extra candidates — crossfade through on hover
  imageCrop: string;
  link?: string;              // external live demo
  /** Long-form write-up published elsewhere — rendered as a second CTA. */
  articleUrl?: string;
  /** Slug of an in-site case study at /work/:slug, where one exists.
   *  The /work index was retired — this is how those pages stay reachable. */
  caseStudy?: string;
  source: string;
  tags: string[];
  hero?: boolean;             // gets full-width in Gallery layout
  /** Controlled technique vocabulary — drives the TECHNIQUE filter facet.
   *  Distinct from freeform `tags`, which stay display-only. */
  tech: TechKey[];
  /** The FORMAT facet is two independent flags, not one either/or. Plenty of
   *  these pieces are a cinematic still of something that is *also* live —
   *  a Tableau workbook, a hosted HTML build, a dashboard tab — and those
   *  should answer to both filters rather than being forced to pick one. */
  hasStatic: boolean;
  hasInteractive: boolean;
}

export type DomainKey =
  | "environmental"
  | "healthcare"
  | "infrastructure"
  | "sports"
  | "civic"
  | "history";

/* ─────────────────────────────────────────────────────────────
   DOMAIN DEFINITIONS
───────────────────────────────────────────────────────────── */
export const DOMAINS: Record<
  DomainKey,
  { label: string; accent: string; org: string }
> = {
  environmental: {
    label: "Environmental",
    accent: "#00C897",
    org: "Clemson · NRCS",
  },
  healthcare: {
    label: "Healthcare",
    accent: "#378ADD",
    org: "Booz Allen · VHA · Personal",
  },
  infrastructure: {
    label: "AI Infrastructure",
    accent: "#E8A030",
    org: "Meta · Personal",
  },
  sports: {
    label: "Sports",
    accent: "#00E5FF",
    org: "MLS · Personal",
  },
  civic: {
    label: "Civic & Public Data",
    accent: "#E05555",
    org: "Independent · Academic",
  },
  history: {
    label: "History & Religion",
    accent: "#C9A84C",
    org: "Independent",
  },
};

/* ─────────────────────────────────────────────────────────────
   TECHNIQUE VOCABULARY — second filter facet.
   Kept deliberately small: a facet term that matches one piece
   is a label, not a filter.
───────────────────────────────────────────────────────────── */
export type TechKey =
  | "gis"
  | "remote-sensing"
  | "dataviz"
  | "analytics"
  | "statistics"
  | "fullstack"
  | "webgl3d"
  | "aiml";

export const TECHS: Record<TechKey, string> = {
  gis: "GIS",
  "remote-sensing": "Remote Sensing · Photogrammetry",
  dataviz: "Data Visualization",
  analytics: "Data Analytics",
  statistics: "Statistics",
  fullstack: "Full-Stack",
  webgl3d: "3D & WebGL",
  aiml: "AI / ML",
};

/* ─────────────────────────────────────────────────────────────
   PROJECT DATA
   Update `image` field once images are in public/images/work/
───────────────────────────────────────────────────────────── */
export const PROJECTS: Project[] = [
  {
    id: "ocean-currents",
    index: "01",
    title: "Mapping Ocean Currents",
    editorialTitle: ["The Gulf Stream,", "made visible."],
    subtitle: "Physical Oceanography · Current Velocity · Atlantic Basin",
    category: "Physical Oceanography",
    domain: "environmental",
    tech: ["gis", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#00E5FF",
    accentLabel: "Oceanography",
    description:
      "Ocean current velocity encoded as bioluminescent particle streams over a near-black bathymetric surface. The Gulf Stream's meander emerges as a ribbon of cold light — the physical reality of a 30-million cubic meter per second flow made visible in a single frame.",
    insight:
      "The ocean moves faster than most maps suggest. At this scale, the difference between surface current and the deep countercurrent is the difference between blue and white.",
    method:
      "Vector field visualization of NOAA current velocity data. Particle stream density encodes flow speed. Bathymetric depth as grayscale base layer.",
    image: "/images/work/mapping-ocean-currents.webp",
    images: [
      "/images/work/mapping-ocean-currents.webp",
      "/images/work/mapping-ocean-currents-2.webp",
      "/images/work/mapping-ocean-currents-3.webp",
    ],
    imageCrop: "center",
    link: "https://www.arcgis.com/apps/mapviewer/index.html?webmap=7855eb712c7045d49c995eb8f841ecf1",
    source: "Data: NOAA Ocean Current Velocity · Method: Vector particle streams",
    tags: ["Oceanography", "Vector Fields", "NOAA", "Physical Geography"],
    hero: true,
  },
  {
    id: "chattooga",
    index: "02",
    title: "Riparian Buffer on the Chattooga",
    editorialTitle: ["The river as", "terrain."],
    subtitle: "Chattooga River Gorge · Terrain Profile with Canopy · 1,008–1,714 ft",
    category: "Environmental Science",
    domain: "environmental",
    tech: ["remote-sensing", "gis"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#00C897",
    accentLabel: "Environmental",
    description:
      "Longitudinal terrain profile of the Chattooga River Gorge rendered on warm gold paper — elevation ranging 1,008 to 1,714 feet, canopy encoded by color. Framed as a museum artifact. The river that carved the boundary between South Carolina and Georgia, drawn as it would appear in a natural history archive.",
    insight:
      "Riparian buffers are invisible on most maps. Rendering the gorge as terrain — with elevation range and canopy density explicit — makes visible what is usually abstracted away.",
    method:
      "LiDAR-derived terrain profile. Canopy height model from aerial returns. Elevation range: 1,008–1,714 ft. Rendered on simulated archival paper with gold frame.",
    image: "/images/work/chattooga-riparian.webp",
    images: [
      "/images/work/chattooga-riparian.webp",
      "/images/work/chattooga-riparian-2.webp",
      "/images/work/chattooga-riparian-3.webp",
    ],
    imageCrop: "center",
    source: "Data: USGS LiDAR · SC/GA boundary · Canopy: Aerial returns",
    tags: ["LiDAR", "Terrain Analysis", "Environmental", "Riparian", "SC"],
    hero: false,
  },
  {
    id: "solar-agriculture",
    index: "03",
    title: "Solar Applications in Agriculture",
    editorialTitle: ["Town Creek Farms —", "solar at field scale."],
    subtitle: "Global Solar Irradiance · Summer Solstice · 82°46'W 34°37'N",
    category: "Agricultural GIS",
    domain: "environmental",
    tech: ["remote-sensing", "gis", "analytics"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#FF6B2B",
    accentLabel: "Agricultural GIS",
    description:
      "Solar resource mapped to parcel geometry at the Summer Solstice. Global irradiance rendered as false color thermal overlay — red at peak exposure, blue in shadow. Solar noon at 12:33, max altitude 78.8°, daylight duration 14:29 hours. Five years of farm energy audits distilled into a single image.",
    insight:
      "Small farms rarely have access to the kind of spatial solar analysis that determines whether a photovoltaic investment will pay off. This is what it looks like when they do.",
    method:
      "Global horizontal irradiance (kWh/m²/day) from NREL data. False color thermal mapping. Solar position calculated for Summer Solstice at site coordinates.",
    image: "/images/work/solar-agriculture-01.webp",
    images: [
      "/images/work/solar-agriculture-01.webp",
      "/images/work/solar-agriculture-02.webp",
      "/images/work/solar-agriculture-03.webp",
      "/images/work/solar-agriculture-04.webp",
      "/images/work/solar-agriculture-05.webp",
      "/images/work/solar-agriculture-06.webp",
    ],
    imageCrop: "center",
    source: "Data: NREL Solar Resource · USDA parcel data · Summer Solstice 2025",
    tags: ["Solar", "Agriculture", "NRCS", "Energy Auditing", "SC"],
    hero: false,
  },
  {
    id: "societal-health",
    index: "04",
    title: "Societal Health Metrics in the US",
    editorialTitle: ["Where health", "is unevenly held."],
    subtitle: "County-Level Composite Health Index · CONUS · 2024",
    category: "Public Health · Spatial Analysis",
    domain: "healthcare",
    tech: ["statistics", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#378ADD",
    accentLabel: "Public Health",
    description:
      "Composite societal health metrics rendered as layered wooden tile geography — county units extruded and colored by a composite index including healthcare access, educational attainment, economic mobility, and environmental quality. The coastal and urban core advantage becomes unmistakably physical.",
    insight:
      "A table of county health rankings communicates nothing. A 3D map where you can literally see the height of the gap between the Mississippi Delta and coastal Massachusetts changes what the data means.",
    method:
      "County Health Rankings composite index. 3D extrusion by health score. Teal to yellow color scale. Shallow DOF macro render on dark surface.",
    image: "/images/work/societal-health-01.webp",
    images: [
      "/images/work/societal-health-01.webp",
      "/images/work/societal-health-02.webp",
      "/images/work/societal-health-03.webp",
      "/images/work/societal-health-04.webp",
      "/images/work/societal-health-05.webp",
    ],
    imageCrop: "center",
    /* Moved off the legacy /views/…?:embed=y share URL onto the canonical
       /app/profile/… form Tableau serves today. Both resolve, but the embed
       URL is the one Tableau has been migrating away from. Confirmed against
       the rendered page ("Regional", 116 views). */
    link: "https://public.tableau.com/app/profile/patrick.anderson8240/viz/Regional_15626006455980/ObesityDark",
    source: "Data: County Health Rankings 2024 · ACS · CDC PLACES",
    tags: ["Public Health", "County-Level", "Census", "3D Render", "Equity"],
    hero: true,
  },
  {
    id: "refugee-displacement",
    index: "05",
    title: "International Refugee Displacement",
    editorialTitle: ["Movement as", "data."],
    subtitle: "Global Forced Migration Flows · UNHCR 2023",
    category: "Humanitarian GIS",
    domain: "healthcare",
    tech: ["analytics", "dataviz"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#4A90D9",
    accentLabel: "Humanitarian",
    description:
      "Forced migration flows rendered as directional particle streams across a near-black global basemap. Origin and destination encoded by flow intensity. The largest displacement crises — Syria, Ukraine, South Sudan, Afghanistan — emerge as the brightest corridors. Every particle is a person.",
    insight:
      "Migration data is usually presented as numbers. Rendering it as movement — as something that has direction, momentum, and weight — restores the human reality the statistics compress.",
    method:
      "UNHCR forced displacement dataset 2023. Origin-destination flow lines. Particle density encodes volume. Great circle routing on globe projection.",
    image: "/images/work/refugee-displacement-01.webp",
    imageCrop: "center",
    source: "Data: UNHCR Global Trends 2023 · Method: OD flow visualization",
    tags: ["Humanitarian", "Migration", "UNHCR", "Flow Mapping", "Global"],
    hero: false,
  },
  {
    id: "dc-satellite",
    index: "06",
    title: "DC Satellite Imagery Monitoring",
    editorialTitle: ["Watching the", "infrastructure grow."],
    subtitle: "AI Data Center Expansion · Satellite Time Series · Northern Virginia",
    category: "AI Infrastructure · Remote Sensing",
    domain: "infrastructure",
    tech: ["remote-sensing", "gis", "fullstack"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#E8A030",
    accentLabel: "AI Infrastructure",
    description:
      "Satellite time series monitoring of AI data center construction in the Northern Virginia corridor — the densest concentration of data center infrastructure on earth. Site footprint expansion tracked across quarterly imagery. Ground truth validation of reported capacity announcements against observable construction progress.",
    insight:
      "What hyperscalers announce and what satellites observe are often different timelines. The gap between press release and ground break, rendered spatially, tells a different story than the earnings call.",
    method:
      "Sentinel-2 multispectral imagery. Change detection via NDBI. Quarterly time series 2023–2025. Site boundary delineation from parcel data.",
    image: "/images/work/dc-satellite-imagery.webp",
    images: [
      "/images/work/dc-satellite-imagery.webp",
      "/images/work/dc-satellite-imagery-2.webp",
      "/images/work/dc-satellite-imagery-3.webp",
    ],
    caseStudy: "satellite-explorer",
    link: "https://satellite-explorer-seven.vercel.app/",
    imageCrop: "center",
    source: "Data: Sentinel-2 MSI · NDBI change detection · Quarterly 2023–2025",
    tags: ["Remote Sensing", "Change Detection", "Data Centers", "Meta", "NoVA"],
    hero: true,
  },
  {
    id: "dc-parcels",
    index: "07",
    title: "DC Parcel Dashboard",
    editorialTitle: ["Land as", "infrastructure."],
    subtitle: "AI Data Center Site Acquisition · Parcel Analysis · NOVA Corridor",
    category: "AI Infrastructure · Spatial Analysis",
    domain: "infrastructure",
    tech: ["gis", "fullstack"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#E8A030",
    accentLabel: "AI Infrastructure",
    description:
      "Parcel-level land acquisition analysis across the Northern Virginia AI infrastructure corridor. Site suitability scoring on transmission proximity, fiber availability, zoning class, and environmental constraints. The geography of where AI gets built — and why.",
    insight:
      "Data center siting is the most spatially constrained problem in AI infrastructure. Power, fiber, water, land cost, and regulatory environment converge at the parcel level. This is what that convergence looks like.",
    method:
      "Multi-criteria site suitability analysis. Parcel data from county assessors. Transmission lines from EIA. Fiber from FCC Form 477. Scoring: weighted overlay.",
    image: "/assets/projects/dc-parcel-dashboard/hero.webp",
    caseStudy: "dc-parcel-dashboard",
    link: "https://dc-parcel-dashboard.vercel.app/",
    imageCrop: "center",
    source: "Data: County assessors · EIA · FCC Form 477 · 2025",
    tags: ["Site Siting", "Parcel Analysis", "AI Infrastructure", "MCDA", "Meta"],
    hero: false,
  },
  {
    id: "hexbin",
    index: "08",
    title: "Where Knowledge Concentrates",
    editorialTitle: ["Where knowledge", "concentrates."],
    subtitle: "US PhD Concentration · CONUS Hexbin · ACS 2024",
    category: "Census · Data Art",
    domain: "civic",
    tech: ["gis", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#00C897",
    accentLabel: "Census · Data Art",
    description:
      "Doctoral degree concentration rendered as self-illuminating crystal prisms over a CONUS hexbin surface. Teal aquamarine at baseline density, transitioning through pink and salmon to amber-gold at the highest concentrations. SF Bay Area, Boston, NYC Metro, DC/Beltway, and Research Triangle emerge as the dominant knowledge clusters.",
    insight:
      "The near-total absence of doctoral concentration across the interior of the country — visible as a flat teal plain between the coasts — is the story no bar chart tells as clearly as geography does.",
    method:
      "ACS 2024 educational attainment by county aggregated to H3 hexbin resolution 5. Sequential color scale. Physically-based crystal rendering with subsurface scattering.",
    image: "/images/work/hexbin-01.webp",
    images: [
      "/images/work/hexbin-01.webp",
      "/images/work/hexbin-02.webp",
    ],
    imageCrop: "center",
    /* Served from this site rather than a separate GitHub Pages deploy: it is
       one self-contained 117 KB file, and same-origin means it can be embedded
       in the piece's own page instead of bouncing the visitor off-site. */
    link: "/interactive/phd-hexbin-spring-map.html",
    source: "Data: ACS 2024 · H3 Hexbin R5 · PBR crystal render",
    tags: ["Census", "Hexbin", "H3", "Education", "Data Art"],
    hero: true,
  },
  {
    id: "passing-network",
    index: "09",
    title: "The Shape of a Team",
    editorialTitle: ["The shape", "of a team."],
    subtitle: "Passing Network × Centrality Analysis · Inter Miami CF",
    category: "Network Analysis · Sports",
    domain: "sports",
    tech: ["statistics", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#00E5FF",
    accentLabel: "Network Analysis",
    description:
      "Graph centrality rendered as physical material — glass nodes encode position by color and betweenness centrality by size, connected by neon plasma tube conduits whose luminance encodes pass frequency. Redondo sits at the topological center. Busquets dominates by degree. The network diagram as stadium-lit sculpture.",
    insight:
      "Centrality metrics reveal that Redondo — not Messi — is the structural spine of Inter Miami's attack. The eye follows the star. The algorithm follows the passes.",
    method:
      "Betweenness centrality (Freeman 1977, Brandes 2001). Node size = centrality score. Edge luminance = pass volume. Glass refraction + neon plasma tube rendering.",
    /* Imageless since S-9, and pointing at a PNG that never existed. The art
       turned up in Favorite Images/MLS_Centrality — it is the passing-network
       piece exactly, not the shot map that was mistaken for it earlier. */
    image: "/images/work/passing-network.webp",
    imageCrop: "center",
    source: "Data: MLS Stats API 2025 · NetworkX · Betweenness centrality",
    tags: ["Network Analysis", "Graph Theory", "MLS", "Sports Analytics"],
    hero: false,
  },
  {
    id: "rankflow",
    index: "10",
    title: "The Season in Ribbons",
    editorialTitle: ["The season", "in ribbons."],
    subtitle: "MLS Standing Flows · 33 Matchweeks · 30 Teams",
    category: "Temporal Analysis · Data Art",
    domain: "sports",
    tech: ["analytics", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#E8A030",
    accentLabel: "Temporal Analysis",
    description:
      "Season-long standing changes encoded as colored ribbon streams — each team a continuous thread moving through thirty-three matchweeks. The crossings are the story: momentum, collapse, late surges, early implosions. Rendered with shallow depth-of-field on paper texture, the ribbons read as physical objects.",
    insight:
      "The density of crossings in the first eight weeks reveals that MLS standings are essentially random early in the season — a detail invisible in any final table.",
    method:
      "Sankey-style rank flow across 33 matchweeks. Each ribbon = one club, colored by identity. Paper texture background. Shallow DOF with cast shadows.",
    image: "/images/work/rankflow.webp",
    images: [
      "/images/work/rankflow.webp",
      "/images/work/rankflow-2.webp",
      "/images/work/rankflow-3.webp",
    ],
    imageCrop: "center",
    source: "Data: MLS Stats API 2025 · 30 Teams · 33 Matchweeks",
    tags: ["Rank Flow", "Temporal", "MLS", "Data Art", "Paper Texture"],
    hero: false,
  },
  {
    id: "geocode-swirl",
    index: "11",
    title: "Inside the Pipeline",
    editorialTitle: ["Inside", "the pipeline."],
    subtitle: "Geospatial Code Swirl · Self-Portrait as Workflow",
    category: "Personal Work · Data Art",
    domain: "infrastructure",
    tech: ["gis", "dataviz"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#F5DEB3",
    accentLabel: "Personal",
    description:
      "A self-portrait as a data pipeline. The toroidal ring is built from real geospatial code — import geopandas, ST_Distance, spatial_join, model.fit — rendered as warm amber volumetric light. The figure is in profile, focused, calm. The data orbits him. He built it.",
    insight:
      "Every pipeline is someone's sustained act of will. This is what that looks like from the outside.",
    method:
      "Cinematic 3D render. Toroidal geometry with legible Python and SQL syntax. Amber volumetric emission. Physical floor reflection. DOF: figure sharp, ring soft.",
    image: "/images/work/cinematic_code_swirl_v1_geocode.webp",
    imageCrop: "top",
    source: "Original work · Cinematic 3D render · 2026",
    tags: ["Personal", "Data Art", "Pipeline", "Self-Portrait"],
    hero: true,
  },
  {
    id: "mls-dashboard",
    index: "12",
    title: "MLS Analytics Dashboard",
    editorialTitle: ["Analytics as", "craft."],
    subtitle: "Full-Stack Sports Analytics · 881 Players · 30 Teams · 2025 Season",
    category: "Full-Stack Engineering",
    domain: "sports",
    tech: ["fullstack", "analytics", "webgl3d"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#7F77DD",
    accentLabel: "Full-Stack",
    description:
      "Production-grade interactive analytics platform for Major League Soccer. Five analytical views: player performance radar, team salary allocation, attendance gravity, 3D travel arc map, and narrative season timeline. Built in six weeks with React 19, TypeScript, Three.js, and a custom 3D chart design system.",
    insight:
      "Every chart has a name, a story, and a how-to-read explanation. Data without explanation is just decoration.",
    method:
      "React 19 + TypeScript + Vite. Custom 3D chart shapes with directional lighting. Three.js globe. All data client-side — no API calls, instant load.",
    /* Was cinematic-hero.webp — the same 3D shot map picture piece 37
       (mls-shotmap) already uses, re-encoded under a second path, so two
       cards showed one image.

       The hero is now the titanium shield macro. This is a deliberate
       exception to the "wordmarks, not logo files" rule in the Design
       Decision Log, made by Patrick on 2026-07-30 after the conflict was
       flagged: the MLS shield is a registered third-party mark, and using it
       to front a card risks reading as an official league product rather
       than independent analysis of published data. Recorded in the Decision
       Log so it is not silently reversed. The dashboard renders follow it in
       the crossfade, which is where the product itself is actually shown. */
    image: "/images/work/mls-logo-macro.webp",
    images: [
      "/images/work/mls-logo-macro.webp",
      "/assets/projects/mls-dashboard/gallery-methods.webp",
      "/assets/projects/mls-dashboard/gallery-rankings.webp",
      "/images/work/mls-home-away.webp",
    ],
    caseStudy: "mls-dashboard",
    imageCrop: "top",
    link: "https://mls-dashboard-one.vercel.app/",
    /* The design-system write-up that accompanies this piece. */
    articleUrl:
      "https://www.linkedin.com/pulse/maturing-dashboard-design-system-patrick-anderson-rwhve/",
    source: "Stack: React 19 · Three.js · Recharts · TypeScript · Vercel",
    tags: ["React", "Three.js", "TypeScript", "Full-Stack", "Sports"],
    hero: false,
  },
  {
    id: "toxic-release",
    index: "13",
    title: "Facility Emissions & Toxic Release",
    editorialTitle: ["Where the air", "carries a cost."],
    subtitle: "EPA & EIA Facility-Level Emissions · Midwest Corridor",
    category: "Environmental Science",
    domain: "environmental",
    tech: ["gis", "analytics"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#00C897",
    accentLabel: "Environmental",
    description:
      "Facility-level greenhouse gas and toxic release data from the EPA and EIA, mapped by industry group across the Midwest — chemicals, metals, natural gas, petroleum, and power generation. Point size encodes reported CO2e emissions; color encodes industry class.",
    insight:
      "Emissions data is public, but almost nobody looks at it spatially. Once you map it, the corridor of concentrated industrial output along the Ohio River becomes impossible to unsee.",
    method:
      "EPA Greenhouse Gas Reporting Program and EIA facility datasets. Proportional-symbol mapping by reported CO2e. Compiled with Jon Sherwood and Blake Lytle, Clemson Center for Geospatial Technologies.",
    image: "/images/work/toxic-release-01.webp",
    images: [
      "/images/work/toxic-release-01.webp",
      "/images/work/toxic-release-02.webp",
      "/images/work/toxic-release-03.webp",
      "/images/work/toxic-release-04.webp",
      "/images/work/toxic-release-05.webp",
      "/images/work/toxic-release-06.webp",
      "/images/work/toxic-release-07.webp",
    ],
    link: "https://public.tableau.com/app/profile/patrick.anderson8240/viz/PowerPlantToxicity/Dashboard1",
    imageCrop: "center",
    source: "Data: EPA GHGRP · EIA · Clemson Center for Geospatial Technologies",
    tags: ["EPA", "Emissions", "Environmental", "Clemson"],
    hero: true,
  },
  {
    id: "global-temperatures",
    index: "14",
    title: "A Century and a Half of Warming",
    editorialTitle: ["A century of", "rising heat."],
    subtitle: "Global Surface Temperature Anomaly · 1850–2020s",
    category: "Climate · Data Viz",
    domain: "environmental",
    tech: ["statistics", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#4A90D9",
    accentLabel: "Climate",
    description:
      "Monthly global surface temperature, expressed as departure from the historical median, from 1850 to today. A heatmap by month sits above a scatter of every monthly anomaly — blue giving way to pink as the twentieth century closes.",
    insight:
      "The chart doesn't need commentary. The color shift from blue to pink makes the trend load-bearing before you've read a single number.",
    method:
      "Monthly surface temperature anomaly relative to the 1961–1990 average. Source: Met Office Hadley Centre. Built in Tableau.",
    image: "/images/work/global-temperatures-01.webp",
    images: [
      "/images/work/global-temperatures-01.webp",
      "/images/work/global-temperatures-02.webp",
      "/images/work/global-temperatures-03.webp",
      "/images/work/global-temperatures-04.webp",
      "/images/work/global-temperatures-05.webp",
      "/images/work/global-temperatures-06.webp",
      "/images/work/global-temperatures-07.webp",
    ],
    link: "https://public.tableau.com/app/profile/patrick.anderson8240/viz/Globaltemperatures_15626828212560/GlobalTemperatures",
    imageCrop: "center",
    source: "Data: Met Office Hadley Centre for Climate Change",
    tags: ["Climate", "Temperature", "Tableau", "Time Series"],
    hero: false,
  },
  {
    id: "mt-rainier-topo",
    index: "15",
    title: "Mount Rainier, Rendered in Relief",
    editorialTitle: ["A mountain,", "measured."],
    subtitle: "3D Topographic Symbology · USGS 30m DEM",
    category: "GIS · Cartography",
    domain: "environmental",
    tech: ["gis", "remote-sensing", "dataviz"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#E8A030",
    accentLabel: "Cartography",
    description:
      "Washington's Mount Rainier rendered in 3D from USGS elevation data, 30-meter raster cells, explored across multiple symbology and color-scale treatments — the same terrain, restated in different visual languages.",
    insight:
      "The data doesn't change between renders. What changes is which features the eye is drawn to first — a reminder that symbology is an argument, not just decoration.",
    method:
      "USGS Digital Elevation Model, 30m × 30m raster cells. 3D rendering in ArcGIS Pro with multiple color-ramp treatments.",
    image: "/images/work/mt-rainier-topography.webp",
    images: [
      "/images/work/mt-rainier-topography.webp",
      "/images/work/mt-rainier-topography-2.webp",
      "/images/work/mt-rainier-topography-3.webp",
    ],
    imageCrop: "center",
    source: "Data: USGS 30m DEM",
    tags: ["Topography", "3D", "USGS", "Cartography"],
    hero: false,
  },
  {
    id: "politics-uk",
    index: "16",
    title: "Politics in the U.K.",
    editorialTitle: ["How presentation", "shapes the message."],
    subtitle: "2015 UK General Election · Classification & Symbology Study",
    category: "Civic · Data Viz",
    domain: "civic",
    tech: ["statistics", "dataviz"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#7F77DD",
    accentLabel: "Civic",
    description:
      "An exploration of how the presentation of information shapes its message, using 2015 UK general election data as the test case — voter turnout, vote share, and party by constituency, worked through both quantitative classification and qualitative area- and point-based thematic mapping.",
    insight:
      "The same election data, classified two different ways, tells two different stories. Normalization isn't a technical footnote — it's an editorial decision.",
    method:
      "Data classification and normalization study on 2015 UK general election results. Thematic maps in area-based and point-based symbology by party.",
    image: "/images/work/politics-in-the-uk.webp",
    images: [
      "/images/work/politics-in-the-uk.webp",
      "/images/work/politics-in-the-uk-2.webp",
    ],
    imageCrop: "center",
    source: "Data: 2015 UK General Election results",
    tags: ["Politics", "Classification", "Thematic Mapping", "UK"],
    hero: false,
  },
  {
    id: "sf-crime",
    index: "17",
    title: "Fighting Crime with GIS and R",
    editorialTitle: ["Where the city", "runs hot."],
    subtitle: "San Francisco Crime Hotspot Analysis · Getis-Ord Gi*",
    category: "Public Safety · Spatial Analysis",
    domain: "civic",
    tech: ["gis", "statistics"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#E05555",
    accentLabel: "Public Safety",
    description:
      "Hotspot analysis of reported crime across San Francisco, built entirely in R and GIS. Hexbin aggregation with Getis-Ord Gi* statistical confidence extruded into 3D — the Tenderloin and SOMA corridor rise as the city's clearest concentration of statistically significant hotspots.",
    insight:
      "A dot map of crime just shows where people are. A Gi* hotspot map shows where crime clusters beyond what population density alone would predict — a very different, much more useful, question.",
    method:
      "Hexbin spatial aggregation. Getis-Ord Gi* hotspot statistic. Built with R (sf, spdep) and GIS.",
    image: "/images/work/sf-crime-01.webp",
    images: [
      "/images/work/sf-crime-01.webp",
      "/images/work/sf-crime-02.webp",
      "/images/work/sf-crime-03.webp",
      "/images/work/sf-crime-04.webp",
      "/images/work/sf-crime-05.webp",
      "/images/work/sf-crime-06.webp",
      "/images/work/sf-crime-07.webp",
      "/images/work/sf-crime-08.webp",
      "/images/work/sf-crime-09.webp",
      "/images/work/sf-crime-10.webp",
    ],
    imageCrop: "center",
    source: "Method: Getis-Ord Gi* · Built in R",
    tags: ["R", "GIS", "Hotspot Analysis", "Public Safety"],
    hero: true,
  },
  {
    id: "storm-tracking",
    index: "18",
    title: "Storm Tracking",
    editorialTitle: ["Every storm,", "a thread."],
    subtitle: "Atlantic & Gulf Storm Track Visualization",
    category: "Environmental · Hazards",
    domain: "environmental",
    tech: ["gis", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#FF6B2B",
    accentLabel: "Hazards",
    description:
      "Historical storm tracks across the Atlantic basin and Gulf of Mexico, each system rendered as a distinct colored thread against a dark basemap — the paths cross, tangle, and fan out from the Caribbean toward the U.S. coastline.",
    insight:
      "Individually, a storm track is a line on a map. Layered together across seasons, the tracks reveal the geography of risk — which coastlines get hit again and again.",
    method:
      "Historical Atlantic and Gulf storm track data. Multi-track path rendering by system, color-coded for legibility.",
    image: "/images/work/storm-tracking-01.webp",
    images: [
      "/images/work/storm-tracking-01.webp",
      "/images/work/storm-tracking-02.webp",
    ],
    imageCrop: "center",
    source: "Data: Historical Atlantic storm track records",
    tags: ["Storms", "Hazards", "Atlantic", "Track Mapping"],
    hero: false,
  },
  {
    id: "northridge-earthquake",
    index: "19",
    title: "Tremors in Northridge",
    editorialTitle: ["Ten seconds", "that moved a valley."],
    subtitle: "1994 Northridge Earthquake · Magnitude 6.7 · Southern California",
    category: "GIS · Seismic Analysis",
    domain: "environmental",
    tech: ["gis", "dataviz"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#8B4040",
    accentLabel: "Seismic",
    description:
      "At 4:30 a.m. on January 17, 1994, a magnitude 6.7 earthquake struck the San Fernando Valley, causing an estimated $20 billion in damage in roughly 10 to 20 seconds of shaking. This project reconstructs the event spatially: how fault lines shaped the valley's topography, the density and depth of 188 recorded aftershocks, and how far seismic waves traveled from the epicenter in the first seconds of the quake.",
    insight:
      "The damage from an earthquake doesn't come from how far the ground actually moves — it comes from how fast it accelerates. Mapping P-wave and S-wave travel distance in one-second intervals makes that distinction physical instead of abstract.",
    method:
      "Fault line overlay on high-resolution elevation data. 188 seismograph stations recording magnitude, depth, and timestamp. 3D aftershock spheres sized and colored by magnitude. Seismic wave travel-distance buffer rings.",
    image: "/images/work/northridge-earthquake-01.webp",
    images: [
      "/images/work/northridge-earthquake-01.webp",
      "/images/work/northridge-earthquake-02.webp",
    ],
    /* The subsurface aftershock cloud lives in the bottom third of this
       render, and a centred crop cut it off at gallery aspect ratios.
       object-position pulls the visible window down without a new asset. */
    imageCrop: "center 78%",
    source: "Data: 1994 Northridge Earthquake seismograph network · 188 stations",
    tags: ["Earthquake", "Seismic", "California", "Hazards"],
    hero: true,
  },
  {
    id: "us-migration-flows",
    index: "20",
    title: "US State Migration Flows",
    editorialTitle: ["Where America", "is moving."],
    subtitle: "2023 US Census Bureau State-to-State Migration",
    category: "Civic · Mobility Data",
    domain: "civic",
    tech: ["analytics", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#00C897",
    accentLabel: "Mobility",
    description:
      "2023 US Census Bureau state-to-state migration totals, rendered as bidirectional flow lines — over 2,500 state-to-state relationships, each flow and node color-coded and sized proportional to migrant count. Filtered down to a single state, the pattern becomes legible.",
    insight:
      "The full national dataset is honest but unreadable — 2,500 overlapping relationships. Filtering to one state's flows is what turns the data into a story anyone can follow.",
    method:
      "US Census Bureau 2023 state-to-state migration data. Bidirectional flow mapping via Flow Map City, an open-source in-browser mobility analytics tool.",
    image: "/images/work/us-migration-flows-01.webp",
    images: [
      "/images/work/us-migration-flows-01.webp",
      "/images/work/us-migration-flows-02.webp",
      "/images/work/us-migration-flows-03.webp",
      "/images/work/us-migration-flows-04.webp",
    ],
    imageCrop: "center",
    /* Patrick's own published map. Was pointing at flowmap.city's homepage —
       the tool, not the work. He supplied a LinkedIn shortlink; the resolved
       destination is stored instead, since lnkd.in is a redirector that can
       break and hides where it goes. */
    link: "https://app.flowmap.city/public/4785c936-724f-483c-92df-487b7654dfaf",
    source: "Data: US Census Bureau 2023 · Tool: Flow Map City",
    tags: ["Migration", "Census", "Flow Mapping", "Mobility"],
    hero: false,
  },
  {
    id: "vehicle-fuel-efficiency",
    index: "21",
    title: "Analysis of Vehicle Fuel Efficiency",
    editorialTitle: ["Efficiency,", "by the class."],
    subtitle: "Fuel Efficiency Dashboard · Make, Model, Class, Cylinder Count",
    category: "Civic · Data Viz",
    domain: "civic",
    tech: ["statistics", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#4A90D9",
    accentLabel: "Data Viz",
    description:
      "An interactive dashboard summarizing vehicle fuel efficiency by automotive make, model, vehicle class, fuel type, and engine cylinder count — built to make a dense dataset navigable by the comparisons people actually care about.",
    insight:
      "Fuel efficiency data is usually presented as a flat table. Breaking it out by class and cylinder count surfaces the comparisons that actually inform a purchase decision.",
    method:
      "Interactive dashboard summarizing vehicle fuel efficiency data by make, model, class, fuel type, and cylinder count.",
    image: "/images/work/vehicle-fuel-efficiency-01.webp",
    images: [
      "/images/work/vehicle-fuel-efficiency-01.webp",
      "/images/work/vehicle-fuel-efficiency-02.webp",
      "/images/work/vehicle-fuel-efficiency-03.webp",
      "/images/work/vehicle-fuel-efficiency-04.webp",
      "/images/work/vehicle-fuel-efficiency-05.webp",
    ],
    link: "https://public.tableau.com/app/profile/patrick.anderson8240/viz/Should-I-buy-the-hummer-or-the-prius_10_0_15760823655170/FuelEfficiencyComparision",
    imageCrop: "center",
    source: "Method: Interactive dashboard by vehicle class and cylinder count",
    tags: ["Vehicles", "Fuel Efficiency", "Dashboard", "Data Viz"],
    hero: false,
  },
  {
    id: "urban-growth",
    index: "22",
    title: "Visualizing Urban Growth",
    editorialTitle: ["A city,", "by building age."],
    subtitle: "Building Age Analysis in R · INSPIRE Building Footprints",
    category: "GIS · Urban Analysis",
    domain: "civic",
    tech: ["remote-sensing", "gis"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#7FC8C0",
    accentLabel: "Urban GIS",
    description:
      "An R-based exploration of the age of buildings within a city, using INSPIRE building footprint data. Province data was downloaded via RSS feed, buffered and intersected with tmaptools, and rendered with the tmap statistical mapping package — each building colored by construction era.",
    insight:
      "Building age is a proxy for a dozen things a planner actually cares about — density waves, redevelopment pressure, infrastructure age. A single choropleth of construction year makes decades of urban growth legible at a glance.",
    method:
      "INSPIRE building footprint data, downloaded via feed.extract() and filtered by province. Buffered and intersected with tmaptools (Geocode_OSM, st_buffer, st_intersection). Rendered with the tmap package; color ramp via colorRampPalette().",
    image: "/images/work/visualizing-urban-growth.webp",
    images: [
      "/images/work/visualizing-urban-growth.webp",
      "/images/work/visualizing-urban-growth-2.webp",
      "/images/work/visualizing-urban-growth-3.webp",
    ],
    imageCrop: "center",
    link: "https://rpubs.com/ptander01/769636",
    source: "Data: INSPIRE building footprints · Method: R, tmap, tmaptools",
    tags: ["Urban Growth", "R", "tmap", "INSPIRE"],
    hero: false,
  },
  {
    id: "agent-flow-visualizer-gallery",
    index: "23",
    title: "Visualizing the Machine That Built This Site",
    editorialTitle: ["The agents,", "made visible."],
    subtitle: "Multi-Agent Orchestration · 57 Tasks · 20 Days",
    category: "AI Infrastructure · Meta",
    domain: "infrastructure",
    tech: ["fullstack", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#E8A030",
    accentLabel: "AI Infrastructure",
    description:
      "A standalone node-graph visualization of the multi-agent AI orchestration used to build this entire portfolio ecosystem — 57 tasks, 2,580 messages, and 907 file attachments across 7 parallel projects over 20 days. Project nodes cluster into task nodes; a bottom timeline replays the full execution history.",
    insight:
      "The portfolio itself is the primary artifact. This is the meta-artifact — proof of the workflow that produced it, not just the output.",
    method:
      "React Flow node graph with dagre layout. Project clusters branch into task nodes; execution timeline drives graph highlighting. Data sourced from the Manus API.",
    image: "/images/work/agent-flow-visualizer.webp",
    images: [
      "/images/work/agent-flow-visualizer.webp",
      "/images/work/agent-flow-visualizer-2.webp",
      "/images/work/agent-flow-visualizer-3.webp",
    ],
    caseStudy: "agent-flow-visualizer",
    imageCrop: "top",
    link: "https://agentflow-eaqzkikc.manus.space",
    source: "Data: Manus API · 57 tasks · 2,580 messages · 907 files · Mar 10–29, 2026",
    tags: ["AI", "Multi-Agent", "React Flow", "Meta"],
    hero: false,
  },
  {
    id: "earth-from-above",
    index: "24",
    title: "Earth from Above",
    editorialTitle: ["The whole planet,", "one lens."],
    subtitle: "Global Remote Sensing Survey · SOLARGIS",
    category: "Remote Sensing",
    domain: "environmental",
    tech: ["remote-sensing", "dataviz"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#00E5FF",
    accentLabel: "Remote Sensing",
    description:
      "A global exploration using SOLARGIS satellite data — land classification, air temperature, population density, and optimal photovoltaic tilt angle, layered across the planet at a scale where climate and infrastructure patterns become visible together.",
    insight:
      "Land classification, temperature, and population density are usually three separate datasets. Overlaying them at global scale reveals how tightly human settlement patterns track climate constraints.",
    method:
      "SOLARGIS satellite data. Layers: satellite imagery, land classification, air temperature, population density, optimal PV array tilt, solar energy radiation.",
    image: "/images/work/earth-from-above.webp",
    images: [
      "/images/work/earth-from-above.webp",
      "/images/work/earth-from-above-2.webp",
      "/images/work/earth-from-above-3.webp",
    ],
    imageCrop: "center",
    source: "Data: SOLARGIS global satellite dataset",
    tags: ["Remote Sensing", "SOLARGIS", "Global", "Satellite"],
    hero: false,
  },
  {
    id: "dc-consensus-model",
    index: "25",
    title: "AI Data Center Consensus Tracker",
    editorialTitle: ["Nine sources,", "one map."],
    subtitle: "Geospatial Intelligence Platform · 120 Campuses · 280 Buildings",
    category: "AI Infrastructure · Geospatial Intelligence",
    domain: "infrastructure",
    tech: ["gis", "fullstack", "analytics"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#00C897",
    accentLabel: "AI Infrastructure",
    description:
      "An interactive geospatial dashboard that harmonizes data from 9 vendor sources into a unified consensus view of AI data center construction — 120 campuses and 280 buildings, each cross-referenced across conflicting reports to a single reconciled record.",
    insight:
      "No two data center trackers agree with each other. The interesting problem isn't collecting the data — it's building the harmonization logic that decides which source to trust when they conflict.",
    method:
      "Ingestion and reconciliation of 9 vendor data sources into a unified schema. MapLibre GL for the campus/building map layer, Apache ECharts for trend visualization, TanStack Table for the harmonization table.",
    image: "/images/work/dc-consensus-model.webp",
    images: [
      "/images/work/dc-consensus-model.webp",
      "/images/work/dc-consensus-model-2.webp",
      "/images/work/dc-consensus-model-3.webp",
    ],
    caseStudy: "consensus-viewer",
    imageCrop: "center",
    link: "https://aidatacentertracker.vercel.app/",
    source: "Stack: MapLibre GL · Apache ECharts · TanStack Table · TypeScript",
    tags: ["MapLibre GL", "AI Infrastructure", "Data Reconciliation", "TypeScript"],
    hero: true,
  },
  {
    id: "brain-mri-explorer",
    index: "26",
    title: "The Terrain Inside",
    editorialTitle: ["The terrain", "inside."],
    subtitle: "Interactive 3D Brain Explorer · DICOM → WebGL · Own MRI, 2026",
    category: "Medical Imaging · Volumetric Analysis",
    domain: "healthcare",
    tech: ["webgl3d", "aiml", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#378ADD",
    accentLabel: "Medical Imaging",
    description:
      "Built from my own MRI — 192 sagittal T1 slices carried from raw DICOM through skull-stripping, deep-learning segmentation, and mesh generation into a WebGL app you can rotate, slice, and pull apart. Fourteen structure layers, seven subcortical nuclei meshed bilaterally, and a 31-region cortical map traced from my own sulci rather than an atlas average.",
    insight:
      "Spatial analysis was never really about geography. A brain is a volume with coordinate frames, boundaries, and structures to segment — the same reasoning I point at terrain and satellite rasters, turned inward.",
    method:
      "6,212 DICOM instances recovered from truncated exports. Skull-stripped, then segmented with ANTsPyNet Desikan-Killiany-Tourville labeling for 31 cortical regions plus deep nuclei. Marching-cubes meshing with baked ambient occlusion; rendered in Three.js with image-based lighting and a live cross-section plane.",
    image: "/images/work/brain-mri-explorer.webp",
    imageCrop: "center",
    link: "https://brain-mri-explorer.vercel.app",
    source: "Data: Own MRI · SAG T1 MPRAGE, 192 slices · DKT parcellation (ANTsPyNet)",
    tags: ["Three.js", "WebGL", "DICOM", "Medical Imaging", "Segmentation"],
    hero: true,
  },
  {
    id: "dc-graveyard",
    index: "27",
    title: "The Data Center Graveyard",
    editorialTitle: ["Where the buildout", "stalls."],
    subtitle: "At-Risk & Failed Data Center Projects · 28 Sites · 11 States",
    category: "AI Infrastructure · Risk Intelligence",
    domain: "infrastructure",
    tech: ["gis", "fullstack", "analytics"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#FF6B6B",
    accentLabel: "Risk Intelligence",
    description:
      "A risk intelligence dashboard tracking 28 at-risk or failed data center projects across 11 US states — opposition factors, regulatory status, and residual investment potential for sites that stalled, were blocked, or were abandoned outright.",
    insight:
      "Everyone maps the data centers that got built. The ones that didn't are where the actual siting constraints show up — local opposition, grid interconnect queues, water. Failure is the more informative dataset.",
    method:
      "Project-level tracking across 11 states with stage-gate classification and opposition-factor coding. MapLibre GL for the site map, Apache ECharts for stage and risk breakdowns, TanStack Table for the case profiles.",
    image: "/assets/projects/dc-graveyard/hero.webp",
    imageCrop: "center",
    link: "https://dc-graveyard-dashboard.vercel.app/",
    caseStudy: "dc-graveyard",
    source: "Stack: MapLibre GL · Apache ECharts · TanStack Table · TypeScript",
    tags: ["MapLibre GL", "Risk Analysis", "AI Infrastructure", "TypeScript"],
    hero: false,
  },
  {
    id: "chrono-sankey",
    index: "28",
    title: "The Bible, Reordered",
    editorialTitle: ["Two orders,", "one canon."],
    subtitle: "Canonical vs. Chronological Order · 66 Books → 14 Eras · Sankey",
    category: "Data Storytelling · History & Religion",
    domain: "history",
    tech: ["dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#C9A84C",
    accentLabel: "Data Storytelling",
    description:
      "The Bible's table of contents is not its timeline — Job sits mid-canon but belongs among the earliest events, and the prophets scatter across five centuries. A Sankey diagram routes all 66 books from their traditional canonical position into 14 chronological eras, making every crossing visible. Published in two Flourish views: a detailed book-level version and an aggregated era-level companion.",
    insight:
      "The canon is a library, not a chronicle. Readers assume the books sit in time order — they don't, and one diagram of the crossings communicates that faster than any explanation.",
    method:
      "Book-to-era mapping assembled from an ESV chronological reading plan, rendered as a two-column Sankey in Flourish. Ribbon crossings encode the distance between a book's shelf position and its place in time.",
    image: "/images/work/chrono-sankey.webp",
    imageCrop: "center",
    link: "https://public.flourish.studio/visualisation/25256067/",
    source: "Tool: Flourish · Data: ESV chronological reading plan · 2 views",
    tags: ["Sankey", "Flourish", "Data Storytelling", "Biblical History"],
    hero: true,
  },
  {
    id: "jesus-world",
    index: "29",
    title: "Jesus's World",
    editorialTitle: ["An atlas of", "the Gospels."],
    subtitle: "Interactive Atlas · Ministry Map & Timeline · AD 29–33",
    category: "Interactive Atlas · History & Religion",
    domain: "history",
    tech: ["gis", "dataviz", "fullstack"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#6FA875",
    accentLabel: "Interactive Atlas",
    description:
      "A single-page atlas of the Gospels: a D3 map of the ministry years AD 29–33, a timeline whose events open through four progressive levels of detail, a Play mode that narrates the whole arc, a data-visualization page, and a scroll-driven Passion Week reader. The narrative geography of the Gospels, made navigable.",
    insight:
      "The Gospels are dense with places most readers skim past. Put every named site on a map, tie it to a timeline, and the geography stops being scenery — it becomes the interface to the text.",
    method:
      "React 19 + Vite. D3 geographic projection for the ministry map, a four-state progressive-disclosure event system, a CSS-animated depth-glide parallax hero, and a scroll-driven Passion Week reader with a Jerusalem diagram.",
    image: "/images/work/jesus-world.webp",
    images: [
      "/images/work/jesus-world.webp",
      "/images/work/jesus-world-2.webp",
      "/images/work/jesus-world-3.webp",
    ],
    imageCrop: "center",
    link: "https://jesus-world.vercel.app",
    source: "Stack: React 19 · Vite · D3 · Deployed on Vercel",
    tags: ["D3", "React 19", "Interactive Atlas", "Scrollytelling", "Timeline"],
    hero: true,
  },
  {
    id: "pauls-world",
    index: "30",
    title: "Paul's World",
    editorialTitle: ["The journeys,", "traced."],
    subtitle: "Missionary Journeys & Letters · Interactive Map · AD 46–67",
    category: "Interactive Atlas · History & Religion",
    domain: "history",
    tech: ["gis", "dataviz", "fullstack"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#5B8DD6",
    accentLabel: "Interactive Atlas",
    description:
      "An interactive map of Paul's missionary journeys across the Mediterranean, AD 46–67. Each journey toggles on and off as its own colored route, and a linked timeline aligns every epistle to the leg of the journey where it was written — the correspondence becomes a travelogue.",
    insight:
      "Thirteen letters read differently once they sit on a map. Distance, detour, and imprisonment stop being footnotes and become the structure of the story.",
    method:
      "React + Vite with a vector Mediterranean basemap, per-journey route toggles with provincial boundary overlays, and a books-to-timeline rail that places each letter in its journey window.",
    image: "/images/work/pauls-world.webp",
    images: [
      "/images/work/pauls-world.webp",
      "/images/work/pauls-world-2.webp",
      "/images/work/pauls-world-3.webp",
    ],
    imageCrop: "center",
    link: "https://pauls-world.vercel.app",
    source: "Stack: React · Vite · Deployed on Vercel",
    tags: ["Interactive Map", "React", "Timeline", "Biblical History"],
    hero: false,
  },
  {
    id: "bible-timeline",
    index: "31",
    title: "Bible Timeline",
    editorialTitle: ["Forty centuries,", "one axis."],
    subtitle: "ESV Chronological · ~4000 BC – AD 95 · Zoomable Timeline",
    category: "Interactive Timeline · History & Religion",
    domain: "history",
    tech: ["dataviz", "fullstack"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#B8933F",
    accentLabel: "Interactive Timeline",
    description:
      "A zoomable timeline of the whole biblical narrative, ~4000 BC to AD 95: era navigation from Primeval History to the Early Church, parallel lanes for events, books, kings, prophets, and figures, and a world-context band that keeps Egypt, Assyria, Babylon, and Rome in frame. Genre-colored books, search, a brush minimap, and dark and parchment themes.",
    insight:
      "Most scripture timelines flatten everything into evenly spaced boxes. Kept proportional, the axis itself becomes the argument — centuries of silence and dense, pivotal decades read at a glance.",
    method:
      "React + Vite with a d3-zoom time axis. Layered swim-lanes for people, books, and events, era pill navigation, a brush minimap, and a fully token-driven theme system with dark and parchment modes.",
    image: "/images/work/bible-timeline.webp",
    images: [
      "/images/work/bible-timeline.webp",
      "/images/work/bible-timeline-2.webp",
      "/images/work/bible-timeline-3.webp",
    ],
    imageCrop: "center",
    link: "https://bible-timeline-pink.vercel.app",
    source: "Stack: React · Vite · D3 · ESV chronological framework",
    tags: ["D3", "Timeline", "React", "Data Density", "Theming"],
    hero: false,
  },
  {
    id: "bible-study-library",
    index: "32",
    title: "Bible Study Library",
    editorialTitle: ["Fifty studies,", "one system."],
    subtitle: "Resource Library · 48+ Studies · 58+ Word Studies · 3 Apps",
    category: "Resource Library · History & Religion",
    domain: "history",
    tech: ["fullstack"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#7C89C0",
    accentLabel: "Resource Library",
    description:
      "A growing library of 48+ interactive study guides — foundational series, first-principles studies, audio listen-mode companions, and three full interactive apps — each built as a self-contained HTML/JS page that runs anywhere with no build step, unified under one library index.",
    insight:
      "Fifty standalone pages with one shared design language is a different engineering discipline than one app: the system has to live in conventions and tokens, not in a component framework.",
    method:
      "Hand-built HTML/CSS/JS study guides sharing a token-driven design system — guide modes, word-study cards, characteristic filters, and audio companions — published as static pages on GitHub Pages.",
    image: "/images/work/bible-study-library.webp",
    images: [
      "/images/work/bible-study-library.webp",
      "/images/work/bible-study-library-2.webp",
      "/images/work/bible-study-library-3.webp",
    ],
    imageCrop: "center",
    link: "https://ptander01.github.io/Bible-Study-Library/",
    source: "Stack: HTML · CSS · JavaScript · GitHub Pages",
    tags: ["Design System", "HTML/JS", "Resource Library", "GitHub Pages"],
    hero: false,
  },
  {
    id: "holy-spirit-study",
    index: "33",
    title: "The Holy Spirit in Scripture",
    editorialTitle: ["Eighteen months,", "ninety-six observations."],
    subtitle: "Study App · 96 Observations · 10 Characteristics · Genesis → Revelation",
    category: "Study App · History & Religion",
    domain: "history",
    tech: ["dataviz", "analytics"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#C77B3A",
    accentLabel: "Study App",
    description:
      "The capstone of an eighteen-month study: every observation of the Spirit across the canon, coded against ten characteristics and served five ways — a filterable characteristic matrix, a timeline, thematic lenses, an application view, and notes. Any row opens a verse-level deep dive.",
    insight:
      "It's a dataset before it's a devotional — 96 rows, ten coded columns, and the same filter-and-facet interface I'd put on any analytics product. Rigor and reverence turn out to be compatible.",
    method:
      "Single-file HTML/JS application over a hand-coded observation dataset. Characteristic and testament filters, passage search, observation and matrix view toggles, and per-verse deep-dive pages.",
    image: "/images/work/holy-spirit-study.webp",
    images: [
      "/images/work/holy-spirit-study.webp",
      "/images/work/holy-spirit-study-2.webp",
      "/images/work/holy-spirit-study-3.webp",
    ],
    imageCrop: "center",
    link: "https://ptander01.github.io/Bible-Study-Library/resource-series/holy-spirit-study_32.html",
    source: "Stack: HTML · CSS · JavaScript · 96-observation coded dataset",
    tags: ["Data Design", "HTML/JS", "Faceted Filtering", "Word Studies"],
    hero: false,
  },
  {
    id: "tcf-elevation",
    index: "34",
    title: "The Shape of the Ground",
    editorialTitle: ["Bare earth,", "and everything on it."],
    subtitle: "Town Creek Farms · DEM vs DSM · Canopy Structure from UAV Survey",
    category: "Terrain Analysis · Agriculture",
    domain: "environmental",
    tech: ["remote-sensing", "gis"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#8FA860",
    accentLabel: "Terrain Analysis",
    description:
      "The same farm surveyed twice over: a digital elevation model stripped to bare earth, and a digital surface model that keeps every tree, roofline, and equipment shed standing. Subtracting one from the other leaves canopy height — the vegetation structure of the property as a measurable layer rather than a look.",
    insight:
      "Bare earth and surface are the same flight, differently interpreted. The gap between them is the part of a property nobody has a number for until someone subtracts.",
    method:
      "UAV photogrammetric survey processed to a dense point cloud, then classified into ground and non-ground returns. DEM from ground points, DSM from first returns; canopy height model as the difference.",
    image: "/images/work/tcf-elevation.webp",
    images: [
      "/images/work/tcf-elevation.webp",
      "/images/work/tcf-elevation-2.webp",
      "/images/work/tcf-elevation-3.webp",
      "/images/work/tcf-elevation-4.webp",
    ],
    imageCrop: "center",
    source: "Data: Own UAV survey · Point cloud classification · DEM / DSM / CHM",
    tags: ["DEM", "DSM", "Canopy Height", "Photogrammetry", "Agriculture"],
    hero: true,
  },
  {
    id: "tcf-illumination",
    index: "35",
    title: "Where the Light Falls, Hour by Hour",
    editorialTitle: ["The day,", "in twelve panels."],
    subtitle: "Town Creek Farms · Hourly Illumination Model · Terrain-Shadowed",
    category: "Solar Modeling · Agriculture",
    domain: "environmental",
    tech: ["gis", "remote-sensing", "analytics"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#E8A030",
    accentLabel: "Solar Modeling",
    description:
      "Direct illumination modeled hour by hour across a working farm, with the terrain casting its own shadows. Laid out as a grid, the day reads as a sequence — the north slope holding shade long after the ridge has been lit, and the low ground going dark first.",
    insight:
      "A daily solar total hides the thing that actually matters to a grower: *when* a given acre is lit. Shade at 8am and shade at 2pm are different problems.",
    method:
      "Hourly solar position computed for the site and cast against the UAV-derived surface model, so terrain and canopy both occlude. Rendered as an hourly small-multiple grid.",
    image: "/images/work/tcf-illumination.webp",
    images: [
      "/images/work/tcf-illumination.webp",
      "/images/work/tcf-illumination-2.webp",
    ],
    imageCrop: "center",
    source: "Method: Hourly solar position · Terrain-shadowed illumination model",
    tags: ["Solar", "Illumination", "Small Multiples", "Agriculture", "GIS"],
    hero: false,
  },
  {
    id: "uav-photogrammetry",
    index: "36",
    title: "Flying the Survey",
    editorialTitle: ["Photographs,", "turned into ground."],
    subtitle: "UAV Photogrammetry · Dense Point Cloud → Classified Surface",
    category: "Photogrammetry · Data Capture",
    domain: "environmental",
    tech: ["remote-sensing", "gis", "webgl3d"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#5FBFD0",
    accentLabel: "Photogrammetry",
    description:
      "The step before every terrain product: fly the site, and turn overlapping photographs into a dense point cloud that can be classified, meshed, and measured. Shown deconstructed — orthomosaic, point cloud, classified ground, and derived surface pulled apart into the layers they actually are.",
    insight:
      "Most spatial work starts with someone else's data. Flying it yourself means the resolution, the timing, and the accuracy are decisions rather than constraints you inherited.",
    method:
      "Licensed remote-pilot UAV survey with overlapping imagery, processed through structure-from-motion into a dense point cloud, then classified and meshed into orthomosaic and elevation products.",
    image: "/images/work/uav-photogrammetry.webp",
    images: [
      "/images/work/uav-photogrammetry.webp",
      "/images/work/uav-photogrammetry-2.webp",
      "/images/work/uav-photogrammetry-3.webp",
      "/images/work/uav-photogrammetry-4.webp",
    ],
    imageCrop: "center",
    source: "Method: Structure-from-motion · Dense cloud · Point classification",
    tags: ["UAV", "Photogrammetry", "Point Cloud", "Remote Pilot", "LiDAR"],
    hero: true,
  },
  {
    id: "mls-shotmap",
    index: "37",
    title: "Every Shot, Weighted",
    editorialTitle: ["Twenty-one shots,", "one expected goal."],
    subtitle: "3D Shot Map × xG · Inter Miami 4–0 Toronto FC · 21 Shots",
    category: "Sports Analytics · Expected Goals",
    domain: "sports",
    tech: ["dataviz", "statistics", "analytics"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#FF4D6D",
    accentLabel: "Expected Goals",
    description:
      "All 21 shots from a 4–0 result, plotted as glass spheres sized by expected goal value with neon arcs tracing each shot's path toward goal. Inter Miami generated 1.03 xG from 13 shots and converted four of them — a scoreline well ahead of the underlying numbers.",
    insight:
      "A 4–0 scoreline and 1.03 expected goals are two different stories about the same ninety minutes. Shot quality explains which one was likelier to repeat.",
    method:
      "Shot-level event data with xG values, positioned in 3D on the pitch surface. Sphere volume encodes xG; trajectory arcs encode shot path and outcome. Built as a view within the MLS analytics dashboard.",
    image: "/images/work/mls-shotmap.webp",
    images: [
      "/images/work/mls-shotmap.webp",
      "/images/work/mls-shotmap-2.webp",
      "/images/work/mls-shotmap-3.webp",
      "/images/work/mls-shotmap-4.webp",
    ],
    imageCrop: "center",
    link: "https://mls-dashboard-one.vercel.app/",
    source: "Data: MLS shot events with xG · 3D pitch projection",
    tags: ["xG", "Sports Analytics", "3D", "Soccer", "MLS"],
    hero: false,
  },
  {
    id: "scid-access",
    index: "38",
    title: "How Far Is Care",
    editorialTitle: ["Twenty-five centers,", "and the drive to reach them."],
    subtitle: "VHA SCI/D System of Care · Drive-Time Catchments · FY2019–FY2023",
    category: "Healthcare Access · Spatial Epidemiology",
    domain: "healthcare",
    tech: ["gis", "statistics", "analytics"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#378ADD",
    accentLabel: "Healthcare Access",
    description:
      "The VA's Spinal Cord Injury and Disorder system runs as 25 hub centers with spokes feeding them, and the question posed was who can actually reach it. Catchments were drawn around each center by road-network commute rather than straight-line distance, then travel burden was tracked across five fiscal years to find where Veterans were drifting further from their care.",
    insight:
      "Proximity on a map is not access. Once a catchment is drawn by drive time instead of distance, territories that look balanced on paper turn out to carry very different travel burdens — and the fastest-growing ones are not always nearest a center.",
    method:
      "Catchment areas modeled as network-weighted proximity polygons accounting for road commute rather than Euclidean distance (ArcGIS Pro 3.3). Closest-facility analysis from the Network Analyst toolset, run against both closest hub and closest hub-or-spoke, summarized by territory across FY2019–FY2023 and tested for correlation against population change.",
    image: "/images/work/scid-access.webp",
    images: [
      "/images/work/scid-access.webp",
      "/images/work/scid-access-2.webp",
    ],
    imageCrop: "center",
    source: "Client: VHA SCI/D · Method: Network catchments · Closest Facility · ArcGIS Pro 3.3",
    tags: ["Healthcare Access", "Network Analysis", "Drive Time", "VHA", "Spatial Epidemiology"],
    hero: true,
  },
  {
    id: "scid-population",
    index: "39",
    title: "Where the Veterans Are",
    editorialTitle: ["A population,", "moving."],
    subtitle: "VHA SCI/D · Catchment Population & Five-Year Net Change · FY2019–FY2023",
    category: "Population Analysis · Healthcare",
    domain: "healthcare",
    tech: ["gis", "statistics", "analytics"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#5B8DD6",
    accentLabel: "Population Analysis",
    description:
      "Veteran population summarized to every hub territory and spoke across five fiscal years, then expressed in standard deviations so that real movement separates from ordinary year-to-year noise. Paired with the VA's rurality classification, the map shows which territories are growing, which are emptying, and how much of each system sits in rural and highly rural ZIP codes.",
    insight:
      "Growth and shrinkage were not evenly spread. Some territories gained enough Veterans to change what their center needs to be, while others lost more than a standard deviation — and rurality, not raw headcount, is what turns a population shift into an access problem.",
    method:
      "Annual Veteran population summarized by catchment for FY2019–FY2023. Change measured five ways — annual, five-year net, five-year average, annual percentage, five-year percentage — and normalized to standard deviations for significance. Rurality via the USDA/DHS Rural-Urban Commuting Area (RUCA) classification the VA uses.",
    image: "/images/work/scid-population.webp",
    images: [
      "/images/work/scid-population.webp",
      "/images/work/scid-population-2.webp",
      "/images/work/scid-population-3.webp",
      "/images/work/scid-population-4.webp",
      "/images/work/scid-population-5.webp",
      "/images/work/scid-population-6.webp",
      "/images/work/scid-population-7.webp",
    ],
    imageCrop: "center",
    source: "Client: VHA SCI/D · Population FY2019–FY2023 · RUCA rurality · Change in SD",
    tags: ["Population Analysis", "RUCA", "Rurality", "Change Detection", "VHA"],
    hero: true,
  },
  {
    id: "scid-utilization",
    index: "40",
    title: "Two and a Half Million Encounters",
    editorialTitle: ["Every visit,", "counted."],
    subtitle: "VHA SCI/D · 142 Facilities · 36,999 Patients · 2.5M Encounters",
    category: "Utilization Analytics · Healthcare",
    domain: "healthcare",
    tech: ["analytics", "dataviz", "gis"],
    hasStatic: true,
    /* VA-internal dashboard — there is no public link and there never will be,
       so the Format facet must not promise one. Corrected 2026-07-30. */
    hasInteractive: false,
    accent: "#E8A030",
    accentLabel: "Utilization Analytics",
    description:
      "The demand side of the same system: 2.5 million encounters across 142 facilities and roughly 37,000 patients, broken out by catchment, facility, and month. County-level coverage mapping shows where home-care appointments actually reach — and the long tail of counties with patients but almost no home-care contact.",
    insight:
      "Encounter volume and patient count answer different questions. A facility can serve comparatively few patients and still carry enormous encounter load, which is what separates a capacity problem from an access problem.",
    method:
      "Encounter and patient records aggregated by facility, catchment, and month, with seasonality visible in the monthly series. Coverage mapped at county level — the VA's de-identification threshold for patient location — as the share of patients per county with at least one home-care appointment.",
    image: "/images/work/scid-utilization.webp",
    images: [
      "/images/work/scid-utilization.webp",
      "/images/work/scid-utilization-2.webp",
    ],
    imageCrop: "center",
    source: "Client: VHA SCI/D · 142 facilities · 36,999 patients · 2,565,124 encounters",
    tags: ["Utilization", "Dashboards", "County-Level", "Home Care", "VHA"],
    hero: false,
  },
  {
    id: "mls-attendance",
    index: "41",
    title: "What a Visiting Club Is Worth",
    editorialTitle: ["Who fills", "the stadium."],
    subtitle: "Attendance Analytics · Road Draw vs Home Baseline · Avg 26,496",
    category: "Sports Analytics · Attendance",
    domain: "sports",
    tech: ["analytics", "dataviz", "statistics"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#00E5FF",
    accentLabel: "Attendance",
    description:
      "Two questions about the same turnstile count. One panel asks how each host city responds to a particular club visiting, measured against that city's own season average, so a positive bar means the visitor pulled a crowd the home side does not normally draw. The other reverses it, showing how one club's home attendance moves with each opponent it hosts.",
    insight:
      "Raw attendance mostly measures the size of the market. Measuring each gate against the home club's own season average separates the draw of the visiting team from the size of the building it walked into.",
    method:
      "Per-match attendance differenced against each club's own season mean, so every bar is a deviation rather than a level. Built as a view within the MLS analytics dashboard.",
    image: "/images/work/mls-attendance.webp",
    images: [
      "/images/work/mls-attendance.webp",
      "/images/work/mls-attendance-2.webp",
    ],
    imageCrop: "center",
    link: "https://mls-dashboard-one.vercel.app/",
    source: "Data: MLS 2025 match analytics · Per-match attendance",
    tags: ["Attendance", "Sports Analytics", "Soccer", "MLS", "Dashboards"],
    hero: false,
  },
  {
    id: "mls-budget",
    index: "42",
    title: "What a Roster Costs",
    editorialTitle: ["One salary cap,", "many ways around it."],
    subtitle: "Team Budget · Designated Players / TAM / Regular · MLSPA Disclosure",
    category: "Sports Analytics · Salary",
    domain: "sports",
    tech: ["analytics", "dataviz"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#5FD38D",
    accentLabel: "Salary Analytics",
    description:
      "Every club's wage bill, stacked by the mechanism that paid it — Designated Players, who sit outside the cap, Targeted Allocation Money, which buys above the cap but below DP level, and regular roster players signed within it. Selecting a club breaks its spend down by position and lists its highest earners against goals and minutes.",
    insight:
      "The interesting number is not what a club spends but which instrument it spends through. Two clubs with the same total can have completely different squads underneath, depending on how much of it is concentrated in three exempt contracts.",
    method:
      "Published salary disclosure joined to roster and performance data, aggregated by club, mechanism, and position. Cost-per-goal is derived rather than published.",
    image: "/images/work/mls-budget.webp",
    imageCrop: "center",
    link: "https://mls-dashboard-one.vercel.app/",
    source: "Data: MLSPA 2025 salary disclosure · Roster and performance joins",
    tags: ["Salary Cap", "Sports Analytics", "Soccer", "MLS", "Dashboards"],
    hero: true,
  },
  {
    id: "mls-player-stats",
    index: "43",
    title: "Volume Against Finishing",
    editorialTitle: ["Who shoots,", "and who scores."],
    subtitle: "Player Comparison · Configurable Axes · Season Leaders",
    category: "Sports Analytics · Player Metrics",
    domain: "sports",
    tech: ["analytics", "dataviz", "statistics"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#00E5FF",
    accentLabel: "Player Metrics",
    description:
      "A scatter of every player in the league with both axes under the reader's control — shots against goals by default, but any pair of season metrics can be swapped in. Alongside it, the season's scoring leaders ranked by total. Players who sit far off the diagonal are the ones worth naming.",
    insight:
      "A leaderboard answers who scored most. A scatter answers whether they scored most because they were accurate or because they shot more than anyone else, which is the difference between a finisher and a volume shooter.",
    method:
      "Player-season aggregates with selectable X and Y encodings, so the same view supports a range of comparisons instead of hard-coding one.",
    image: "/images/work/mls-player-stats.webp",
    imageCrop: "center",
    link: "https://mls-dashboard-one.vercel.app/",
    source: "Data: MLS player-season aggregates · Shots, goals, minutes",
    tags: ["Player Analytics", "Scatter", "Soccer", "MLS", "Dashboards"],
    hero: false,
  },
  {
    id: "mls-travel",
    index: "44",
    title: "The Cost of the Away Leg",
    editorialTitle: ["Miles travelled,", "points dropped."],
    subtitle: "Travel Burden × Away Performance · PPG Drop by Club",
    category: "Sports Analytics · Travel",
    domain: "sports",
    tech: ["analytics", "dataviz", "gis", "statistics"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#E8A030",
    accentLabel: "Travel Burden",
    description:
      "Total away miles travelled against the points-per-game a club loses on the road, one marker per team, sized by the size of that drop. A league spread across a continent asks some clubs to fly a great deal further than others, and this view tests whether that shows up in results.",
    insight:
      "This is a geography question wearing a sports jersey. The distance a club travels is fixed by the map before a season starts, which makes it one of the few genuinely exogenous variables in league performance.",
    method:
      "Season fixture lists converted to great-circle distances between home venues, summed per club, and paired with the difference between home and away points-per-game.",
    image: "/images/work/mls-travel.webp",
    imageCrop: "center",
    link: "https://mls-dashboard-one.vercel.app/",
    source: "Data: MLS fixture list · Venue coordinates · Home/away PPG",
    tags: ["Travel", "Sports Analytics", "Geography", "MLS", "Dashboards"],
    hero: false,
  },
  {
    id: "hawaii-topo",
    index: "45",
    title: "Sea Floor to Summit",
    editorialTitle: ["Fourteen thousand feet,", "and the water around it."],
    subtitle: "Hawai'i Island · Stacked Contours · 100–14,000 m · Blender",
    category: "Cartographic Rendering · Terrain",
    domain: "environmental",
    tech: ["gis", "webgl3d", "dataviz"],
    hasStatic: true,
    hasInteractive: false,
    accent: "#00C897",
    accentLabel: "Terrain Rendering",
    description:
      "Hawai'i Island built as physical contour terraces, each elevation band cut and stacked so the volcanoes read as what they are — the exposed top of a much larger structure. Mauna Kea and Mauna Loa carry the interval bunching that makes their slopes legible; bathymetry continues the surface out past the coastline instead of stopping at it.",
    insight:
      "Most terrain renders stop at the shoreline, which quietly implies the island ends there. Carrying the bathymetry outward puts the visible 14,000 feet in proportion to the seamount holding it up.",
    method:
      "Elevation and bathymetry rasters banded into discrete contour intervals, extruded as stacked layers and rendered in Blender. Full cartographic furniture — graticule with coordinates on the frame, north arrow, scale bar, and a hypsometric ramp spanning 100 to 14,000 m.",
    image: "/images/work/hawaii-topo-3.webp",
    images: [
      "/images/work/hawaii-topo-3.webp",
      "/images/work/hawaii-topo.webp",
      "/images/work/hawaii-topo-2.webp",
    ],
    imageCrop: "center",
    source: "Data: Elevation and bathymetry rasters · Rendered in Blender",
    tags: ["Terrain", "Cartography", "Bathymetry", "Blender", "3D"],
    hero: true,
  },
  {
    id: "earthquakes-global",
    index: "46",
    title: "A Century of Tremors",
    editorialTitle: ["Every quake,", "1900 to 2014."],
    subtitle: "Global Seismicity · Magnitude × Depth × Time · 1900–2014",
    category: "Seismicity · Data Visualization",
    domain: "environmental",
    tech: ["dataviz", "analytics", "gis"],
    hasStatic: true,
    hasInteractive: true,
    accent: "#E8A030",
    accentLabel: "Seismicity",
    description:
      "A hundred and fourteen years of recorded earthquakes, read three ways at once: where they happened, how magnitude relates to depth, and how the count changes over time. Plotted globally, the events draw the plate boundaries without anyone having to add them as a layer.",
    insight:
      "The rising count through the twentieth century is mostly a record of instrumentation, not of geology. Occurrence data measures how well we were listening as much as how often the ground moved.",
    method:
      "Global earthquake catalogue filtered by magnitude, mapped by epicentre with depth and magnitude encoded together, and aggregated into an annual frequency series.",
    image: "/images/work/earthquakes-global.webp",
    images: [
      "/images/work/earthquakes-global.webp",
      "/images/work/earthquakes-global-2.webp",
    ],
    imageCrop: "center",
    link: "https://public.tableau.com/app/profile/patrick.anderson8240/viz/Earthquakes_15628627194090/Dashboard1",
    source: "Data: Global earthquake catalogue, 1900–2014 · Magnitude and depth",
    tags: ["Seismicity", "Tableau", "Global", "Time Series", "Hazard"],
    hero: false,
  },
];
