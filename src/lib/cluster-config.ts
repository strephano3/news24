export const clusterDefinitions = [
  { id: "news", label: "News", cluster: "News" },
  { id: "conti", label: "I migliori conti", cluster: "I migliori conti" },
  { id: "consigli", label: "Consigli", cluster: "Consigli" },
  { id: "esperienze", label: "Esperienze", cluster: "Esperienze" },
] as const;

export type ClusterDefinition = (typeof clusterDefinitions)[number];
