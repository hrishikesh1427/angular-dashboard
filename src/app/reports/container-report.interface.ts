export interface PathEntry {
  location: string;
  timestamp: string;
  weight?: number;
}

export interface ContainerReport {
  containerNumber: string;
  timeRange: {
    start: string;
    end: string;
  };
  path: PathEntry[];
} 