

export type ColorStop = { color: string; position?: number };

export interface BackgroundConfig {
  type: "solid" | "transparent" | "gradient";
  color?: string;
  opacity?: number;
  gradient?: { angle?: string | number; stops: ColorStop[] };
}

export interface BorderConfig {
  width?: number;
  color?: string;
  style?: "solid" | "dashed" | "dotted";
  radius?: string; // tailwind class like 'rounded-lg'
}

export interface TextConfig {
  color?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "thin" | "normal" | "bold" | "semibold";
}

export interface ComponentConfig {
  id?: string;
  background?: BackgroundConfig;
  border?: BorderConfig;
  text?: TextConfig;
  className?: string;
}

// --- NEW DATA MODELS ---

export interface VotingStats {
  yes: number;
  no: number;
  abstain: number;
}

export interface ConstitutionMeta {
  title: string;
  version: number;
  submissionTx: string;
  deposit: number;
  scriptHash: string;
  enactedEpoch: string;
  anchorLink: string;
  liveness: string;
  votingResults: {
    CC: VotingStats;
    DRep: VotingStats;
  };
}

export type ConstitutionContentType = 'Article' | 'Tenet' | 'Section' | 'appendix' | 'GuardRail' | 'Description';

export interface ConstitutionContent {
  id: number;
  title: string;
  type: ConstitutionContentType;
  order: number;
  children: ConstitutionContent[];
}

export interface Rule {
  id: number;
  constitutionContentId: number;
  content: string;
  order: number;
}

export interface Constitution {
  id: string; // Top level ID for routing
  meta: ConstitutionMeta;
  preamble: {
    title: string;
    content: string;
  };
  constitutionContent: ConstitutionContent[];
  rules: Rule[];
  // Legacy/UI helper fields
  latest?: boolean;
}

// Alias for backward compatibility in components
export type ConstitutionVersion = Constitution;

// Navigation
export interface NavItem {
  id: string;
  label: string;
  children?: NavItem[];
}

// Opinion Types
export type RoleType = 'SPO' | 'CC' | 'DRep';

export interface RoleIdentity {
  type: RoleType;
  id: string; // The specific ID (DRepID, PoolID, KeyHash)
}

export type OpinionStatus = 'Draft' | 'Live' | 'Voting' | 'Ratified' | 'Denied' | 'Closed';
export type EventStatus = 'Waiting' | 'Canceled' | 'Live Now' | 'Finished';
export type EventDuty = 'Host' | 'Co-Host' | 'Speaker';
export type SocialPlatform = 'youtube' | 'instagram' | 'x' | 'facebook' | 'discord';

export interface EventHost {
  username: string;
  avatar: string;
  roles: RoleIdentity[];
  duty: EventDuty;
}

export interface OpinionEvent {
  id: string;
  subject: string;
  description: string;
  hosts: EventHost[];
  startDate: string;
  duration: string;
  status: EventStatus;
  socialMedia: SocialPlatform;
  link?: string;
}

export type ActionType = 'Edit' | 'Remove' | 'Add';

export interface RuleAmendment {
  baseRule?: Rule;
  revisedRule?: Rule;
  reason: string;
  actionType: ActionType;
  path?: string;
}

export interface ConstitutionContentAmendment {
  baseContent?: ConstitutionContent;
  revisedContent?: ConstitutionContent;
  reason: string;
  actionType: ActionType;
  parentId?: number;
  path?: string;
}

export interface Comment {
  id: number;
  owner: {
    username: string;
    handle: string;
    roles: RoleIdentity[];
    avatar: string;
  };
  text: string;
  likes: string[]; // Array of User IDs who liked
  dislikes: string[]; // Array of User IDs who disliked
  favorites: string[]; // Array of User IDs who favorited
  replyTo: number | null; // ID of parent comment
}

export interface Opinion {
  id: string;
  owner: {
    username: string;
    handle: string;
    roles: RoleIdentity[];
    avatar: string;
  };
  intent: string;
  createdDate: string; // Display string
  createdTimestamp: number; // For sorting
  updatedDate: string; // Display string
  updatedTimestamp: number; // For sorting
  status: OpinionStatus;
  events: OpinionEvent[];
  // New Amendment Fields
  ruleAmendments: RuleAmendment[];
  constitutionContentAmendments: ConstitutionContentAmendment[];
  // Comments
  comments: Comment[];
}

export interface ChangelogEntry {
  originalConstitutionId: string;
  revisedConstitutionId: string;
  contentAmendments: ConstitutionContentAmendment[];
  ruleAmendments: RuleAmendment[];
}