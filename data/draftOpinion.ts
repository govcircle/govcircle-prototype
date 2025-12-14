

import { Opinion, OpinionStatus } from '../types';

export const draftOpinion: Omit<Opinion, 'id' | 'createdDate' | 'createdTimestamp' | 'updatedDate' | 'updatedTimestamp'> = {
  owner: {
    username: "Dr_Governance",
    handle: "$dr_gov",
    roles: [
      { type: "DRep", id: "drep1ytwlmrm6ksc8sa5fdhm63prqve6hjzvghdc3053zwz6hyeg0ayhg2" },
      { type: "CC", id: "key-hash-13493790d9b03483a1e1e684ea4faf1ee48a58f402574e7f2246f4d4" }
    ],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrGov"
  },
  intent: "",
  status: "Draft" as OpinionStatus,
  events: [],
  ruleAmendments: [],
  constitutionContentAmendments: [],
  comments: []
};