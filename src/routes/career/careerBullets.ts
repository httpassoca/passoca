// Centralize career bullet text so it can be translated via message keys.
// The actual translations are stored in messages/*.json and accessed via paraglide.

export const CAREER_KEYS = {
  ctw: [
    "career_ctw_1",
    "career_ctw_2",
    "career_ctw_3",
    "career_ctw_4",
    "career_ctw_5",
    "career_ctw_tools",
    "career_ctw_stack",
  ],
  jmv: ["career_jmv_1", "career_jmv_2", "career_jmv_3", "career_jmv_4", "career_jmv_5"],
  spiry: ["career_spiry_1", "career_spiry_2"],
  senai: ["career_senai_1"],
  uemg: ["career_uemg_1", "career_uemg_2", "career_uemg_3", "career_uemg_4"],
} as const;
