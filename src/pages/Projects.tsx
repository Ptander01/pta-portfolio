/**
 * Projects.tsx — Work Showcase · Switchable Gallery Layouts
 * ─────────────────────────────────────────────────────────────
 * Four layout modes the visitor can cycle between:
 *
 *   A · Cinematic     — Full-bleed vertical scroll, images lead
 *   B · Editorial     — Alternating image + Cinzel text blocks
 *   C · Gallery       — Masonry grid, hero pieces full-width
 *   D · By Domain     — Organized by career chapter / domain
 *
 * The project data (PROJECTS array) never changes.
 * Only the presentation layer switches.
 *
 * IMAGE SETUP:
 *   Place images in: public/images/work/
 *   Update the `image` field in each PROJECTS entry below.
 *   Format: "/images/work/your-filename.png"
 *
 * DEPENDENCIES: framer-motion (already in package.json)
 *
 * Patrick Anderson — PTA Geospatial Intelligence
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/animations/PageTransition";
import { Link } from "wouter";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
type LayoutMode = "cinematic" | "editorial" | "gallery" | "domain";

interface Project {
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
  link?: string;
  source: string;
  tags: string[];
  hero?: boolean;             // gets full-width in Gallery layout
}

type DomainKey =
  | "environmental"
  | "healthcare"
  | "infrastructure"
  | "dataart"
  | "engineering"
  | "civic";

/* ─────────────────────────────────────────────────────────────
   DOMAIN DEFINITIONS
───────────────────────────────────────────────────────────── */
const DOMAINS: Record<
  DomainKey,
  { label: string; accent: string; org: string }
