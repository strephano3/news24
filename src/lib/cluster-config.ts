export const clusterDefinitions = [
  { id: "news", label: "News", cluster: "news" },
  { id: "conti", label: "I migliori conti", cluster: "i migliori conti" },
  { id: "consigli", label: "Consigli", cluster: "consigli" },
  { id: "esperienze", label: "Esperienze", cluster: "esperienze" },
] as const;

export type ClusterDefinition = (typeof clusterDefinitions)[number];
