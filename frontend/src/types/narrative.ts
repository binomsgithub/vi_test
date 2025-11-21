export interface NarrativeBlock {
  id: string;
  heading: string;
  body: string;
}

export interface NarrativeContent {
  title: string;
  intro?: string;
  blocks: NarrativeBlock[];
  footerNote?: string;
}