> = {
  environmental: {
    label: "Environmental Science",
    accent: "#00C897",
    org: "Clemson · NRCS",
  },
  healthcare: {
    label: "Healthcare · Public Data",
    accent: "#378ADD",
    org: "Booz Allen · VHA",
  },
  infrastructure: {
    label: "AI Infrastructure",
    accent: "#E8A030",
    org: "Meta",
  },
  dataart: {
    label: "Data Art · Sports",
    accent: "#00E5FF",
    org: "MLS · Personal",
  },
  engineering: {
    label: "Full-Stack Engineering",
    accent: "#7F77DD",
    org: "Independent",
  },
  civic: {
    label: "Civic · Public Data",
    accent: "#E05555",
    org: "Independent · Academic",
  },
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT MODE DEFINITIONS
───────────────────────────────────────────────────────────── */
const LAYOUTS: Record<
  LayoutMode,
  { label: string; description: string; icon: string }
> = {
  cinematic: {
    label: "Cinematic",
    description: "Full-bleed · images lead",
    icon: "◼",
  },
  editorial: {
    label: "Editorial",
    description: "Image + context · Lavergne style",
    icon: "◨",
  },
  gallery: {
    label: "Gallery",
    description: "Masonry · visual hierarchy",
    icon: "⊞",
  },
  domain: {
    label: "By Domain",
    description: "Organized by career chapter",
    icon: "≡",
  },
};

/* ─────────────────────────────────────────────────────────────
   PROJECT DATA
   Update `image` field once images are in public/images/work/
───────────────────────────────────────────────────────────── */
const PROJECTS: Project[] = [
  {
    id: "ocean-currents",
    index: "01",
    title: "Mapping Ocean Currents",
    editorialTitle: ["The Gulf Stream,", "made visible."],
    subtitle: "Physical Oceanography · Current Velocity · Atlantic Basin",
    category: "Physical Oceanography",
    domain: "environmental",
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
    accent: "#FF6B2B",
    accentLabel: "Agricultural GIS",
    description:
      "Solar resource mapped to parcel geometry at the Summer Solstice. Global irradiance rendered as false color thermal overlay — red at peak exposure, blue in shadow. Solar noon at 12:33, max altitude 78.8°, daylight duration 14:29 hours. Five years of farm energy audits distilled into a single image.",
    insight:
      "Small farms rarely have access to the kind of spatial solar analysis that determines whether a photovoltaic investment will pay off. This is what it looks like when they do.",
    method:
      "Global horizontal irradiance (kWh/m²/day) from NREL data. False color thermal mapping. Solar position calculated for Summer Solstice at site coordinates.",
    image: "/images/work/solar-agriculture.webp",
    images: [
      "/images/work/solar-agriculture.webp",
      "/images/work/solar-agriculture-2.webp",
      "/images/work/solar-agriculture-3.webp",
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
    accent: "#378ADD",
    accentLabel: "Public Health",
    description:
      "Composite societal health metrics rendered as layered wooden tile geography — county units extruded and colored by a composite index including healthcare access, educational attainment, economic mobility, and environmental quality. The coastal and urban core advantage becomes unmistakably physical.",
    insight:
      "A table of county health rankings communicates nothing. A 3D map where you can literally see the height of the gap between the Mississippi Delta and coastal Massachusetts changes what the data means.",
    method:
      "County Health Rankings composite index. 3D extrusion by health score. Teal to yellow color scale. Shallow DOF macro render on dark surface.",
    image: "/images/work/societal-health-metrics.webp",
    images: [
      "/images/work/societal-health-metrics.webp",
      "/images/work/societal-health-metrics-2.webp",
      "/images/work/societal-health-metrics-3.webp",
    ],
    imageCrop: "center",
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
    accent: "#4A90D9",
    accentLabel: "Humanitarian",
    description:
      "Forced migration flows rendered as directional particle streams across a near-black global basemap. Origin and destination encoded by flow intensity. The largest displacement crises — Syria, Ukraine, South Sudan, Afghanistan — emerge as the brightest corridors. Every particle is a person.",
    insight:
      "Migration data is usually presented as numbers. Rendering it as movement — as something that has direction, momentum, and weight — restores the human reality the statistics compress.",
    method:
      "UNHCR forced displacement dataset 2023. Origin-destination flow lines. Particle density encodes volume. Great circle routing on globe projection.",
    image: "/images/work/refugee-displacement.webp",
    images: [
      "/images/work/refugee-displacement.webp",
      "/images/work/refugee-displacement-2.webp",
      "/images/work/refugee-displacement-3.webp",
    ],
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
    accent: "#E8A030",
    accentLabel: "AI Infrastructure",
    description:
      "Parcel-level land acquisition analysis across the Northern Virginia AI infrastructure corridor. Site suitability scoring on transmission proximity, fiber availability, zoning class, and environmental constraints. The geography of where AI gets built — and why.",
    insight:
      "Data center siting is the most spatially constrained problem in AI infrastructure. Power, fiber, water, land cost, and regulatory environment converge at the parcel level. This is what that convergence looks like.",
    method:
      "Multi-criteria site suitability analysis. Parcel data from county assessors. Transmission lines from EIA. Fiber from FCC Form 477. Scoring: weighted overlay.",
    image: "/assets/projects/dc-parcel-dashboard/hero.webp",
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
    domain: "dataart",
    accent: "#00C897",
    accentLabel: "Census · Data Art",
    description:
      "Doctoral degree concentration rendered as self-illuminating crystal prisms over a CONUS hexbin surface. Teal aquamarine at baseline density, transitioning through pink and salmon to amber-gold at the highest concentrations. SF Bay Area, Boston, NYC Metro, DC/Beltway, and Research Triangle emerge as the dominant knowledge clusters.",
    insight:
      "The near-total absence of doctoral concentration across the interior of the country — visible as a flat teal plain between the coasts — is the story no bar chart tells as clearly as geography does.",
    method:
      "ACS 2024 educational attainment by county aggregated to H3 hexbin resolution 5. Sequential color scale. Physically-based crystal rendering with subsurface scattering.",
    image: "/images/work/hexbin_annotated_dark.webp",
    imageCrop: "center",
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
    domain: "dataart",
    accent: "#00E5FF",
    accentLabel: "Network Analysis",
    description:
      "Graph centrality rendered as physical material — glass nodes encode position by color and betweenness centrality by size, connected by neon plasma tube conduits whose luminance encodes pass frequency. Redondo sits at the topological center. Busquets dominates by degree. The network diagram as stadium-lit sculpture.",
    insight:
      "Centrality metrics reveal that Redondo — not Messi — is the structural spine of Inter Miami's attack. The eye follows the star. The algorithm follows the passes.",
    method:
      "Betweenness centrality (Freeman 1977, Brandes 2001). Node size = centrality score. Edge luminance = pass volume. Glass refraction + neon plasma tube rendering.",
    image: "/images/work/passing_network_3d_v6.png",
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
    domain: "dataart",
    accent: "#E8A030",
    accentLabel: "Temporal Analysis",
    description:
      "Season-long standing changes encoded as colored ribbon streams — each team a continuous thread moving through thirty-three matchweeks. The crossings are the story: momentum, collapse, late surges, early implosions. Rendered with shallow depth-of-field on paper texture, the ribbons read as physical objects.",
    insight:
      "The density of crossings in the first eight weeks reveals that MLS standings are essentially random early in the season — a detail invisible in any final table.",
    method:
      "Sankey-style rank flow across 33 matchweeks. Each ribbon = one club, colored by identity. Paper texture background. Shallow DOF with cast shadows.",
    image: "/images/work/hero_05_rankflow_closeup_cinematic.png",
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
    domain: "dataart",
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
    domain: "engineering",
    accent: "#7F77DD",
    accentLabel: "Full-Stack",
    description:
      "Production-grade interactive analytics platform for Major League Soccer. Five analytical views: player performance radar, team salary allocation, attendance gravity, 3D travel arc map, and narrative season timeline. Built in six weeks with React 19, TypeScript, Three.js, and a custom 3D chart design system.",
    insight:
      "Every chart has a name, a story, and a how-to-read explanation. Data without explanation is just decoration.",
    method:
      "React 19 + TypeScript + Vite. Custom 3D chart shapes with directional lighting. Three.js globe. All data client-side — no API calls, instant load.",
    image: "/assets/projects/mls-dashboard/cinematic-hero.webp",
    imageCrop: "top",
    link: "https://mls-dashboard-one.vercel.app/",
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
    accent: "#00C897",
    accentLabel: "Environmental",
    description:
      "Facility-level greenhouse gas and toxic release data from the EPA and EIA, mapped by industry group across the Midwest — chemicals, metals, natural gas, petroleum, and power generation. Point size encodes reported CO2e emissions; color encodes industry class.",
    insight:
      "Emissions data is public, but almost nobody looks at it spatially. Once you map it, the corridor of concentrated industrial output along the Ohio River becomes impossible to unsee.",
    method:
      "EPA Greenhouse Gas Reporting Program and EIA facility datasets. Proportional-symbol mapping by reported CO2e. Compiled with Jon Sherwood and Blake Lytle, Clemson Center for Geospatial Technologies.",
    image: "/images/work/facility-emissions.webp",
    images: [
      "/images/work/facility-emissions.webp",
      "/images/work/facility-emissions-2.webp",
      "/images/work/facility-emissions-3.webp",
    ],
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
    accent: "#4A90D9",
    accentLabel: "Climate",
    description:
      "Monthly global surface temperature, expressed as departure from the historical median, from 1850 to today. A heatmap by month sits above a scatter of every monthly anomaly — blue giving way to pink as the twentieth century closes.",
    insight:
      "The chart doesn't need commentary. The color shift from blue to pink makes the trend load-bearing before you've read a single number.",
    method:
      "Monthly surface temperature anomaly relative to the 1961–1990 average. Source: Met Office Hadley Centre. Built in Tableau.",
    image: "/images/work/temperature-analysis.webp",
    images: [
      "/images/work/temperature-analysis.webp",
      "/images/work/temperature-analysis-2.webp",
      "/images/work/temperature-analysis-3.webp",
    ],
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
    accent: "#E05555",
    accentLabel: "Public Safety",
    description:
      "Hotspot analysis of reported crime across San Francisco, built entirely in R and GIS. Hexbin aggregation with Getis-Ord Gi* statistical confidence extruded into 3D — the Tenderloin and SOMA corridor rise as the city's clearest concentration of statistically significant hotspots.",
    insight:
      "A dot map of crime just shows where people are. A Gi* hotspot map shows where crime clusters beyond what population density alone would predict — a very different, much more useful, question.",
    method:
      "Hexbin spatial aggregation. Getis-Ord Gi* hotspot statistic. Built with R (sf, spdep) and GIS.",
    image: "/images/work/fighting-crime-sf.webp",
    images: [
      "/images/work/fighting-crime-sf.webp",
      "/images/work/fighting-crime-sf-2.webp",
      "/images/work/fighting-crime-sf-3.webp",
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
    accent: "#FF6B2B",
    accentLabel: "Hazards",
    description:
      "Historical storm tracks across the Atlantic basin and Gulf of Mexico, each system rendered as a distinct colored thread against a dark basemap — the paths cross, tangle, and fan out from the Caribbean toward the U.S. coastline.",
    insight:
      "Individually, a storm track is a line on a map. Layered together across seasons, the tracks reveal the geography of risk — which coastlines get hit again and again.",
    method:
      "Historical Atlantic and Gulf storm track data. Multi-track path rendering by system, color-coded for legibility.",
    image: "/images/work/storm-tracking.webp",
    images: [
      "/images/work/storm-tracking.webp",
      "/images/work/storm-tracking-2.webp",
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
    accent: "#8B4040",
    accentLabel: "Seismic",
    description:
      "At 4:30 a.m. on January 17, 1994, a magnitude 6.7 earthquake struck the San Fernando Valley, causing an estimated $20 billion in damage in roughly 10 to 20 seconds of shaking. This project reconstructs the event spatially: how fault lines shaped the valley's topography, the density and depth of 188 recorded aftershocks, and how far seismic waves traveled from the epicenter in the first seconds of the quake.",
    insight:
      "The damage from an earthquake doesn't come from how far the ground actually moves — it comes from how fast it accelerates. Mapping P-wave and S-wave travel distance in one-second intervals makes that distinction physical instead of abstract.",
    method:
      "Fault line overlay on high-resolution elevation data. 188 seismograph stations recording magnitude, depth, and timestamp. 3D aftershock spheres sized and colored by magnitude. Seismic wave travel-distance buffer rings.",
    image: "/images/work/tremors-in-north-ridge.webp",
    images: [
      "/images/work/tremors-in-north-ridge.webp",
      "/images/work/tremors-in-north-ridge-2.webp",
      "/images/work/tremors-in-north-ridge-3.webp",
    ],
    imageCrop: "center",
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
    accent: "#00C897",
    accentLabel: "Mobility",
    description:
      "2023 US Census Bureau state-to-state migration totals, rendered as bidirectional flow lines — over 2,500 state-to-state relationships, each flow and node color-coded and sized proportional to migrant count. Filtered down to a single state, the pattern becomes legible.",
    insight:
      "The full national dataset is honest but unreadable — 2,500 overlapping relationships. Filtering to one state's flows is what turns the data into a story anyone can follow.",
    method:
      "US Census Bureau 2023 state-to-state migration data. Bidirectional flow mapping via Flow Map City, an open-source in-browser mobility analytics tool.",
    image: "/images/work/us-state-migration-flows.webp",
    images: [
      "/images/work/us-state-migration-flows.webp",
      "/images/work/us-state-migration-flows-2.webp",
      "/images/work/us-state-migration-flows-3.webp",
    ],
    imageCrop: "center",
    link: "https://www.flowmap.city/",
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
    accent: "#4A90D9",
    accentLabel: "Data Viz",
    description:
      "An interactive dashboard summarizing vehicle fuel efficiency by automotive make, model, vehicle class, fuel type, and engine cylinder count — built to make a dense dataset navigable by the comparisons people actually care about.",
    insight:
      "Fuel efficiency data is usually presented as a flat table. Breaking it out by class and cylinder count surfaces the comparisons that actually inform a purchase decision.",
    method:
      "Interactive dashboard summarizing vehicle fuel efficiency data by make, model, class, fuel type, and cylinder count.",
    image: "/images/work/vehicle-fuel-efficiency.webp",
    images: [
      "/images/work/vehicle-fuel-efficiency.webp",
      "/images/work/vehicle-fuel-efficiency-2.webp",
      "/images/work/vehicle-fuel-efficiency-3.webp",
    ],
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
    domain: "environmental",
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
    imageCrop: "center",
    link: "https://aidatacentertracker.vercel.app/",
    source: "Stack: MapLibre GL · Apache ECharts · TanStack Table · TypeScript",
    tags: ["MapLibre GL", "AI Infrastructure", "Data Reconciliation", "TypeScript"],
    hero: true,
  },
];

/* ─────────────────────────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────────────────────────── */

/** Accent rule — small colored line matching chapter accent */
function AccentRule({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 24,
        height: 1,
        background: color,
        opacity: 0.7,
        verticalAlign: "middle",
        marginRight: 10,
      }}
    />
  );
}

/** Image frame with accent bar and fallback placeholder.
 *  `priority` marks the first card in a layout — that one loads eagerly so
 *  the above-the-fold image isn't deferred; every other card lazy-loads. */
function ProjectImage({
  project,
  height = 360,
  priority = false,
}: {
  project: Project;
  height?: number;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasHovered, setHasHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const gallery =
    project.images && project.images.length > 1
      ? project.images
      : [project.image];
  const hasMultiple = gallery.length > 1;

  const handleMouseEnter = () => {
    if (!hasMultiple) return;
    setHasHovered(true);
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % gallery.length);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        border: "0.5px solid rgba(100,160,220,0.1)",
        borderTopColor: "rgba(100,160,220,0.18)",
        overflow: "hidden",
        background: "#0A0E14",
      }}
    >
      {/* Accent bar — carries the domain color the corner brackets used to.
          One mark instead of two, anchored to the bottom edge. */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "34%",
          height: 2,
          background: project.accent,
          zIndex: 3,
        }}
      />

      {!error ? (
        <div style={{ position: "relative", width: "100%", height }}>
          {gallery.map((src, i) => {
            if (i > 0 && !hasHovered) return null; // lazy: only fetch extras after first hover
            return (
              <img
                key={src}
                src={src}
                alt={project.title}
                /* Extras (i > 0) are only mounted after first hover, so they
                   are already deferred — load them immediately once mounted
                   or the crossfade stalls on the first cycle. */
                loading={i > 0 || priority ? "eager" : "lazy"}
                fetchPriority={priority && i === 0 ? "high" : undefined}
                decoding="async"
                onLoad={() => i === 0 && setLoaded(true)}
                onError={() => i === 0 && setError(true)}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: project.imageCrop,
                  opacity: (i === 0 ? loaded : true) && i === activeIndex ? 1 : 0,
                  transition: "opacity 0.9s ease",
                }}
              />
            );
          })}
        </div>
      ) : (
        /* Placeholder while images are being deployed */
        <div
          style={{
            width: "100%",
            height,
            background: `linear-gradient(135deg, #0A0E14, ${project.accent}12)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: project.accent,
              opacity: 0.5,
            }}
          >
            {project.index} · {project.title}
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8,
              color: "rgba(232,240,254,0.15)",
              letterSpacing: "0.15em",
            }}
          >
            public/images/work/ · pending
          </span>
        </div>
      )}

      {/* Bottom fade overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
          background:
            "linear-gradient(to top, rgba(7,10,14,0.65) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/** Source citation line */
function SourceLine({
  text,
  accent,
}: {
  text: string;
  accent: string;
}) {
  return (
    <div
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.5rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(232,240,254,0.18)",
        paddingTop: "0.625rem",
        marginTop: "0.75rem",
        borderTop: `0.5px solid rgba(100,160,220,0.07)`,
      }}
    >
      {text}
    </div>
  );
}

/** Tag pill */
function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.5rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "2px 8px",
        border: "0.5px solid rgba(100,160,220,0.12)",
        color: "rgba(232,240,254,0.3)",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT A — CINEMATIC (Full-bleed vertical)
───────────────────────────────────────────────────────────── */
function LayoutCinematic({ projects }: { projects: Project[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      {projects.map((p, i) => (
        <article key={p.id}>
          <ProjectImage project={p} height={420} priority={i === 0} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "0.75rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: p.accent,
                  opacity: 0.8,
                  marginBottom: "0.25rem",
                }}
              >
                <AccentRule color={p.accent} />
                {p.accentLabel}
              </div>
              <h2
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  fontWeight: 700,
                  color: "#E8F0FE",
                  lineHeight: 1.1,
                }}
              >
                {p.title}
              </h2>
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.5rem",
                color: "rgba(232,240,254,0.2)",
                letterSpacing: "0.15em",
                textAlign: "right",
              }}
            >
              PTA · {p.index}
              {p.link && (
                <div style={{ marginTop: 4 }}>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: p.accent,
                      textDecoration: "none",
                      opacity: 0.8,
                    }}
                  >
                    View live ↗
                  </a>
                </div>
              )}
            </div>
          </div>
          <SourceLine text={p.source} accent={p.accent} />
        </article>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT B — EDITORIAL (Alternating image + text)
───────────────────────────────────────────────────────────── */
function LayoutEditorial({ projects }: { projects: Project[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
      {projects.map((p, i) => {
        const imgLeft = i % 2 === 0;
        return (
          <article
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3.5rem",
              alignItems: "center",
            }}
          >
            {/* Image */}
            <div style={{ order: imgLeft ? 0 : 1 }}>
              <ProjectImage project={p} height={340} priority={i === 0} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(232,240,254,0.18)",
                  }}
                >
                  {p.category}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.5rem",
                    color: "rgba(232,240,254,0.15)",
                  }}
                >
                  PTA · {p.index}
                </span>
              </div>
            </div>

            {/* Text */}
            <div style={{ order: imgLeft ? 1 : 0 }}>
              {/* Category tag */}
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: p.accent,
                  opacity: 0.8,
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AccentRule color={p.accent} />
                {p.accentLabel}
              </div>

              {/* Editorial headline */}
              <h2
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  color: "#E8F0FE",
                  marginBottom: "1.25rem",
                }}
              >
                {p.editorialTitle[0]}
                <em
                  style={{
                    display: "block",
                    fontStyle: "italic",
                    color: p.accent,
                  }}
                >
                  {p.editorialTitle[1]}
                </em>
              </h2>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9375rem",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: "rgba(232,240,254,0.55)",
                  marginBottom: "1.25rem",
                }}
              >
                {p.description}
              </p>

              {/* Insight pullquote */}
              <blockquote
                className="pull-quote"
                style={{
                  borderLeftColor: p.accent,
                  background: `${p.accent}0F`,
                  marginBottom: "1.25rem",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "rgba(232,240,254,0.4)",
                }}
              >
                {p.insight}
              </blockquote>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "0.75rem" }}>
                {p.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>

              {/* Live link */}
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: p.accent,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: "0.75rem",
                  }}
                >
                  View live dashboard ↗
                </a>
              )}

              <SourceLine text={p.source} accent={p.accent} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT C — GALLERY (Masonry with hero pieces)
───────────────────────────────────────────────────────────── */
function LayoutGallery({ projects }: { projects: Project[] }) {
  const heroes = projects.filter((p) => p.hero);
  const supporting = projects.filter((p) => !p.hero);

  // Interleave: hero, 2 supporting, hero, 2 supporting...
  const sections: Array<{ hero: Project; pair: Project[] }> = [];
  let si = 0;
  heroes.forEach((h) => {
    sections.push({ hero: h, pair: supporting.slice(si, si + 2) });
    si += 2;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {sections.map((section, si) => (
        <div key={section.hero.id}>
          {/* Hero — full width */}
          <article style={{ marginBottom: "0.75rem" }}>
            <ProjectImage project={section.hero} height={480} priority={si === 0} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: section.hero.accent,
                    opacity: 0.75,
                    marginRight: 8,
                  }}
                >
                  <AccentRule color={section.hero.accent} />
                  {section.hero.accentLabel}
                </span>
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "#E8F0FE",
                  }}
                >
                  {section.hero.title}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5rem",
                  color: "rgba(232,240,254,0.2)",
                }}
              >
                PTA · {section.hero.index}
              </span>
            </div>
            <div
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "0.875rem",
                fontWeight: 300,
                color: "rgba(232,240,254,0.4)",
                lineHeight: 1.7,
                marginTop: 6,
                maxWidth: 640,
              }}
            >
              {section.hero.insight}
            </div>
            <SourceLine text={section.hero.source} accent={section.hero.accent} />
          </article>

          {/* Supporting pair — 2 column */}
          {section.pair.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${section.pair.length}, 1fr)`,
                gap: "0.75rem",
                marginBottom: "3rem",
              }}
            >
              {section.pair.map((p) => (
                <article key={p.id}>
                  <ProjectImage project={p} height={260} />
                  <div style={{ marginTop: 6 }}>
                    <div
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.5rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: p.accent,
                        opacity: 0.7,
                        marginBottom: 3,
                      }}
                    >
                      <AccentRule color={p.accent} />
                      {p.accentLabel}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: "#E8F0FE",
                      }}
                    >
                      {p.title}
                    </div>
                    <SourceLine text={p.source} accent={p.accent} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT D — BY DOMAIN
