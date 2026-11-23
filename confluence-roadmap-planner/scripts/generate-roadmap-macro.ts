/**
 * Helper para generar el XML de almacenamiento (Storage Format / XHTML)
 * de la macro nativa "Planificador de Hoja de Ruta" (Roadmap Planner) de Confluence Cloud.
 *
 * @usage
 * ts-node generate-roadmap-macro.ts
 */

export interface RoadmapBar {
  id: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD 00:00:00
  duration: number; // Duración relativa en meses (ej. 0.5, 1.0, 2.5)
  rowIndex: number; // Fila dentro del carril (0, 1, 2)
  pageLink?: Record<string, unknown>;
}

export interface RoadmapLaneColor {
  lane: string;
  bar: string;
  text: string;
  count: number;
}

export interface RoadmapLane {
  title: string;
  color?: RoadmapLaneColor;
  bars: RoadmapBar[];
}

export interface RoadmapMarker {
  title: string;
  markerDate: string; // YYYY-MM-DD 00:00:00
}

export interface RoadmapPlannerConfig {
  title: string;
  startDate: string; // YYYY-MM-DD 00:00:00
  endDate: string; // YYYY-MM-DD 00:00:00
  displayOption?: 'MONTH' | 'WEEK';
  lanes: RoadmapLane[];
  markers?: RoadmapMarker[];
}

export const CONFLUENCE_ROADMAP_COLORS = {
  GREEN: { lane: '#2abb7f', bar: '#2abb7f', text: '#ffffff', count: 1 },
  DARK_GREEN: { lane: '#1f845a', bar: '#1f845a', text: '#ffffff', count: 1 },
  BLUE: { lane: '#0c66e4', bar: '#0c66e4', text: '#ffffff', count: 1 },
  PURPLE: { lane: '#6e5dc6', bar: '#6e5dc6', text: '#ffffff', count: 1 },
  YELLOW: { lane: '#f6c342', bar: '#f6c342', text: '#594300', count: 1 },
  GREY: { lane: '#626f86', bar: '#626f86', text: '#ffffff', count: 1 },
};

/**
 * Genera el string XML XHTML de la macro Roadmap Planner listo para incrustar en Confluence Storage Format.
 */
export function buildConfluenceRoadmapXml(
  config: RoadmapPlannerConfig,
): string {
  const payload = {
    title: config.title,
    timeline: {
      startDate: config.startDate,
      endDate: config.endDate,
      displayOption: config.displayOption ?? 'MONTH',
    },
    lanes: config.lanes.map((lane, idx) => ({
      title: lane.title,
      color: lane.color ?? Object.values(CONFLUENCE_ROADMAP_COLORS)[idx % 6],
      bars: lane.bars.map((bar) => ({
        id: bar.id,
        title: bar.title,
        description: bar.description ?? '',
        startDate: bar.startDate,
        duration: bar.duration,
        rowIndex: bar.rowIndex ?? 0,
        pageLink: bar.pageLink ?? {},
      })),
    })),
    markers: config.markers ?? [],
  };

  const encodedSource = encodeURIComponent(JSON.stringify(payload));
  const encodedTitle = encodeURIComponent(config.title);

  return `<ac:structured-macro ac:name="roadmap" ac:schema-version="1" data-layout="default">
  <ac:parameter ac:name="maplinks"></ac:parameter>
  <ac:parameter ac:name="timeline">true</ac:parameter>
  <ac:parameter ac:name="source">${encodedSource}</ac:parameter>
  <ac:parameter ac:name="pagelinks"></ac:parameter>
  <ac:parameter ac:name="title">${encodedTitle}</ac:parameter>
</ac:structured-macro>`;
}
