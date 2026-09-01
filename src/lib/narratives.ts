/**
 * Long-form project narratives, keyed by the `id` in Projects.tsx PROJECTS.
 * ─────────────────────────────────────────────────────────────
 * Patrick's own writing. Two registers, deliberately preserved rather than
 * normalized — some pieces are formal dataset documentation, others are
 * field notes written the day the work happened, and the mix is more
 * interesting than a single house voice.
 *
 * Editorial rule applied: the substance and the voice are his; the
 * platform scaffolding of the originals (hashtag artifacts, "let me know
 * in the comments", day-of-week sign-offs) is dropped, since a portfolio
 * page has no comments section. Nothing was added that he didn't say.
 *
 * A piece without an entry here simply has no detail page — the gallery
 * card stays the whole presentation.
 */

export type Narrative = {
  /** "field-notes" renders with the italic serif lede treatment. */
  tone: "formal" | "field-notes";
  /** Optional short standfirst above the body. */
  standfirst?: string;
  paragraphs: string[];
  /** Rendered as a labelled block after the prose. */
  credits?: { label: string; lines: string[] }[];
};

export const narratives: Record<string, Narrative> = {
  /* Built from Patrick's own executive summary for the VHA SCI/D National
     Program Office — the same document published at
     /writing/Anderson-VHA-SCID-Catchment-Area-Executive-Summary.pdf. Sentences
     are his, compressed; the report's register is formal, so the tone is too.
     Everything here is facility- or territory-level, which clears the
     county-level de-identification standard by a wide margin. */
  "scid-access": {
    tone: "formal",
    standfirst:
      "On 23 April 2024 the SCI/D program office asked, for each of 25 catchment areas: who can actually reach care, and is that changing?",
    paragraphs: [
      "The system runs as 25 hub centers with 122 spokes feeding them. To ask who can reach it, each facility first needed a territory — and a territory drawn by straight-line distance would have been wrong from the outset, because Veterans do not drive in straight lines. Thiessen polygons were generated for all 147 facilities and weighted by road network rather than Euclidean distance, over a study area of 3,655,250 square miles. The average hub territory came to 146,210 square miles; the average spoke, 24,775.",
      "Veteran addresses were geocoded and assigned with the Closest Facility tool from the Network Analyst toolset, run twice — once against the closest hub, once against the closest hub-or-spoke, because those answer different questions for a program deciding where to put capacity. Commute was then summarized per territory for each of five fiscal years.",
      "The spread between territories is large and it is structural. Average Veteran commute by hub territory ranged from 37 miles in San Juan to 266 in Seattle, which also covers Alaska. Spoke territories averaged 46 miles, from 10 at the closest to 182 at the furthest.",
      "The change over those five years was almost nothing. The average commute across the hub system moved from 143.6 miles to 144.4 — a net of one mile nationally — and every hub's percentage change fell between -9 and +4 percent. A system that looks volatile territory by territory turned out to be remarkably stable in aggregate.",
      "The intuition worth testing was that territories gaining Veterans should be the ones drawing them closer. A simple linear regression between five-year net change in population and five-year net change in average commute returned no relationship at all, for hubs and spokes alike (R² = 0). A pairwise comparison of facilities that cleared ±2 standard deviations on both measures isolated a handful of hubs — Memphis, Aurora, Long Beach, Syracuse — and no spokes at all.",
      "One note on reading the maps. Percentage change in average commute by hub was all between -9 and 4 percent. So while the color symbology covers an extreme range of dark and light diverging hues that seems to suggest significant relative change, the data itself tempers that message. If we were to stretch the color ramp from -100 to +100 percent change, all 25 values would be in the pale purple and orange classes.",
    ],
    credits: [
      {
        label: "Delivered",
        lines: [
          "Two presentations (all diagnoses; SCI diagnosis only)",
          "Executive summary · population tables · mapping products",
          "ESRI ArcGIS Pro 3.3 — Network Analyst, Closest Facility",
        ],
      },
    ],
  },

  "scid-population": {
    tone: "formal",
    standfirst:
      "The same 147 territories, asked a different question: not how many Veterans, but which territories are quietly changing shape.",
    paragraphs: [
      "Annual population for 25,157 Veterans was summarized to every hub and spoke territory across FY2019–FY2023. Hub territories averaged 991 Veterans, ranging from 253 in Hampton to 2,257 in Augusta. Spokes averaged 170, from 25 in Hawai\u2019i to 824 in Dallas.",
      "The analysis was run four times rather than once. The study population was split by diagnosis category — all diagnoses, and spinal cord injury only — and then by facility status, hub and spoke. Four parallel sub-analyses, delivered as two separate documents, because a program office planning hub capacity and one planning spoke coverage are not reading the same report.",
      "Net growth across the whole system was 240 Veterans over five years, an average of 60 a year. Reported alone, that describes a system barely moving. The annual series says something else: a drop of 784 Veterans in FY22 followed by a rebound of 836 in FY23. The net is real, and so is the shock underneath it — which is the argument for publishing both.",
      "Change was expressed five ways — annual, five-year net, five-year average, annual percentage and five-year percentage — and then converted to standard deviations. That last step is what makes the ranking honest: it measures each facility against the distribution rather than against its neighbours, so a large absolute change in a large territory is not mistaken for an unusual one. Only Aurora, at +237, cleared two standard deviations among the hubs. Richmond, Memphis, Long Beach, Cleveland, Boston and Syracuse cleared one.",
      "Measured as a percentage instead, a different set of facilities surfaces — Grand Junction at +59 percent, Beckley and Martinsburg at 36. Small territories move a long way in percentage terms on modest absolute numbers, which is exactly why both framings were reported rather than whichever one told a cleaner story.",
    ],
    credits: [
      {
        label: "Scope",
        lines: [
          "25,157 Veterans · 25 hubs · 122 spokes · FY2019–FY2023",
          "Two cohorts × two facility tiers = four parallel analyses",
        ],
      },
    ],
  },

  /* From Patrick's two-part write-up on the tool. His words, compressed; the
     platform scaffolding is dropped per the rule at the top of this file.

     Figures are the ones the DEPLOYED app reports (96 tasks, 546,322 credits,
     6 projects, 25 days). His posts cite a later snapshot — 101 chats,
     617,226 credits, 8 projects, 26 days — which the hosted build does not
     yet show. A card must not promise more than the thing it links to, so the
     live numbers win until the app is redeployed. */
  "agent-flow-visualizer-gallery": {
    tone: "field-notes",
    standfirst:
      "I wanted to see how far multi-agent AI could be pushed as a force-multiplier without trading quality for scale. So I ran eight workstreams at once — and then built something to watch it happen.",
    paragraphs: [
      "Over 25 days I used Manus AI's Max Agent model to build a large amount of work in parallel: 96 tasks across six projects, 3,559 messages exchanged, 1,717 files created or modified, 546,322 credits consumed, and roughly 1,270 hours of compute. Those numbers are not estimates — they are pulled directly from the Manus API and structured into a local JSON schema that powers the entire visualization.",
      "As an organized and highly visual person, I wanted to keep track of my progress and the agent's. So I built the Agent Flow Visualizer. React 19, React Flow, Tailwind, Vite, Vercel. The data path is Manus API to structured JSON to client-side rendering, with no backend at all.",
      "The overview is a node graph: conversations organized into project clusters, a Gantt timeline of the whole build, and a summary pane. That answers what was built. The more interesting half answers how.",
      "Double-click any task node and three things animate at once. A hexagonal tool-call graph, where every agent action becomes a glowing node — deploying, thinking, installing, git, searching, analyzing, waiting, user input, running — activating and connecting through colour-coded dashed edges into a shifting orbital web. A live event timeline, where individual actions fire as coloured marks along a scrubber, building a rhythm that shows where a session was active and where it stalled. And a session header holding your exact position in the event log, with totals visible throughout.",
      "The density of that web turned out to be the visual fingerprint of how the agent approached a problem: chaotic and branching when it was debugging, sparse and linear when it was executing cleanly. One portfolio sprint alone produced 266 discrete events over 312 hours of compute, 2,115 credits, and 3,230 lines of code.",
      "Watching the replay was genuinely useful rather than just interesting. It showed me the flow of a conversation — where I prompted well and where I prompted poorly, and where agent context and output quality began to lag. It is also simply good to watch: the agent pauses to think, fires a cluster of parallel tool calls, hits a deployment failure, retries, searches for context, and stabilises. All of that is legible as pattern before you read a single line of log text.",
    ],
    credits: [
      {
        label: "Stack",
        lines: [
          "React 19 · React Flow · Tailwind CSS · Vite · Vercel",
          "Manus API → structured JSON → client-side, no backend",
        ],
      },
    ],
  },

  "solar-agriculture": {
    tone: "field-notes",
    standfirst:
      "Field notes from the day I ran the solar model on my neighbour's farm.",
    paragraphs: [
      "Today I took the next step in exploring solar energy applications on my neighbour's farm. I opened ESRI's Spatial Analyst Toolbox in ArcGIS Pro and fired up the Raster Solar Radiation geoprocessing tool on my custom DSM.",
      "I ran the tool four times, on the four corners of the calendar that represent the greatest variations in solar path geometry and solar irradiance availability: the spring equinox, summer solstice, autumn equinox, and winter solstice.",
      "Parameters of note — I told the tool to sum all radiance values (global, meaning direct, diffuse, and indirect). I set the time interval for the entire day, as opposed to hourly or spanning multiple days. I left all of the topographic and radiation parameters at default.",
      "I noticed that the solar irradiance values are exceptionally conservative, possibly by as much as 40%. Many credible sources, including NOAA and National Renewable Energy Laboratory models, suggest greater resource availability up to 1.5 kWh/m²/day. However, I like the ESRI numbers for two reasons. First, since our specific area of interest gets twice the annual precipitation as the national average, I believe the lower value better reflects atmospheric transitivity — see what I did there. Second, it's easy to want the values to be higher, since renewable energy is cool and exciting. I have found in my 33 years of grand life-wisdom that it's usually wise to temper my enthusiasm and prevent an optimistic bias that over-represents the potential success of a burgeoning technology.",
      "On symbology: for continuity in comparing the results, I changed the stretch symbology of each day from the max and min of its own values to the max and min of the entire annual range. This allows greater variation in the symbology throughout the year, while keeping the actual quantification of the color scheme consistent across the whole graphic.",
      "A fun fact for our lat/long/altitude: daylight duration ranges from a minimum of 9.5 hours in the winter to 14.3 hours in the summer. Meanwhile the maximum altitude of the solar path ranges from 31.9° above the horizon in winter to 78.8° in summer.",
    ],
  },

  /* The seasonal figure list and the atmospheric parameters moved here from
     solar-agriculture on 2026-07-30, when Town Creek Farms' seasonal solar
     work became its own piece. They describe this study specifically — the
     wedge of farmland, the four calendar corners — rather than solar in
     agriculture generally, which is what piece 03 is about. */
  "tcf-solar": {
    tone: "formal",
    standfirst:
      "An illumination study, done to quantify the solar resource available to the area of interest.",
    paragraphs: [
      "The process involved UAV remote sensing techniques and photogrammetry, in order to construct digital models of both the elevation and the built environment.",
      "The solar path for our region was mapped as hourly azimuth and altitude coordinates for each of the four seasons, and the radiation model run against the terrain so that the ground casts its own shadows.",
    ],
    credits: [
      {
        label: "What the images show",
        lines: [
          "1 · High-resolution orthomosaic imagery of an example study area, from drone aerial images",
          "2 · The Digital Surface Model constructed via photogrammetry",
          "3 · Shaded relief on the modelled elevation surface, considering illumination source angle and shadows at hourly intervals within a day",
          "4–7 · Modelled daily solar illumination on the spring equinox (3/21), summer solstice (6/21), autumn equinox (9/21) and winter solstice (12/21)",
          "8 · Modelled average annual illumination",
          "9 · Modelled solar energy resource availability for the study area (kW/m²/hr)",
        ],
      },
      {
        label: "Atmospheric parameters",
        lines: [
          "Solar radiation calculations are extremely sensitive to atmospheric model assumptions — the radiation reaching the surface is only a portion of what arrives at the top of the atmosphere. Two inversely related parameters drive the model: diffuse proportion, the fraction of global normal radiation flux that is diffused, and transmittivity, the ratio of energy reaching the surface to that received at the upper limit of the atmosphere.",
          "Diffuse proportion was set to 0.3, modelling a generally clear sky where incoming diffuse flux varies with zenith angle. Transmittivity was set to 0.5, modelling relatively clear conditions.",
          "These conditions were determined from two datasets. MODIS satellite imagery at 1 km resolution measured average cloud observations at the sample coordinates twice per day over the most recent 15-year period, totalling in excess of 10,950 observations: mean climatological cloud frequency was 51%, with interannual variability expressed as a standard deviation of 5% (Wilson & Jetz, 2016). This was cross-validated against average monthly rainfall by zip code between 1952 and 1990, provided by the South Carolina Department of Natural Resources.",
        ],
      },
    ],
  },

  "tcf-illumination": {
    tone: "field-notes",
    standfirst:
      "How do you make a 3D hillshade out of 2D images that symbolize a hillshade analysis, which was done on 3D point cloud data?",
    paragraphs: [
      "I've been exploring solar energy concepts for a friend's farm recently, and revisited the hillshade analysis in ArcGIS Pro.",
      "First I downloaded a LiDAR dataset from USGS 3DEP covering my local area, then converted it into both a 1 m × 1 m DEM and DSM. Then I looked up the solar path on the summer solstice for this area of interest and recorded the hourly altitude and azimuth values from NOAA.",
      "I ran the hillshade analysis on my custom DSM for every hour the sun was above the horizon — 6am to 7pm — using those hourly solar path coordinates. Then I exported the layout for each raster dataset and converted the images into an animated GIF.",
      "I am continuing my exploration with 3D lighting and shading. Today I took the 14 map exports from ArcGIS Pro that visualized the hourly hillshade illumination results of my neighbour's farm, and arranged them side by side in ascending order. Then I made those images 3D, and played around with tilt, materials, lighting, reflectance, and shadows.",
      "I suppose this falls into that final stage of an analysis — presenting your data. I find it's usually a combination of graphic design, aesthetic, and subjectivity, but I always find myself enjoying taking the time to polish my work. The results tend to be more compelling to the audience, and therefore more influential. I remember learning this from ESRI's Cartography MOOC back when I was in grad school — tip of the hat to John Nelson and Kenneth Field.",
      "Admittedly, I'm never exactly sure what the tension is between a boringly clear presentation and artistically presenting your results in a more creative, less objective way.",
    ],
    credits: [
      {
        label: "With thanks",
        lines: [
          "John Nelson, for both the north arrow and the graphics-layer tip for my property boundary layer.",
        ],
      },
    ],
  },

  "societal-health": {
    tone: "formal",
    paragraphs: [
      "An analysis of physical health metrics for individuals in the United States, summarized by county.",
      "The data summarizes an individual's consumption of fruits and vegetables, physical activity, use of tobacco products, food security, and obesity classification.",
      "The gallery shows static images of the dashboard summarizing key regions of the United States; an interactive version of the visualization is linked above. Data was provided by Tableau.",
    ],
  },

  "ocean-currents": {
    tone: "formal",
    standfirst:
      "Global ocean surface currents, shown as magnitude in metres per second and direction in geographic degrees.",
    paragraphs: [
      "Ocean currents matter for several reasons. They regulate climate by distributing heat around the planet — the Gulf Stream carries warm water from the tropics to the North Atlantic, which helps moderate temperatures in Europe. They transport nutrients from deep water to the surface, supporting the phytoplankton and other marine organisms that form the base of the marine food web. Those same phytoplankton are responsible for producing a significant portion of the Earth's oxygen through photosynthesis.",
      "Currents also shape marine ecosystems, influencing the distribution of species, creating habitats, and affecting migration patterns. And they have been used for centuries as natural highways for maritime transport and trade, letting ships travel more efficiently by taking advantage of favourable flow.",
    ],
    credits: [
      {
        label: "Dataset",
        lines: [
          "Variable mapped: ocean currents — magnitude (m/s) and direction (geographic degrees)",
          "Data and service projection: GCS WGS84",
          "Extent: global (73°S to 85°N) · Cell size: ~30 km · Source type: Vector-MagDir",
          "Source: NOAA Atlantic Oceanographic and Meteorological Laboratory — Physical Oceanography Division (PhOD)",
          "Data from 2005–2023 compiled to generate this annual climatology layer",
        ],
      },
      {
        label: "Credit",
        lines: [
          "Climatology developed by Rick Lumpkin (NOAA/AOML) and Lucas Laurindo (Univ. Miami), in collaboration with Arthur Mariano (Univ. Miami), Mayra Pazos (NOAA/AOML), and Erik Valdes (CIMAS/AOML). Previous versions were developed with Gregory Johnson (NOAA/PMEL), Silvia Garzoli (NOAA/AOML), Jessica Redman (CIMAS), and Zulema Garraffo (Univ. Miami).",
        ],
      },
      {
        label: "Citation",
        lines: [
          "Laurindo, L., A. Mariano, and R. Lumpkin, 2017: An improved near-surface velocity climatology for the global ocean from drifter observations. Deep-Sea Res. I, 124, pp. 73–92. doi:10.1016/j.dsr.2017.04.009",
        ],
      },
    ],
  },

  hexbin: {
    tone: "field-notes",
    standfirst:
      "Something I've always wanted in my interactive 3D web maps: spring-physics hover — columns near your cursor bounce up with real spring dynamics.",
    paragraphs: [
      "Does Esri offer that feature? No. So I built it.",
      "I generated synthetic American Community Survey census data in a few seconds, aggregated it into hexagon bins, extruded those in 3D by count of observations per bin with MapLibre GL JS, and then got to spend the rest of the time playing with spring mechanics. It exports as a static HTML file with zero dependencies.",
      "Was it practical? Probably not. But was it necessary? Yes.",
      "The physics is a damped oscillator per hexagon — stiffness at 0.32, damping at 0.58, a hover height multiplier of 3.5, and an effect radius of 160 pixels. Higher stiffness makes it snappier; lower damping makes it bouncier.",
      "The architecture underneath is a MapLibre GL JS fill-extrusion layer for the hex columns, per-frame height updates through feature-state, the spring engine running one oscillator per hex, and mouse proximity detection in screen space. MapLibre GL JS 4.7.1, CartoDB Dark Matter basemap tiles, vanilla JavaScript with no framework and no build step, and Float64Array typed arrays to hold 60fps.",
      "I'd personally love to see this on a 3D correlation heat matrix next.",
    ],
    credits: [
      {
        label: "Note on the data",
        lines: [
          "The interactive build runs on synthetic ACS-style data generated for the demo, not a real census extract — the point of the exercise was the interaction, not the estimate. The static renders in this gallery are the real-data version.",
        ],
      },
    ],
  },

  "mls-dashboard": {
    tone: "formal",
    standfirst:
      "A full-stack MLS analytics dashboard, and the design system that grew out of maturing it.",
    paragraphs: [
      "The dashboard covers a season of Major League Soccer — squad and player analytics, salary against performance, home and away splits, shot quality, and passing structure — built as a single React application over shot-level and match-level event data.",
      "The more interesting problem turned out not to be the analysis but the consistency. Once a dashboard has enough views, every new chart is a chance to invent a slightly different color, spacing, or label convention. I wrote about how that got resolved into an actual design system in the article linked above.",
    ],
  },

  "urban-growth": {
    tone: "formal",
    standfirst:
      "An exploration of the age of buildings within specific cities, using R and RStudio.",
    paragraphs: [
      "Inspired by Dominic Royé's Intro to GIS with R blog post. Data taken from INSPIRE.",
      "The data was downloaded with a feed.extract(url) function, filtered by province with an RSS link, and imported using dir_ls(). Buffering and geometry work used tmaptools — Geocode_OSM, st_buffer(), st_transform(), and st_intersection(). The map itself was created with the tmap package, an alternative to ggplot2, and color symbology was handled with colorRampPalette().",
    ],
  },

  "uav-photogrammetry": {
    tone: "formal",
    paragraphs: [
      "These images represent data collected by a LiDAR-equipped UAV over Clemson University's campus in 2017.",
      "The point cloud models are symbolized here by the elevation and compass orientation of each surface — the aspect — of the digital surface models.",
    ],
  },

  "toxic-release": {
    tone: "formal",
    paragraphs: [
      "The Environmental Protection Agency (EPA) and Energy Information Administration (EIA) collect data on facility greenhouse gas emissions, toxic releases, and power plant output throughout the U.S. This information is available to the public.",
      "The dashboard linked above lets you explore that data directly.",
    ],
    credits: [
      {
        label: "With thanks",
        lines: [
          "Compiled with the help of Jon Sherwood and Blake Lytle at the Clemson Center for Geospatial Technologies.",
        ],
      },
    ],
  },

  "global-temperatures": {
    tone: "formal",
    standfirst:
      "An analysis of surface temperature at 100 locations around the globe.",
    paragraphs: [
      "Each data point is presented as a difference from the median temperature, calculated as the 1961–1990 average. Lower temperatures are marked purple, median temperatures yellow, and high temperatures red.",
      "An interactive version of the dashboard is linked above. Data was provided by Tableau.",
    ],
  },

  "vehicle-fuel-efficiency": {
    tone: "formal",
    paragraphs: [
      "An analysis of vehicle fuel efficiency. The dashboard summarizes the results by automotive make, model, class, fuel type, and engine cylinder count.",
    ],
  },

  "politics-uk": {
    tone: "formal",
    standfirst:
      "How the presentation of information can influence the message an audience receives.",
    paragraphs: [
      "The example data is from a 2015 general election in the United Kingdom. The first half examines the concepts of data classification and normalization for quantitative data. The second half consists of thematic maps that illustrate qualitative data in area-based and point-based symbology, for multiple pieces of information at once.",
      "The data used includes voter turnout percentages, vote share, and political parties.",
    ],
  },

  "northridge-earthquake": {
    tone: "formal",
    paragraphs: [
      "At about 4:30 a.m. on January 17, 1994, a magnitude 6.7 earthquake struck in Southern California. The intense shaking lasted for about 10 to 20 seconds and caused an estimated $20 billion in damage. This was largely attributed to the duration of the shaking and the speed of vibrations within a densely populated area.",
      "This project was done to visualize the Northridge earthquake and the damage that it caused. I analyzed how fault lines shaped the topography of the San Fernando valley, the location and density of aftershock tremors, the approximate distance the seismic waves traveled, the ground's acceleration and velocity during the event, and the damages associated with that movement.",
    ],
  },

  "us-migration-flows": {
    tone: "field-notes",
    standfirst:
      "I've been playing around with ways to visualize flow mapping, and stumbled onto Flowmap City.",
    paragraphs: [
      "It's an open-source, in-browser visual analytics tool built specifically for mobility data. To experiment, I uploaded some 2023 state migration data from the US Census Bureau that captured the total number of people who moved from one state to another.",
      "The pros: the program does a good job of visualizing large datasets. Each flow line is bidirectional, showing the inbound and outbound migration totals. Each flow line and node is also color-coded and sized proportional to the total count of migrants. All the customization, settings, and filtering sit in a simple interface, with no code.",
      "The cons: I wish there were a way to make it into a dashboard, with several interactive charts, tables, or graphs that could filter each other — the way Tableau, Power BI, or ArcGIS Insights do.",
      "The animation shows the net total migration for each relationship between states, with flows and nodes color-coded and sized proportional to the total population migration values.",
    ],
  },

  "earth-from-above": {
    tone: "formal",
    paragraphs: [
      "This project explores the globe using Solargis.",
    ],
    credits: [
      {
        label: "Output features",
        lines: [
          "Satellite imagery",
          "Land classification",
          "Air temperatures",
          "Population density",
          "Optimal photovoltaic array tilt",
          "Solar energy radiation",
        ],
      },
    ],
  },

  chattooga: {
    tone: "formal",
    paragraphs: [
      "An ongoing research project with the Forestry Department at Clemson University.",
    ],
  },

  /* Built from Patrick's two write-ups on the piece — the first published with
     the era-level view, the second when he went back for the day-level one.
     The sentences are his, compressed and joined; the platform scaffolding
     (hashtags, "let me know in the comments") is dropped per the rule at the
     top of this file. Nothing here was added that he didn't say.

     The two paragraphs about the second version are the argument the piece
     actually makes, and they are worth not cutting: the macro view was the
     one that got attention, and he is the one who noticed what it had thrown
     away. The rebuild of the underlying data is recorded in `credits`, not in
     the prose, because that part is not his account. */
  /* Patrick's own LinkedIn post about the piece, 2026-08-07. Field notes
     register, and the personal frame is the point of it — he chose to keep
     the injury, the insurance aside and the closing joke rather than reduce
     it to a pipeline description. The sentences are his. Dropped per the rule
     at the top of this file: two emoji, which are the clearest platform
     artifact in the original. Nothing was added that he didn't say.

     Note the arithmetic this narrative does NOT restate: `method` in
     projects.ts says 6,212 DICOM instances recovered, where the post says he
     requested more than 2,000 — different counts of different things (the
     request against the full recovered study), so the prose keeps his number
     and the data keeps its own rather than silently reconciling them. */
  /* Patrick's own LinkedIn drafts for the piece, 2026-08. He wrote two — a
     story about finding the bug, and a technical build post — and noted they
     overlap too much to publish both to a feed. A detail page is not a feed:
     it can carry the story first and the build detail after, which is what a
     case study is for, so both are here in his words with the platform
     scaffolding ("repo and live demo in the comments") and his own editorial
     notes to himself dropped. Nothing was added that he didn't say. */
  "solar-siting-explorer": {
    tone: "field-notes",
    standfirst:
      "I found my own project claiming a feature it didn't have.",
    paragraphs: [
      "I've been building a solar siting explorer to close a specific gap in my toolkit — ten years of Python and ArcGIS geospatial work, but no MapLibre or deck.gl. It scores land for utility-scale solar: slope from SRTM elevation, land cover from ESA WorldCover, distance to transmission from HIFLD, with protected land excluded via PAD-US.",
      "Except it didn't score transmission. My write-up described a four-criterion model. The code computed two. The transmission lines were fetched, drawn on the map, and never used in the maths.",
      "Nobody lied. The cause was structural: the scoring logic existed in three places — a batch script, a second script layering exclusions on its output, and later an API. Three copies is how an implementation and its documentation drift apart without anyone noticing.",
      "So the fix wasn't to add the criterion. It was to collapse three copies into one function that both the batch pipeline and the live API import. Now they can't disagree — not by discipline, by construction. Then I implemented transmission proximity for real.",
      "Two details that would have produced a wrong map that still looked right: distances have to be measured in a projected CRS, not degrees (a degree is ~111 km north–south but ~88 km east–west at that latitude), and the infrastructure query needs a padded bounding box, or a line 500 m outside your study area is invisible to the scoring.",
      "The interesting part of a project usually isn't the thing that worked.",
      "As for what it does: draw a study area anywhere in the US, set your own criterion weights, and a Python pipeline scores it. MapLibre GL JS and deck.gl rendering; GeoPandas and Rasterio doing the actual analysis. Every source is public and needs no API key.",
      "The histogram is the filter. Click a bar and the map filters to that score range — out-of-range cells fade rather than disappear, so the study area keeps its shape. Standard in ArcGIS Pro, rare on the web. Infrastructure follows the viewport: transmission lines and protected areas re-query as you pan, debounced, so whatever your score is measured against is actually on screen wherever you decide to draw.",
      "Every criterion is its own layer, each with its own colour ramp, and the tooltip shows the raw inputs behind a cell — 67.7 out of 100, from a 1.2° slope, tree cover, and 1.49 km to the nearest line. Those layers are derived in the browser from sub-score columns rather than downloaded, which took first paint from ~30 MB to 7.6 MB. The layer controls are a real ARIA radiogroup, and the URL carries the study area and every parameter, so a run is a link you can send someone.",
      "One deliberate boundary worth naming: the live demo is frontend-only. The analysis backend is in the repo and runs with one `docker compose up` — it just isn't hosted. It's ~400 MB of geospatial native dependencies with a CPU-bound scoring loop, which is a container's job, not a free serverless tier's. I tried the serverless route anyway and it died importing Rasterio over a missing system library the wheel expects the OS to supply. So the deployed page ships the pre-computed layers, the symbology, the filtering and the shareable URLs — all real — and says plainly where the line is instead of failing at you.",
    ],
    credits: [
      {
        label: "Build",
        lines: [
          "Frontend — React, Vite, MapLibre GL JS, deck.gl, Recharts",
          "Analysis — Python, GeoPandas, Rasterio, FastAPI",
          "Weights 45 / 30 / 25 — slope, land cover, transmission proximity",
          "PAD-US applied after the weighted sum as a 0.05 multiplier — an exclusion, not a fourth term",
          "Tests — browser tests against real MapLibre and deck.gl; scoring maths verified offline against synthetic data with hand-computable answers",
        ],
      },
    ],
  },

  "brain-mri-explorer": {
    tone: "field-notes",
    standfirst:
      "I recently had a traumatic brain injury and have had a terrible time recovering. My neurologist ordered an MRI.",
    paragraphs: [
      "Naturally, as a spatial data scientist and data viz enthusiast, I requested the full dataset of more than 2,000 uncompressed DICOM medical images and turned it into a 3D model of my own brain you can explore in a browser. (Is this how I handle grief?)",
      "Well actually, to make it more technically interesting, the hospital portal gave me four download links. All four zips were corrupt — truncated, no valid archive directory. Nothing would open them.",
      "So I, with my friend Claude, wrote a streaming salvage script that walked the raw bytes, found the DICOM file signatures, and CRC-validated each instance it pulled out. That recovered the study intact. (Then my insurance called to tell me that the radiology practice was out of network, and they weren't going to cover the bill. But I digress. This is a data science story.)",
      "From there: 192 sagittal T1-MPRAGE slices, at 1 × 0.9375 × 0.9375 mm voxels, stacked into an 11.5-million-voxel volume. A morphological skull-strip, then marching cubes to turn the voxel grid into a triangle mesh — Taubin smoothing and quadric decimation to keep it fast. Ambient occlusion baked per-vertex, so anatomically the sulci read as real depth instead of flat shading. Eighty SWI slices through a Frangi vesselness filter to extract my cerebral veins.",
      "Anatomy labeled with a deep-learning DKT atlas (Desikan-Killiany-Tourville, Mindboggle-101): 31 cortical regions per hemisphere, plus individual subcortical nuclei — thalamus, hippocampus, amygdala, caudate, putamen, globus pallidus.",
      "The final product: 14 structures and roughly 217,000 vertices in one self-contained HTML file. Three.js and all geometry inlined. No server, no upload.",
      "The part I didn't expect to care about — the parcellation follows my actual sulci. Not a template brain warped to approximate mine; the model traced the folds in my own cortex. My hippocampus is 6.7 cc. My thalamus is 16.3 cc. Those are my numbers. There's something fascinating about rotating your own brain with a mouse.",
      "Is this the smallest map that's ever been made?",
    ],
    credits: [
      {
        label: "Pipeline",
        lines: [
          "Python — pydicom, NumPy, scikit-image, trimesh, ANTsPyNet",
          "Rendering — Three.js, geometry inlined, no server",
          "192 sagittal T1-MPRAGE slices · 1 × 0.9375 × 0.9375 mm voxels",
          "80 SWI slices · Frangi vesselness filter for the cerebral veins",
          "14 structures · ~217,000 vertices · one self-contained HTML file",
        ],
      },
    ],
  },

  /* From Patrick's three write-ups of the app, posted as he shipped it. His
     sentences, compressed, with the platform scaffolding dropped. Two numbers
     were reconciled against the app's own data rather than carried across:
     sixteen landmark events, not fifteen (`books` in gospels-data.json), and
     3,754 verses, not 3,779 — see the note in the text, which is the more
     interesting fact anyway. */
  "jesus-world": {
    tone: "field-notes",
    standfirst:
      "Every event in the Gospels has a where and a when, and it is told by up to four narrators who overlap heavily and agree only loosely on order. That is a data problem before it is a religious one.",
    paragraphs: [
      "I built this the way I would build any interactive dashboard for work, and following the same method: take messy data and a story, do the exploratory analysis, then craft an interactive visual aid that helps someone else understand both. The content here happens to be historical and religious, and the data happens to be the four Gospel narratives, archaeology and Josephus.",
      "The design problem is the two axes and the four sources. So I modelled everything as a place-and-time coordinate and bound three surfaces to the same state — a map, a timeline and a reader. Move in any one of them and the other two follow. A fractional-year scrubber is the single clock all three observe, and one JSON file drives the whole thing.",
      "The map holds 26 places across AD 29 to 33, with seven historical regions drawn along real coastline and river geometry, and routes rendered differently over land than over sea. The timeline holds six periods on a progressive-disclosure model: periods first, then the sixteen landmark events, then full detail. Scrub the timeline and the routes draw progressively across the map. Hover a stop and its city lights up. Press play and the whole four-year arc narrates itself — routes extend, the map pans to follow the protagonist, and a glass caption card tracks wherever you are. Drill into a period and you get its stops, its events, and a separate thread per place, so three years of activity at Capernaum accumulates in a single row.",
      "A source filter sits above all of it, called the Gospel Lens. Switch to John on the map and everything else filters with it — it is global state, so the charts pane follows.",
      "Charted, there are 55 located events — 34 miracles, 9 encounters, 7 teachings and 5 turning points — alongside 34 parables, each classified and placed. You can see where they cluster by period and place, which Gospels attest which events, and what each Gospel disproportionately emphasises. The attestation overlaps are more interesting than I expected: the Synoptics agree in ways that make John's independence obvious at a glance, rather than a claim you are asked to take on faith.",
      "The reader is the part I would show first. All four accounts are sequenced into a single chronological read — 39 days, every one of the 89 chapters — and made scroll-driven. As you read, the map pans to the place being described and the timeline advances to the year. The resolution is finer than a day: the final day moves through Emmaus, Thomas, the shore, the commission and the ascension, and the map travels all five as you scroll past them. For scenes inside Jerusalem it crossfades from the regional map to a schematic city view, because a single Jerusalem pin tells you nothing about whether you are in the temple, the upper room or the garden.",
      "It deliberately does not merge the accounts. Where Matthew, Mark and Luke describe the same moment they sit adjacent — one event seen three ways, rather than three chapters in three different books — and where they differ, they stay distinct.",
      "The sequence is not mine. It is days 286 to 324 of the printed Daily Reading Index in Crossway's ESV Chronological Bible, the same volume transcribed for the Sankey elsewhere in this gallery. That fidelity is why the reader carries 3,754 verses rather than the 3,779 in the four Gospels. Twenty-five are absent, and they are the famous ones: the printed plan brackets Mark 16:9–20 and John 7:53–8:11 as additional reading, and skips Mark 11:26 in silence. All three are passages the critical texts omit. I followed the plan rather than quietly correcting it.",
      "The terrain generator reconstructs ancient shorelines from elevation data and then validates its own output against a measurement. Two attempts failed. The Dead Sea's antique −395 m shoreline came back as scattered two-point scraps rather than one ring, because at 150 m per pixel the band is only a few pixels wide against a cliff. Lake Huleh could not be separated from its own valley floor by an elevation threshold alone; the check there was Josephus, War 3.515 — sixty furlongs by thirty, about 11 by 5.5 km — and the best candidate ring missed it badly. Neither shipped. The script emits the reason instead of a plausible-looking wrong shape. The town plans follow the same rule: measured dimensions and named landmarks are sourced and cited, or they are not drawn.",
    ],
    credits: [
      {
        label: "Data",
        lines: [
          "26 places · 7 regions · 6 periods · 16 landmark events",
          "55 located events · 34 parables · 4 Gospels, 89 chapters, 3,754 verses",
          "Sequence: ESV Chronological Bible Daily Reading Index, days 286–324",
          "Shorelines: Terrarium DEM (z10) · Dead Sea levels after Bookman et al. 2004",
        ],
      },
      {
        label: "Built with",
        lines: [
          "React · Vite · D3 · TopoJSON",
          "One JSON data file · fractional-year scrubber as the shared clock",
        ],
      },
    ],
  },

  /* Built from Patrick's own two abstracts in the thesis itself — the same
     editorial move as `scid-access`, where the source was his executive
     summary. Sentences are his, compressed; the register is formal because
     the source is. Every figure quoted is from the document. */
  "pv-peak-shaving-thesis": {
    tone: "formal",
    standfirst:
      "Two questions, in order. Can a consumer drone measure a building well enough to plan on? And if it can, what are 88 poultry farm roofs worth to a rural grid?",
    paragraphs: [
      "Little literature existed on measuring agricultural buildings with imagery from a UAV-mounted camera. Survey-grade tools produce highly accurate results at high financial and temporal cost. Satellite imagery is readily available and relatively cheap, but low in spatial and temporal resolution. Unmanned aerial vehicles were emerging as a balance between the two, and the first half of this work was a test of whether that balance actually held — measured against hand-collected control, with no ground control points and no on-board survey-grade georeferencing.",
      "Thirty-one broiler houses across Oconee and Anderson Counties, South Carolina. A DJI Mavic Pro flew a traditional double-grid path at 69 metres, camera at −80° from the horizon, 70–80% overlap, 4K. Images were processed in Agisoft Photoscan and orthophotos generated from the 3D sequences by Structure from Motion.",
      "One correction mattered more than any parameter. Rooftop overhang obscures the building footprint from the air, so measuring the roof measures the wrong thing: 0.91 m had to come off the roof width and 0.61 m off the length, based on observed overhangs on poultry buildings.",
      "Buildings ranged from 10.8 to 184.0 m. Mean measurement error across all planar dimensions was 0.69% — average length error 1.66 ± 0.48 m, average width error 0.047 ± 0.13 m. Heights ran 1.9 to 5.6 m with mean error 0.06 ± 0.04 m, or 1.2%. At 5.4 minutes per hectare and a ground sample distance of 4.84 cm, a consumer drone and SfM produced accurate DSMs and orthomosaics without survey equipment or GCPs.",
      "Compared against the same measurements from readily available satellite imagery, the results were mixed, and the mixture is the finding. Mean error in the satellite images was −0.36%: length −0.46 ± 0.49 m, width −0.44 ± 0.14 m. The satellite orthomosaics were more accurate for length; the UAV orthomosaics were more accurate for width. The disparity was likely down to flight altitude, camera field of view and building shape. Heights could not be measured from satellite at all. Satellite was cheap and convenient for orientation and planimetric dimensions; the UAV gave dependably current data, vertical dimensions, and the absolute accuracy needed to combine with GIS layers from other sources.",
      "The second half asked what that measurement was for. The primary challenge facing an energy supplier is forecasting and supplying hourly peak demand, and distributing that supply efficiently to remote customers. The question here was whether poultry farms could function as rurally distributed, peak-demand photovoltaic plants for sparsely populated areas.",
      "Eighty-eight farms were examined by UAV and satellite. The typical farm held four houses, each 15.2 by 152.4 metres, oriented east–west, roof slope 22.6°, with 1,254 m² of suitable rooftop. Average supply from a farm of that size came to 496 kW/hr at peak, 279 kW/hr in the summer shoulder, and a 425 kW/hr contribution to summer base load. Across all 88: 59.2 MW/h at summer peak, 47.0 MW/hr to summer base, 127.3 GWh/yr of total energy.",
      "Facility demand and energy use ran to 10–20% of gross hourly rooftop supply across the time categories, leaving a net peak demand reduction potential of 51.6 MW/h — 83% — and an annual net supply to the grid of 109.4 GWh, or 86%.",
      "The distribution cost is what sorts them. Twenty-seven of the farms sat further than 3.28 km from an existing transmission line, and those proved the most valuable, both for reducing peak demand and for getting energy into rural areas. The results suggest a promising potential for distributed PV adoption in a peak-shaving role.",
    ],
    credits: [
      {
        label: "Method",
        lines: [
          "DJI Mavic Pro · 69 m AGL · −80° camera · 70–80% overlap · double grid",
          "Agisoft Photoscan Professional · Structure from Motion · DSM + orthomosaic",
          "31 broiler houses measured against hand-collected control; no GCPs, no survey-grade GNSS",
          "88 farms modelled for rooftop supply against seasonal peak, shoulder, base and energy",
        ],
      },
      {
        label: "Published",
        lines: [
          "M.S. Thesis, Clemson University (2020) — open.clemson.edu/all_theses/3380",
          "Rooftop-measurement half: Drones (MDPI) 4(4):76, with Koc, Chastain and Post",
        ],
      },
    ],
  },

  "chrono-sankey": {
    tone: "field-notes",
    standfirst:
      "Crossway's ESV Chronological Bible braids every verse into a strictly linear timeline. This is what that rearrangement looks like when you draw it.",
    paragraphs: [
      "I've been reading from a Bible published by Crossway called the ESV Chronological Bible. It's been fascinating to see how they've braided every single verse into a strictly linear timeline. As a data scientist I often visualize complex datasets in order to quickly extract meaning, and while reading the 66 books in this unique format I found myself wondering how I could visualize the changes this publisher made to the traditional order of the biblical narrative.",
      "The traditional order runs down the left: all 66 books, Genesis to Revelation, ranked accordingly. The chronological timeline runs down the right. The translucent ribbons between them connect the same verse in both timelines, so they draw every point where a verse in the chronological edition deviates from where the canon puts it. The ribbons are weighted proportional to their quantity — the more verses, the larger the ribbon.",
      "They are also aggregated by origin and destination, for cleanliness. If ten verses connect two sections but occur over five intervals, they are drawn as one ribbon with a weighted value of ten. That tidies the visual and lets a reader appreciate the macro perspective of the entire biblical story. The alternative would be 31,102 ribbons — an impressive amount of detail, and a reliable way to lose the forest for the trees.",
      "I liked how that first version captured the macro perspective, which I got by summarizing the books into genres and aggregating the narrative links. But in filtering out the micro-perspective it lost some of the magic of actually reading this format day to day, where in a single day you might read a passage from 1 Chronicles, then Judges, then Ruth, then a Psalm.",
      "So I built a second version against the Bible's 365 daily readings. Both the nodes and the links are weighted by verse volume, so more verses means greater height, and the greater the slope of a link, the greater the deviation from the traditional timeline.",
      "My idea started as curiosity, pattern recognition, and the art of reframing old information through a new lens. Ironically, I found myself turning narrative into data in order to let the data tell a narrative. Data science, at its best, is about finding beauty in structure — whether you're analyzing retail sales, migration patterns, or a 3,000-year-old narrative about humanity trying to make sense of itself.",
      "You don't have to be religious to appreciate it.",
    ],
    /* No `credits` block. It used to carry a "Method" list, which rendered a
       second <h2>Method</h2> directly under the one PieceDetail already draws
       from `project.method` — same heading, overlapping content. The
       substance now lives in `method` and `source` on the piece itself, which
       is where every other piece keeps it. */
  },
};
