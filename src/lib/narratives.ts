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
  "solar-agriculture": {
    tone: "field-notes",
    standfirst:
      "Field notes from the day I ran the solar model on my neighbour's farm.",
    paragraphs: [
      "Today I took the next step in exploring solar energy applications on my neighbour's farm. I opened ESRI's Spatial Analyst Toolbox in ArcGIS Pro and fired up the Raster Solar Radiation geoprocessing tool on my custom DSM.",
      "I ran the tool four times, on the four corners of the calendar that represent the greatest variations in solar path geometry and solar irradiance availability: the spring equinox, summer solstice, autumn equinox, and winter solstice.",
      "Parameters of note — I told the tool to sum all radiance values (global, meaning direct, diffuse, and indirect). I set the time interval for the entire day, as opposed to hourly or spanning multiple days. I left all of the topographic and radiation parameters at default.",
      "I noticed that the solar irradiance values are exceptionally conservative, possibly by as much as 40%. Many credible sources, including NOAA and National Renewable Energy Laboratory models, suggest greater resource availability up to 1.5 kWh/m²/day. However, I like the ESRI numbers for two reasons. First, since our specific area of interest gets twice the annual precipitation as the national average, I believe the lower value better reflects atmospheric transitivity — see what I did there. Second, it's easy to want the values to be higher, since renewable energy is cool and exciting. I have found in my 33 years of grand life-wisdom that it's usually wise to temper my enthusiasm and prevent an optimistic bias that over-represents the potential success of a burgeoning technology.",
      "On symbology: for continuity in comparing the results, I changed the stretch symbology of each day from the max and min of its own values to the max and min of the entire annual range. This allows greater variation in the symbology throughout the year, while keeping the actual quantification of the colour scheme consistent across the whole graphic.",
      "A fun fact for our lat/long/altitude: daylight duration ranges from a minimum of 9.5 hours in the winter to 14.3 hours in the summer. Meanwhile the maximum altitude of the solar path ranges from 31.9° above the horizon in winter to 78.8° in summer.",
    ],
  },

  "tcf-illumination": {
    tone: "field-notes",
    standfirst:
      "How do you make a 3D hillshade out of 2D images that symbolize a hillshade analysis, which was done on 3D point cloud data?",
    paragraphs: [
      "I am continuing my exploration with 3D lighting and shading. Today I took the 14 map exports from ArcGIS Pro that visualized the hourly hillshade illumination results of my neighbour's farm, and arranged them side by side in ascending order. Then I made those images 3D, and played around with tilt, materials, lighting, reflectance, and shadows.",
      "I suppose this falls into that final stage of an analysis — presenting your data. I find it's usually a combination of graphic design, aesthetic, and subjectivity, but I always find myself enjoying taking the time to polish my work. The results tend to be more compelling to the audience, and therefore more influential. I remember learning this from ESRI's Cartography MOOC back when I was in grad school — tip of the hat to John Nelson and Kenneth Field.",
      "Admittedly, I'm never exactly sure what the tension is between a boringly clear presentation and artistically presenting your results in a more creative, less objective way.",
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

  "urban-growth": {
    tone: "formal",
    standfirst:
      "An exploration of the age of buildings within specific cities, using R and RStudio.",
    paragraphs: [
      "Inspired by Dominic Royé's Intro to GIS with R blog post. Data taken from INSPIRE.",
      "The data was downloaded with a feed.extract(url) function, filtered by province with an RSS link, and imported using dir_ls(). Buffering and geometry work used tmaptools — Geocode_OSM, st_buffer(), st_transform(), and st_intersection(). The map itself was created with the tmap package, an alternative to ggplot2, and colour symbology was handled with colorRampPalette().",
    ],
  },
};