───────────────────────────────────────────────────────────── */
function LayoutDomain({ projects }: { projects: Project[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      {(Object.entries(DOMAINS) as [DomainKey, typeof DOMAINS[DomainKey]][]).map(
        ([key, domain]) => {
          const domainProjects = projects.filter((p) => p.domain === key);
          if (domainProjects.length === 0) return null;
          return (
            <section key={key}>
              {/* Domain header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingBottom: "1rem",
                  marginBottom: "1.5rem",
                  borderBottom: `0.5px solid ${domain.accent}28`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: domain.accent,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${domain.accent}60`,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "#E8F0FE",
                    }}
                  >
                    {domain.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.5rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: domain.accent,
                      opacity: 0.6,
                      marginTop: 2,
                    }}
                  >
                    {domain.org} · {domainProjects.length}{" "}
                    {domainProjects.length === 1 ? "piece" : "pieces"}
                  </div>
                </div>
              </div>

              {/* 3-column grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "1rem",
                }}
              >
                {domainProjects.map((p) => (
                  <article key={p.id}>
                    <ProjectImage project={p} height={200} />
                    <div style={{ marginTop: 8 }}>
                      <div
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.9375rem",
                          fontWeight: 700,
                          color: "#E8F0FE",
                          marginBottom: 4,
                          lineHeight: 1.2,
                        }}
                      >
                        {p.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.5rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: p.accent,
                          opacity: 0.6,
                          marginBottom: 6,
                        }}
                      >
                        {p.accentLabel}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Lora', serif",
                          fontSize: "0.8125rem",
                          fontWeight: 300,
                          lineHeight: 1.65,
                          color: "rgba(232,240,254,0.4)",
                          marginBottom: 8,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.insight}
                      </div>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.5rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: p.accent,
                            textDecoration: "none",
                            opacity: 0.8,
                          }}
                        >
                          View live ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        }
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT SWITCHER BUTTON
───────────────────────────────────────────────────────────── */
function LayoutButton({
  mode,
  active,
  onClick,
}: {
  mode: LayoutMode;
  active: boolean;
  onClick: () => void;
}) {
  const { label, description, icon } = LAYOUTS[mode];
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 3,
        padding: "10px 16px",
        border: active
          ? "0.5px solid rgba(0,229,255,0.45)"
          : "0.5px solid rgba(100,160,220,0.12)",
        background: active ? "rgba(0,229,255,0.06)" : "transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        minWidth: 120,
      }}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(100,160,220,0.25)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(100,160,220,0.12)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: active ? "#00E5FF" : "rgba(232,240,254,0.5)",
            transition: "color 0.2s ease",
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.625rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: active ? "#00E5FF" : "rgba(232,240,254,0.45)",
            fontWeight: active ? 700 : 400,
            transition: "color 0.2s ease",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'Lora', serif",
          fontSize: "0.625rem",
          fontWeight: 300,
          color: active
            ? "rgba(0,229,255,0.6)"
            : "rgba(232,240,254,0.25)",
          letterSpacing: "0.01em",
          transition: "color 0.2s ease",
        }}
      >
        {description}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROJECTS PAGE — ROOT COMPONENT
───────────────────────────────────────────────────────────── */
export default function Projects() {
  const [layout, setLayout] = useState<LayoutMode>("gallery");

  const handleLayout = useCallback((mode: LayoutMode) => {
    setLayout(mode);
  }, []);

  return (
    <PageTransition>
      <div
        style={{
          background: "#070A0E",
          minHeight: "100vh",
          paddingTop: "6rem",
        }}
      >
        {/* ── Page header ── */}
        <header
          style={{
            padding: "0 6vw 3rem",
            marginBottom: "3rem",
            borderBottom: "0.5px solid rgba(100,160,220,0.07)",
          }}
        >
          {/* Back */}
          <Link href="/">
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.5625rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(232,240,254,0.25)",
                cursor: "pointer",
                display: "inline-block",
                marginBottom: "2rem",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(232,240,254,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(232,240,254,0.25)";
              }}
            >
              ← Patrick Anderson
            </span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            {/* Title */}
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(0,229,255,0.65)",
                  marginBottom: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 1,
                    background: "currentColor",
                    display: "inline-block",
                  }}
                />
                Selected work · {PROJECTS.length} pieces
              </div>
              <h1
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#E8F0FE",
                }}
              >
                Work that turns
                <em
                  style={{
                    fontStyle: "italic",
                    display: "block",
                    color: "#00E5FF",
                  }}
                >
                  data into sight.
                </em>
              </h1>
            </div>

            {/* Layout switcher */}
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(232,240,254,0.2)",
                  marginBottom: "0.5rem",
                }}
              >
                View as
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {(Object.keys(LAYOUTS) as LayoutMode[]).map((mode) => (
                  <LayoutButton
                    key={mode}
                    mode={mode}
                    active={layout === mode}
                    onClick={() => handleLayout(mode)}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── Gallery ── */}
        <main style={{ padding: "0 6vw 6rem" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={layout}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {layout === "cinematic" && (
                <LayoutCinematic projects={PROJECTS} />
              )}
              {layout === "editorial" && (
                <LayoutEditorial projects={PROJECTS} />
              )}
              {layout === "gallery" && (
                <LayoutGallery projects={PROJECTS} />
              )}
              {layout === "domain" && (
                <LayoutDomain projects={PROJECTS} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── Footer ── */}
        <footer
          style={{
            padding: "2.5rem 6vw",
            borderTop: "0.5px solid rgba(100,160,220,0.07)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(232,240,254,0.15)",
            }}
          >
            Patrick Anderson · PTA Geospatial Intelligence ·{" "}
            {new Date().getFullYear()}
          </span>
          <Link href="/">
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(232,240,254,0.2)",
                cursor: "pointer",
              }}
            >
              ← Back to home
            </span>
          </Link>
        </footer>
      </div>
    </PageTransition>
  );
}
