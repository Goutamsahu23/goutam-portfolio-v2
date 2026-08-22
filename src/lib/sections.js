/** Section registry — drives the nav index, the in-margin numbering and the
 *  active-section observer. Order here is the order on the page. */
export const SECTIONS = [
  { id: 'start', index: '00', label: 'Start' },
  { id: 'statement', index: '01', label: 'Statement' },
  { id: 'stack', index: '02', label: 'Skills' },
  { id: 'trajectory', index: '03', label: 'Experience' },
  { id: 'work', index: '04', label: 'Projects' },
  { id: 'credentials', index: '05', label: 'Education' },
  { id: 'contact', index: '06', label: 'Contact' },
]

/** Stable reference — hooks observe this array, so it must not be rebuilt. */
export const SECTION_IDS = SECTIONS.map((section) => section.id)
