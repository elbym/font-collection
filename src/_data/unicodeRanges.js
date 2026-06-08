// Ordered list of Unicode sections shown in the ASCII character grid on
// specimen pages. Each entry becomes one <h2> + grid block in font-poster.njk.
// .eleventy.js imports this file to build its UNICODE_RANGES filter lookup.
module.exports = [
  { key: "ascii",           label: "Basic ASCII",               range: [33,    126]   },
  { key: "ligatures",       label: "Ligaturen",                 range: [64256, 64263] },
  { key: "fractions",       label: "Brüche",                    range: [8528,  8544]  },
  { key: "punctuationTypo", label: "Typografische Satzzeichen", range: [8208,  8287]  },
  { key: "superSub",        label: "Hoch- / Tiefgestellt",      range: [8304,  8352]  },
  { key: "letterlike",      label: "Buchstabenartige Symbole",  range: [8448,  8528]  },
  { key: "currency",        label: "Währungssymbole",           range: [8352,  8400]  },
  { key: "latin1",          label: "Latin-1",                   range: [160,   255]   },
  { key: "latinExtA",       label: "Latein Erweitert-A",        range: [256,   384]   },
  { key: "latinExtB",       label: "Latein Erweitert-B",        range: [384,   592]   },
  { key: "latinExtAdd",     label: "Latein Erweitert Zusatz",   range: [7680,  7936]  },
  { key: "greek",           label: "Griechisch",                range: [880,   1024]  },
  { key: "arrows",          label: "Pfeile",                    range: [8592,  8704]  },
  { key: "boxDrawing",      label: "Boxzeichnen",               range: [9472,  9600]  },
];
