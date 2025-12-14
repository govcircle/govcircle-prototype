
import { Opinion, EventStatus, RoleIdentity, ActionType, EventDuty } from '../types';

// Asset Imports - Using string paths since we are in a browser ES module environment
// that doesn't support importing non-JS files directly without a bundler.
// These paths assume the 'assets' folder is served at the root '/assets'.

const yutaImg =  `${import.meta.env.BASE_URL}/assets/yuta.jpeg`;
const peteImg =  `${import.meta.env.BASE_URL}/assets/pete.jpg`;
const lindaImg = `${import.meta.env.BASE_URL}/assets/linda.jpg`;
const peytonImg =`${import.meta.env.BASE_URL}/assets/peyton.jpg`;
const philImg =  `${import.meta.env.BASE_URL}/assets/phil.jpg`;
const ktorzImg = `${import.meta.env.BASE_URL}/assets/ktorz.jpg`;
const beeImg =   `${import.meta.env.BASE_URL}/assets/bee.jpg`;
const hornanImg =`${import.meta.env.BASE_URL}/assets/hornan.jpg`;
const cernyImg = `${import.meta.env.BASE_URL}/assets/cerny.jpg`;

// --- DATA SOURCE & HELPERS ---

interface Owner {
    username: string;
    handle: string;
    roles: RoleIdentity[];
    avatar: string;
}

const owners: Owner[] = [
  {
      username: "YUTA-Cardano/CPA(DMは全て詐欺)",
      handle: "$yuta",
      roles: [
          { type: "DRep", id: "drep1y2200we9c904un36tzaearntzzl63snffuul9qsk0te4utqfkke0w" },
          { type: "SPO", id: "pool1vxz0deezj5c2950e7arpzfqxzq8zd9kawsullrzjw5rsq0yhxgr" }
      ],
      avatar: yutaImg
  },
  {
      username: "Peter Bui",
      handle: "$pete",
      roles: [
          { type: "DRep", id: "drep1yftc8zs7gjcj4a9nxzplz4wg6cwweya0kxp8adnw59vsyrqvrysud" },
          { type: "SPO", id: "pool1vev8z03vh7jwx3mfrgzrt9fltt97nupaxv8ffj4r5r8mgwts5ze" }
      ],
      avatar: peteImg
  },
  {
      username: "Linda - Cryptofly",
      handle: "$cryptofly",
      roles: [
          { type: "DRep", id: "drep1yfu5d42qfu7e3euu4kkamcg3g3z2zn6sd674gkdww8ey63stlsrlt" },
          { type: "SPO", id: "pool18zf8txwv8lmtpq2src8wrhz0pjut5qft8h5tfxnctwc95r7jvvj" }
      ],
      avatar: lindaImg
  },
  {
      username: "Peyton",
      handle: "$bigpey",
      roles: [
          { type: "DRep", id: "drep1y20fpc0f6qjl4edtl9cxzrvqzd8jkzr6ja7p0p2n7cxragqkurae3" },
          { type: "SPO", id: "pool13crd2ljx87988umk22er6ynwadfwdqupdpcq6prc6v59z62kxse" }
      ],
      avatar: peytonImg
  },
  {
      username: "Phil",
      handle: "$plutuspioneer",
      roles: [
          { type: "DRep", id: "drep1yg343cyuckglj48a6gpcey7fkfcy5x5f9g65wme3ne9q2mgaedmkm" },
          { type: "CC", id: "keyHash-732010e59095172a0d98f7d6944724bed4920b3f5eec936ec9fc7f" },
      ],
      avatar: philImg
  },
  {
      username: "KtorZ",
      handle: "$ktorz",
      roles: [
          { type: "DRep", id: "drep1yg343cyuckglj48a6gpcey7fkfcy5x5f9g65wme3ne9q2mgaedmkm" },
          { type: "CC", id: "keyHash-9f3a6d2c4b8e1a7d5f0c92e4a6b1d8f7c3e5a9b0d4f6c8a2" }
      ],
      avatar: ktorzImg
  },
  {
      username: "Bee",
      handle: "$BeatriceAnihiri",
      roles: [
          { type: "DRep", id: "drep1yg343cyuckglj48a6gpcey7fkfcy5x5f9g65wme3ne9q2mgaedmkm" },
      ],
      avatar: beeImg
  },
  {
      username: "Mike Hornan",
      handle: "$hornan",
      roles: [
          { type: "SPO", id: "pool1mt8sdg37f2h3rypyuc77k7vxrjshtvjw04zdjlae9vdzyt9uu34" },
          { type: "CC", id: "keyHash-9f3a6d2c4b8e1a7d5f0c92e4a6b1d8f7c3e5a9b0d4f6c8a2" },
      ],
      avatar: hornanImg
  },
  {
      username: "Nicolas Cerny",
      handle: "$NicolasC3rny",
      roles: [
          { type: "DRep", id: "drep1yttcav7gh3xlkqd876gmgma32c7qj555ajnn3fnp9kl6l4g97vcyz" },
          { type: "CC", id: "keyHash-9f3a6d2c4b8e1a7d5f0c92e4a6b1d8f7c3e5a9b0d4f6c8a2" },
      ],
      avatar: cernyImg
  },
];

const getOwner = (usernameSubstr: string): Owner => {
    return owners.find(o => o.username.includes(usernameSubstr)) || owners[0];
};

// --- OPINION DATA ---

export const opinionData: Opinion[] = [
  {
    id: "op-201",
    owner: getOwner("YUTA"),
    intent: "The current economic parameters of the Cardano protocol are outdated and no longer serve the best interests of the single pool operators who form the backbone of our decentralization. My proposal seeks to drastically reduce the minimum fixed fee to allow smaller pools to compete fairly against multi-pool aggregators. Furthermore, we must acknowledge that Cardano is a global protocol. The constitution currently defaults to English, which creates a barrier to entry for the vibrant communities in Japan and Latin America. We must mandate that all 'Info' actions and constitution ratifications be professionally translated before voting begins. This is not just about fairness; it is about the security derived from a truly distributed and diverse consensus set. We need to act now before the small pools vanish completely from the ecosystem map.",
    createdDate: "05 Dec 2025 - Epoch 592",
    createdTimestamp: 1764950000000,
    updatedDate: "07 Dec 2025 - Epoch 592",
    updatedTimestamp: 1765120000000,
    status: "Live",
    events: [
      {
        id: "evt-201-a",
        subject: "SPO Economics & Japan Community Townhall",
        description: "Discussing the K-parameter changes and the impact of the minimum fixed fee on Japanese SPOs.",
        startDate: "10 Dec 2025 | 13:00 UTC",
        duration: "1h 30m",
        status: "Finished",
        socialMedia: "x",
        link: "https://twitter.com/i/spaces/yuta_space",
        hosts: [
          { ...getOwner("YUTA"), duty: "Host" },
          { ...getOwner("Bee"), duty: "Co-Host" },
          { ...getOwner("Nicolas"), duty: "Speaker" }
        ]
      },
      {
        id: "evt-201-b",
        subject: "Localization Standards Workshop",
        description: "Drafting the appendix for mandatory translation of governance actions.",
        startDate: "12 Dec 2025 | 09:00 UTC",
        duration: "2h 00m",
        status: "Live Now",
        socialMedia: "discord",
        link: "https://discord.gg/cardano-japan",
        hosts: [
          { ...getOwner("YUTA"), duty: "Host" },
          { ...getOwner("Peter"), duty: "Speaker" }
        ]
      }
    ],
    ruleAmendments: [
      {
        actionType: "Edit",
        reason: "Swapping order to emphasize fairness over efficiency.",
        baseRule: { id: 5, constitutionContentId: 6, content: "Contributions by the Cardano Community on the Cardano Blockchain shall be recognized, recorded and assessed fairly through reward sharing with SPOs, potential compensation to DReps and CC members, and appropriate tokenomics.", order: 1 },
        revisedRule: { id: 5, constitutionContentId: 6, content: "Contributions shall be assessed fairly, with specific economic protections (min fee reduction) enacted to preserve the viability of Single Pool Operators.", order: 2 },
        path: "ARTICLE I > Section 1 > Tenet 3"
      },
      {
        actionType: "Edit",
        reason: "Swapping Tenet 4 to position 1 for priority.",
        baseRule: { id: 6, constitutionContentId: 7, content: "The Cardano Blockchain shall not lock in an ada owner's value or data without the owner's consent.", order: 2 }, 
        revisedRule: { id: 6, constitutionContentId: 7, content: "User sovereignty is paramount. The Blockchain shall never lock value without explicit, signed consent from the owner.", order: 1 },
        path: "ARTICLE I > Section 1 > Tenet 4"
      },
      {
        actionType: "Edit",
        reason: "Mandating multi-language support and reordering.",
        baseRule: { id: 10, constitutionContentId: 11, content: "All users of the Cardano Blockchain shall be treated fairly...", order: 1 },
        revisedRule: { id: 10, constitutionContentId: 11, content: "All users shall be treated fairly. Access to governance documents in major global languages is a fundamental right.", order: 2 },
        path: "ARTICLE I > Section 1 > Tenet 8"
      },
      {
        actionType: "Edit",
        reason: "Swapping Tenet 9 to order 1.",
        baseRule: { id: 11, constitutionContentId: 12, content: "Financial stability shall be maintained...", order: 2 },
        revisedRule: { id: 11, constitutionContentId: 12, content: "Financial stability is the bedrock. Total supply is capped at 45B ADA.", order: 1 },
        path: "ARTICLE I > Section 1 > Tenet 9"
      },
      {
        actionType: "Add",
        reason: "Adding explicit parameter limits.",
        baseRule: undefined,
        revisedRule: { id: 101, constitutionContentId: 41, content: "The min_pool_cost parameter shall not exceed 170 ADA to ensure competitiveness of small pools.", order: 3 },
        path: "ARTICLE VI > Section 1"
      },
      {
        actionType: "Remove",
        reason: "Removing vague interoperability clause.",
        baseRule: { id: 7, constitutionContentId: 8, content: "The Cardano Blockchain shall not unreasonably impede interoperability.", order: 1 },
        revisedRule: undefined,
        path: "ARTICLE I > Section 1 > Tenet 5"
      },
      {
        actionType: "Add",
        reason: "New rule on translation funding.",
        baseRule: undefined,
        revisedRule: { id: 102, constitutionContentId: 28, content: "A specific budget allocation for translation services is mandatory for all governance epochs.", order: 2 },
        path: "ARTICLE IV > Section 1"
      }
    ],
    constitutionContentAmendments: [
      {
        actionType: "Edit",
        reason: "Renaming Article VI and changing type to Appendix.",
        baseContent: { id: 40, title: "ARTICLE VI. STAKE POOL OPERATORS", type: "Article", order: 6, children: [] },
        revisedContent: { id: 40, title: "APPENDIX: SPO & GLOBAL INCLUSION", type: "appendix", order: 5, children: [] },
        parentId: undefined
      },
      {
        actionType: "Edit",
        reason: "Swapping Article V down to order 6.",
        baseContent: { id: 33, title: "ARTICLE V. DELEGATED REPRESENTATIVES", type: "Article", order: 5, children: [] },
        revisedContent: { id: 33, title: "ARTICLE V. DELEGATED REPRESENTATIVES", type: "Article", order: 6, children: [] },
        parentId: undefined
      },
      {
        actionType: "Add",
        reason: "Adding Localization Appendix.",
        baseContent: undefined,
        revisedContent: { id: 201, title: "Appendix: Localization Standards", type: "appendix", order: 10, children: [] },
        parentId: undefined
      }
    ],
    comments: [
        { id: 1, owner: getOwner("Bee"), text: "This is exactly what we need. The fee structure has been crushing small pools for years. I particularly support \\a 5 regarding the fixed 170 ADA limit.", likes: ["u1", "u2", "u3"], dislikes: [], favorites: ["u1"], replyTo: null },
        { id: 2, owner: getOwner("Nicolas"), text: "I agree with the sentiment, but is hardcoding 170 ADA in the constitution wise? Refer to \\c 2.3 Article V, we usually leave specific params to the guardrails.", likes: ["u4"], dislikes: [], favorites: [], replyTo: 1 },
        { id: 3, owner: getOwner("YUTA"), text: "It is necessary because the guardrails have been ignored too often. We need constitutional protection for small operators.", likes: ["u6"], dislikes: [], favorites: ["u6"], replyTo: 2 },
        { id: 4, owner: getOwner("Phil"), text: "The translation mandate in \\a 3 is excellent. Educational content needs this too.", likes: ["u10"], dislikes: [], favorites: [], replyTo: null },
        { id: 5, owner: getOwner("Linda"), text: "Totally agree Phil. We are missing out on so much LATAM participation.", likes: ["u12"], dislikes: [], favorites: [], replyTo: 4 },
        { id: 6, owner: getOwner("KtorZ"), text: "Make sure the translation verification process doesn't slow down emergency hotfixes.", likes: ["u13"], dislikes: [], favorites: [], replyTo: 4 },
        { id: 7, owner: getOwner("Mike"), text: "Does this affect existing pools immediately or after the next hard fork?", likes: ["u16"], dislikes: [], favorites: [], replyTo: 1 },
        { id: 8, owner: getOwner("Peter"), text: "Great initiative Yuta san.", likes: ["u17"], dislikes: [], favorites: [], replyTo: null }
    ]
  },
  {
    id: "op-202",
    owner: getOwner("Peter"),
    intent: "Governance Accessibility is a critical failure point. The current governance tools are desktop-centric and alienate 60% of global users who rely on mobile. I propose an amendment to Article III mandating that all voting interfaces must meet WCAG 2.1 AA standards and support mobile-native wallets. Additionally, the registration process for DReps is overly complex; we must simplify the on-chain metadata requirements to encourage broader participation from non-technical community leaders. Complexity is a form of centralization.",
    createdDate: "20 Dec 2025 - Epoch 593",
    createdTimestamp: 1766150000000,
    updatedDate: "21 Dec 2025 - Epoch 593",
    updatedTimestamp: 1766230000000,
    status: "Voting",
    events: [
        {
            id: "evt-206-a",
            subject: "Mobile Governance Hackathon",
            description: "Building the next generation of mobile-first voting interfaces for Cardano.",
            startDate: "05 Jan 2026 | 10:00 UTC",
            duration: "48h 00m",
            status: "Waiting",
            socialMedia: "discord",
            link: "https://discord.gg/cardano-mobile",
            hosts: [
                { ...getOwner("Peter"), duty: "Host" },
                { ...getOwner("KtorZ"), duty: "Speaker" }
            ]
        }
    ],
    ruleAmendments: [
        {
            actionType: "Edit",
            reason: "Mandating accessibility standards and reordering.",
            baseRule: { id: 26, constitutionContentId: 25, content: "All owners of ada shall have the right to ensure that the process for participating...", order: 4 },
            revisedRule: { id: 26, constitutionContentId: 25, content: "Participation tools must be open, transparent, and meet WCAG 2.1 AA accessibility standards to ensure inclusivity for all ADA owners.", order: 1 },
            path: "ARTICLE III > Section 5"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 23 to order 4.",
            baseRule: { id: 23, constitutionContentId: 25, content: "In order to promote transparency...", order: 1 },
            revisedRule: { id: 23, constitutionContentId: 25, content: "Transparency is key. All governance actions must follow a standardized format including URL and hash.", order: 4 },
            path: "ARTICLE III > Section 5"
        },
        {
            actionType: "Edit",
            reason: "Simplifying DRep registration and reordering.",
            baseRule: { id: 36, constitutionContentId: 36, content: "DReps who are representing delegators are expected to periodically adopt...", order: 1 },
            revisedRule: { id: 36, constitutionContentId: 36, content: "DRep registration metadata shall be minimal. Elaborate profiles are optional to reduce barriers to entry.", order: 2 },
            path: "ARTICLE V > Section 3"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 37 to order 1.",
            baseRule: { id: 37, constitutionContentId: 36, content: "The Cardano Community is expected to support...", order: 2 }, // Assumed order logic from sibling
            revisedRule: { id: 37, constitutionContentId: 36, content: "Community tools must enable ADA owners to explore DRep candidates effortlessly.", order: 1 },
            path: "ARTICLE V > Section 3"
        },
        {
            actionType: "Add",
            reason: "Mobile support mandate.",
            baseRule: undefined,
            revisedRule: { id: 601, constitutionContentId: 59, content: "All treasury-funded governance frontends must support mobile-native wallet connectors.", order: 1 },
            path: "ARTICLE IX"
        },
        {
            actionType: "Remove",
            reason: "Removing legacy desktop assumption.",
            baseRule: { id: 4, constitutionContentId: 5, content: "Anyone desiring to develop and deploy applications on the Cardano Blockchain shall not unreasonably be prevented...", order: 1 },
            revisedRule: undefined,
            path: "ARTICLE I > Section 1 > Tenet 2"
        },
        {
            actionType: "Add",
            reason: "Low bandwidth support.",
            baseRule: undefined,
            revisedRule: { id: 604, constitutionContentId: 5, content: "Interfaces must support low-bandwidth modes for developing regions.", order: 3 },
            path: "ARTICLE I > Section 1 > Tenet 2"
        },
        {
            actionType: "Edit",
            reason: "Swapping Tenet 3 to Order 4.",
            baseRule: { id: 5, constitutionContentId: 6, content: "Contributions by the Cardano Community...", order: 3 },
            revisedRule: { id: 5, constitutionContentId: 6, content: "Contributions should be recognized fairly.", order: 4 },
            path: "ARTICLE I > Section 1 > Tenet 3"
        },
        {
            actionType: "Edit",
            reason: "Swapping Tenet 4 to Order 3.",
            baseRule: { id: 6, constitutionContentId: 7, content: "The Cardano Blockchain shall not lock...", order: 4 },
            revisedRule: { id: 6, constitutionContentId: 7, content: "User value must not be locked without consent.", order: 3 },
            path: "ARTICLE I > Section 1 > Tenet 4"
        },
        {
            actionType: "Add",
            reason: "User Experience Tenet.",
            baseRule: undefined,
            revisedRule: { id: 602, constitutionContentId: 5, content: "User Experience (UX) is a core value. Complexity shall not be a barrier to governance.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 2"
        }
    ],
    constitutionContentAmendments: [
        {
            actionType: "Edit",
            reason: "Renaming Section 5 to emphasize Access and changing type to Tenet.",
            baseContent: { id: 25, title: "Section 5", type: "Section", order: 5, children: [] },
            revisedContent: { id: 25, title: "Tenet: Universal Access", type: "Tenet", order: 6, children: [] },
            parentId: 20
        },
        {
            actionType: "Edit",
            reason: "Swapping Section 6 to order 5.",
            baseContent: { id: 26, title: "Section 6", type: "Section", order: 6, children: [] },
            revisedContent: { id: 26, title: "Section 6", type: "Section", order: 5, children: [] },
            parentId: 20
        },
        {
            actionType: "Add",
            reason: "Adding UX Appendix.",
            baseContent: undefined,
            revisedContent: { id: 301, title: "Appendix: UX Guidelines", type: "appendix", order: 11, children: [] },
            parentId: undefined
        }
    ],
    comments: [
        { id: 9, owner: getOwner("KtorZ"), text: "Accessibility is often overlooked. I support \\a 1 fully. WCAG standards are a must for government-grade software.", likes: ["u200", "u201"], dislikes: [], favorites: ["u200"], replyTo: null },
        { id: 10, owner: getOwner("Peter"), text: "Thanks KtorZ. We need to make sure the CIPs reflect this too.", likes: ["u202"], dislikes: [], favorites: [], replyTo: 9 },
        { id: 11, owner: getOwner("Phil"), text: "Simplifying DRep registration in \\a 3 is risky. We need MORE info on DReps, not less, to make informed votes.", likes: ["u203", "u204"], dislikes: ["u205"], favorites: [], replyTo: null },
        { id: 12, owner: getOwner("Bee"), text: "I agree with Phil. Maybe make the UI better, but don't reduce the data requirements.", likes: ["u206"], dislikes: [], favorites: [], replyTo: 11 },
        { id: 13, owner: getOwner("YUTA"), text: "Japanese mobile users find the current tools impossible. \\c 2.3 Article III Section 5 needs this update.", likes: ["u207"], dislikes: [], favorites: ["u207"], replyTo: null },
        { id: 14, owner: getOwner("Mike"), text: "Does 'mobile-native wallet connectors' in \\a 5 imply a specific standard like WalletConnect?", likes: ["u210"], dislikes: [], favorites: [], replyTo: null },
        { id: 15, owner: getOwner("Peter"), text: "Yes, or CIP-30/CIP-95 extensions for mobile.", likes: ["u211"], dislikes: [], favorites: [], replyTo: 14 }
    ]
  },
  {
    id: "op-203",
    owner: getOwner("Linda"),
    intent: "Decentralization is slipping away. Large multi-pool operators and centralized exchanges are capturing too much voting power. My proposal is to implement a 'Quadratic Voting' mechanism for DReps to dilute the power of whales. Additionally, we need to enshrine the right to privacy and permissionless participation. No identity verification should ever be required to run a node or vote. The constitution must explicitly forbid KYC checks at the protocol layer.",
    createdDate: "10 Nov 2025 - Epoch 594",
    createdTimestamp: 1762700000000,
    updatedDate: "12 Nov 2025 - Epoch 594",
    updatedTimestamp: 1762870000000,
    status: "Ratified",
    events: [
        {
            id: "evt-205-a",
            subject: "Quadratic Voting Explained",
            description: "A workshop on how QV protects minority voices in governance.",
            startDate: "20 Nov 2025 | 17:00 UTC",
            duration: "1h 30m",
            status: "Finished",
            socialMedia: "x",
            link: "https://twitter.com/i/spaces/qv_workshop",
            hosts: [
                { ...getOwner("Linda"), duty: "Host" },
                { ...getOwner("Nicolas"), duty: "Co-Host" }
            ]
        },
        {
            id: "evt-205-b",
            subject: "Privacy Rights Panel",
            description: "Why KYC at the protocol layer is dangerous.",
            startDate: "22 Nov 2025 | 19:00 UTC",
            duration: "1h 00m",
            status: "Canceled",
            socialMedia: "youtube",
            link: "https://youtube.com/cryptofly",
            hosts: [
                { ...getOwner("Linda"), duty: "Host" },
                { ...getOwner("Bee"), duty: "Speaker" }
            ]
        }
    ],
    ruleAmendments: [
        {
            actionType: "Edit",
            reason: "Implementing Quadratic Voting and reordering.",
            baseRule: { id: 34, constitutionContentId: 35, content: "Any owner of ada shall have the option to register as a DRep...", order: 1 },
            revisedRule: { id: 34, constitutionContentId: 35, content: "DRep voting power shall be calculated using a Quadratic Voting formula to prevent whale dominance.", order: 2 },
            path: "ARTICLE V > Section 2"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 35 to Order 1.",
            baseRule: { id: 35, constitutionContentId: 35, content: "This voting system shall enshrine a liquid democracy model...", order: 2 },
            revisedRule: { id: 35, constitutionContentId: 35, content: "Liquid democracy is the standard. Owners can delegate or withdraw at any time.", order: 1 },
            path: "ARTICLE V > Section 2"
        },
        {
            actionType: "Add",
            reason: "Anti-Censorship / No KYC.",
            baseRule: undefined,
            revisedRule: { id: 501, constitutionContentId: 16, content: "Protocol participation is permissionless. No identity verification (KYC) shall ever be required by the protocol.", order: 2 },
            path: "ARTICLE II > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Privacy rights reordered.",
            baseRule: { id: 6, constitutionContentId: 7, content: "The Cardano Blockchain shall not lock in an ada owner's value or data without the owner's consent.", order: 1 },
            revisedRule: { id: 6, constitutionContentId: 7, content: "The Blockchain shall protect user privacy. Data harvesting is prohibited at the protocol level.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 4"
        },
        {
            actionType: "Add",
            reason: "Adding Privacy Tenet.",
            baseRule: undefined,
            revisedRule: { id: 502, constitutionContentId: 10, content: "Privacy is a human right. Transaction metadata should be encrypted by default where possible.", order: 2 },
            path: "ARTICLE I > Section 1 > Tenet 7"
        },
        {
            actionType: "Edit",
            reason: "Protecting node operators reordering.",
            baseRule: { id: 4, constitutionContentId: 5, content: "Anyone desiring to develop and deploy applications...", order: 1 },
            revisedRule: { id: 4, constitutionContentId: 5, content: "Running a node is a right. No license or permission is required.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 2"
        },
        {
            actionType: "Remove",
            reason: "Removing DRep compensation potential to prevent career politicians.",
            baseRule: { id: 38, constitutionContentId: 38, content: "DReps who are representing delegators may be compensated for their efforts...", order: 1 },
            revisedRule: undefined,
            path: "ARTICLE V > Section 5"
        },
        {
            actionType: "Add",
            reason: "Adding term limits for DReps.",
            baseRule: undefined,
            revisedRule: { id: 503, constitutionContentId: 36, content: "DReps shall serve a maximum of 2 consecutive terms if elected to committees.", order: 2 },
            path: "ARTICLE V > Section 3"
        }
    ],
    constitutionContentAmendments: [
        {
            actionType: "Edit",
            reason: "Renaming Article II and changing order.",
            baseContent: { id: 15, title: "ARTICLE II. THE CARDANO COMMUNITY", type: "Article", order: 2, children: [] },
            revisedContent: { id: 15, title: "ARTICLE II. PERMISSIONLESS COMMUNITY", type: "Article", order: 3, children: [] },
            parentId: undefined
        },
        {
            actionType: "Edit",
            reason: "Swapping Article III to order 2.",
            baseContent: { id: 20, title: "ARTICLE III. PARTICIPATORY AND DECENTRALIZED GOVERNANCE", type: "Article", order: 3, children: [] },
            revisedContent: { id: 20, title: "ARTICLE III. PARTICIPATORY AND DECENTRALIZED GOVERNANCE", type: "Article", order: 2, children: [] },
            parentId: undefined
        },
        {
            actionType: "Edit",
            reason: "Changing Section 1 type to Tenet.",
            baseContent: { id: 16, title: "Section 1", type: "Section", order: 1, children: [] },
            revisedContent: { id: 16, title: "Tenet: Permissionless Access", type: "Tenet", order: 1, children: [] },
            parentId: 15
        }
    ],
    comments: [
        { id: 16, owner: getOwner("Peter"), text: "QV is interesting but hard to implement on-chain without identity. How do we prevent splitting wallets?", likes: ["u100"], dislikes: [], favorites: [], replyTo: null },
        { id: 17, owner: getOwner("Linda"), text: "We can use DID (Decentralized ID) proofs, but it must be optional. See \\a 1 logic.", likes: ["u102"], dislikes: [], favorites: [], replyTo: 16 },
        { id: 18, owner: getOwner("Bee"), text: "I strongly support the No KYC clause in \\a 3. Governments are cracking down.", likes: ["u103"], dislikes: [], favorites: ["u103"], replyTo: null },
        { id: 19, owner: getOwner("YUTA"), text: "Privacy is key for safety in some regions. Agreed.", likes: ["u106"], dislikes: [], favorites: [], replyTo: 18 },
        { id: 20, owner: getOwner("Mike"), text: "Removing DRep compensation in \\a 7 is a mistake. Only the rich will afford to be DReps.", likes: ["u107"], dislikes: ["u109"], favorites: [], replyTo: null },
        { id: 21, owner: getOwner("Peyton"), text: "Agreed Mike. Professional governance requires pay.", likes: ["u110"], dislikes: [], favorites: [], replyTo: 21 },
        { id: 22, owner: getOwner("Linda"), text: "It prevents corruption. We should pay for tasks, not for voting.", likes: ["u111"], dislikes: ["u112"], favorites: [], replyTo: 21 },
        { id: 23, owner: getOwner("Nicolas"), text: "Term limits in \\a 8 are good.", likes: ["u113"], dislikes: [], favorites: [], replyTo: null },
        { id: 24, owner: getOwner("Phil"), text: "ZK proofs are computationally heavy. Will this slow down the chain? Ref \\c 2.3 Article I Tenet 2", likes: ["u114"], dislikes: [], favorites: [], replyTo: null }
    ]
  },
  {
    id: "op-204",
    owner: getOwner("Peyton"),
    intent: "Cardano has the best tech, but we are losing the narrative war. We need to weaponize our treasury for user acquisition, not just maintenance. My proposal involves a radical restructuring of Article IV to allow for 'Strategic Growth Allocations'. This would permit the treasury to fund large-scale partnerships, CEX listings for native tokens, and liquidity incentives for DeFi protocols. We cannot sit on a pile of ADA while liquidity drains to other chains. We need to be aggressive, commercial, and growth-oriented to survive the next cycle.",
    createdDate: "28 Nov 2025 - Epoch 594",
    createdTimestamp: 1764340000000,
    updatedDate: "01 Dec 2025 - Epoch 594",
    updatedTimestamp: 1764600000000,
    status: "Voting",
    events: [
        {
            id: "evt-203-a",
            subject: "Treasury for Growth Strategy Session",
            description: "How to use the treasury to boost DeFi TVL and acquire users.",
            startDate: "18 Dec 2025 | 18:00 UTC",
            duration: "1h 00m",
            status: "Waiting",
            socialMedia: "youtube",
            link: "https://youtube.com/bigpey",
            hosts: [
                { ...getOwner("Peyton"), duty: "Host" },
                { ...getOwner("Linda"), duty: "Speaker" }
            ]
        },
        {
            id: "evt-203-b",
            subject: "DeFi Liquidity Incentives AMA",
            description: "Answering questions about the risks and rewards of liquidity mining funded by treasury.",
            startDate: "20 Dec 2025 | 15:00 UTC",
            duration: "1h 30m",
            status: "Live Now",
            socialMedia: "x",
            link: "https://twitter.com/i/spaces/growth_ama",
            hosts: [
                { ...getOwner("Peyton"), duty: "Host" },
                { ...getOwner("Peter"), duty: "Co-Host" }
            ]
        }
    ],
    ruleAmendments: [
        {
            actionType: "Edit",
            reason: "Authorizing growth spend and reordering.",
            baseRule: { id: 30, constitutionContentId: 30, content: "Withdrawals from the Cardano Blockchain treasury that would cause the Cardano Blockchain treasury balance to violate...", order: 1 },
            revisedRule: { id: 30, constitutionContentId: 30, content: "Withdrawals are permitted for Strategic Growth Allocations (User Acquisition, Liquidity Incentives) provided they do not exceed 20% of reserves.", order: 2 },
            path: "ARTICLE IV > Section 3"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 30 sibling placeholder.",
            baseRule: { id: 30, constitutionContentId: 30, content: "Withdrawals are permitted for Strategic Growth Allocations...", order: 1 }, // Virtual swap
            revisedRule: { id: 30, constitutionContentId: 30, content: "Standard withdrawals must preserve solvency.", order: 1 },
            path: "ARTICLE IV > Section 3"
        },
        {
            actionType: "Add",
            reason: "Creating a Marketing committee.",
            baseRule: undefined,
            revisedRule: { id: 301, constitutionContentId: 29, content: "A specialized Marketing Committee shall oversee allocations for brand awareness and partnerships.", order: 2 },
            path: "ARTICLE IV > Section 2"
        },
        {
            actionType: "Edit",
            reason: "Relaxing resource spend for growth.",
            baseRule: { id: 9, constitutionContentId: 10, content: "The Cardano Blockchain shall not unreasonably spend resources.", order: 1 },
            revisedRule: { id: 9, constitutionContentId: 10, content: "Resource spending shall be calibrated against expected user growth and network value accrual.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 7"
        },
        {
            actionType: "Edit",
            reason: "Swapping order of budget rules.",
            baseRule: { id: 28, constitutionContentId: 28, content: "Any participant in the Cardano Community may propose a Cardano Blockchain ecosystem budget...", order: 1 },
            revisedRule: { id: 28, constitutionContentId: 28, content: "Any participant in the Cardano Community may propose a Cardano Blockchain ecosystem budget...", order: 2 },
            path: "ARTICLE IV > Section 1"
        },
        {
            actionType: "Add",
            reason: "Prioritizing commercial budgets.",
            baseRule: undefined,
            revisedRule: { id: 302, constitutionContentId: 28, content: "Budgets with clear ROI (Return on Investment) metrics shall be fast-tracked for voting.", order: 1 },
            path: "ARTICLE IV > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Defining 'Beneficiary' to include partners.",
            baseRule: { id: 15, constitutionContentId: 16, content: "No formal membership shall be required to use, participate in and benefit...", order: 1 },
            revisedRule: { id: 15, constitutionContentId: 16, content: "Strategic partners and liquidity providers are recognized as key beneficiaries entitled to incentives.", order: 1 },
            path: "ARTICLE II > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Interoperability means bridges (Reordering).",
            baseRule: { id: 7, constitutionContentId: 8, content: "The Cardano Blockchain shall not unreasonably impede interoperability.", order: 1 },
            revisedRule: { id: 7, constitutionContentId: 8, content: "The Blockchain shall actively fund secure bridges to liquidity hubs to foster interoperability.", order: 2 },
            path: "ARTICLE I > Section 1 > Tenet 5"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 7 Sibling.",
            baseRule: { id: 8, constitutionContentId: 9, content: "The Cardano Blockchain shall preserve in a safe manner...", order: 2 }, // Assumed swap context
            revisedRule: { id: 8, constitutionContentId: 9, content: "Safety of value is paramount.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 6"
        },
        {
            actionType: "Add",
            reason: "Adding Growth Tenet.",
            baseRule: undefined,
            revisedRule: { id: 305, constitutionContentId: 6, content: "Sustainable growth and user acquisition is a core tenet of the ecosystem survival.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 3"
        }
    ],
    constitutionContentAmendments: [
        {
            actionType: "Edit",
            reason: "Renaming Article IV and changing order.",
            baseContent: { id: 27, title: "ARTICLE IV. THE CARDANO BLOCKCHAIN ECOSYSTEM BUDGET & TREASURY", type: "Article", order: 4, children: [] },
            revisedContent: { id: 27, title: "ARTICLE IV. TREASURY & GROWTH STRATEGY", type: "Article", order: 3, children: [] },
            parentId: undefined
        },
        {
            actionType: "Edit",
            reason: "Swapping Article III down to order 4.",
            baseContent: { id: 20, title: "ARTICLE III. PARTICIPATORY AND DECENTRALIZED GOVERNANCE", type: "Article", order: 3, children: [] },
            revisedContent: { id: 20, title: "ARTICLE III. PARTICIPATORY AND DECENTRALIZED GOVERNANCE", type: "Article", order: 4, children: [] },
            parentId: undefined
        },
        {
            actionType: "Edit",
            reason: "Changing Section 1 type to Tenet.",
            baseContent: { id: 28, title: "Section 1", type: "Section", order: 1, children: [] },
            revisedContent: { id: 28, title: "Tenet: Growth Mandate", type: "Tenet", order: 1, children: [] },
            parentId: 27
        }
    ],
    comments: [
        { id: 25, owner: getOwner("Linda"), text: "We need to be careful. Treasury drains for 'marketing' often end up in waste. I worry about \\a 1 relaxing the reserves.", likes: ["u50"], dislikes: ["u53"], favorites: [], replyTo: null },
        { id: 26, owner: getOwner("Peyton"), text: "The risk of doing nothing is higher. We are ghost chains if we don't get users. Refer to \\c 2.3 preamble.", likes: ["u54"], dislikes: [], favorites: ["u54"], replyTo: 25 },
        { id: 27, owner: getOwner("Peter"), text: "I support the ROI requirement in \\a 6. Accountability is key.", likes: ["u57"], dislikes: [], favorites: [], replyTo: null },
        { id: 28, owner: getOwner("Bee"), text: "Bridges are dangerous. Do we really want to fund them directly?", likes: ["u59"], dislikes: ["u60"], favorites: [], replyTo: null },
        { id: 29, owner: getOwner("KtorZ"), text: "Only if they are trustless. We shouldn't fund multisigs.", likes: ["u62"], dislikes: [], favorites: [], replyTo: 28 },
        { id: 30, owner: getOwner("Mike"), text: "What happens if the marketing committee fails their KPIs?", likes: ["u64"], dislikes: [], favorites: [], replyTo: null },
        { id: 31, owner: getOwner("Peyton"), text: "They get dissolved and funding stops.", likes: ["u65"], dislikes: [], favorites: [], replyTo: 30 },
        { id: 32, owner: getOwner("YUTA"), text: "Japan needs specific marketing budget too.", likes: ["u66"], dislikes: [], favorites: [], replyTo: null }
    ]
  },
  {
    id: "op-205",
    owner: getOwner("Phil"),
    intent: "Security and education are the bedrock of Cardano. We cannot allow the treasury to become a slush fund for unverified projects. My proposal enforces a strict 'Audit First' policy. Any project requesting over 100k ADA must have a completed third-party security audit before the governance vote can proceed. Furthermore, I am introducing a Constitutional requirement that 5% of all treasury outflows be directed specifically towards developer education and academic research to ensure the long-term maintainability of the protocol.",
    createdDate: "15 Nov 2025 - Epoch 597",
    createdTimestamp: 1763200000000,
    updatedDate: "15 Nov 2025 - Epoch 597",
    updatedTimestamp: 1763200000000,
    status: "Draft",
    events: [], // 0 events as requested
    ruleAmendments: [
        {
            actionType: "Edit",
            reason: "Strict audit requirements reordered.",
            baseRule: { id: 31, constitutionContentId: 31, content: "Any governance action requesting ada from the Cardano Blockchain treasury shall require an allocation of ada...", order: 1 },
            revisedRule: { id: 31, constitutionContentId: 31, content: "Requests >100k ADA MUST include a completed third-party security audit. No exceptions.", order: 2 },
            path: "ARTICLE IV > Section 4"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 31 Sibling.",
            baseRule: { id: 32, constitutionContentId: 32, content: "Any ada received from a Cardano Blockchain treasury withdrawal...", order: 2 },
            revisedRule: { id: 32, constitutionContentId: 32, content: "Audited funds must be held in segregated accounts.", order: 1 },
            path: "ARTICLE IV > Section 5"
        },
        {
            actionType: "Add",
            reason: "Education mandate.",
            baseRule: undefined,
            revisedRule: { id: 401, constitutionContentId: 28, content: "5% of all treasury epochs shall be allocated to the 'Education & Research' bucket.", order: 2 },
            path: "ARTICLE IV > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Ensuring CC expertise reordered.",
            baseRule: { id: 44, constitutionContentId: 46, content: "Constitutional Committee members are expected to have appropriate expertise...", order: 1 },
            revisedRule: { id: 44, constitutionContentId: 46, content: "CC Members must pass a cryptographic competency verification or have a proven track record in protocol development.", order: 2 },
            path: "ARTICLE VII > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 44 Sibling (Placeholder logic).",
            baseRule: { id: 44, constitutionContentId: 46, content: "CC Members must pass a cryptographic competency verification...", order: 2 }, // Assumed swap context
            revisedRule: { id: 44, constitutionContentId: 46, content: "CC members serve the chain integrity.", order: 1 },
            path: "ARTICLE VII > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Swapping order of CC rules.",
            baseRule: { id: 45, constitutionContentId: 47, content: "The Constitutional Committee shall be composed of such number of members...", order: 1 },
            revisedRule: { id: 45, constitutionContentId: 47, content: "The Constitutional Committee shall be composed of such number of members...", order: 2 },
            path: "ARTICLE VII > Section 2"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 46 to Order 1.",
            baseRule: { id: 46, constitutionContentId: 47, content: "Members of the Constitutional Committee shall serve such term lengths...", order: 2 },
            revisedRule: { id: 46, constitutionContentId: 47, content: "Term lengths are determined by ADA owners.", order: 1 },
            path: "ARTICLE VII > Section 2"
        },
        {
            actionType: "Add",
            reason: "Ethics committee.",
            baseRule: undefined,
            revisedRule: { id: 402, constitutionContentId: 47, content: "An independent Ethics board shall oversee CC conflicts of interest.", order: 3 },
            path: "ARTICLE VII > Section 2"
        },
        {
            actionType: "Edit",
            reason: "Strengthening security tenet.",
            baseRule: { id: 63, constitutionContentId: 59, content: "Cardano shall maintain best-practice security standards...", order: 1 },
            revisedRule: { id: 63, constitutionContentId: 59, content: "Security is the supreme priority. Formal verification of core upgrades is mandatory.", order: 1 },
            path: "ARTICLE IX > Section 1"
        },
        {
            actionType: "Remove",
            reason: "Removing liquid democracy ambiguity.",
            baseRule: { id: 35, constitutionContentId: 35, content: "This voting system shall enshrine a liquid democracy model...", order: 2 },
            revisedRule: undefined,
            path: "ARTICLE V > Section 2"
        },
        {
            actionType: "Add",
            reason: "Academic peer review.",
            baseRule: undefined,
            revisedRule: { id: 403, constitutionContentId: 59, content: "All whitepapers for protocol upgrades must undergo academic peer review prior to implementation.", order: 3 },
            path: "ARTICLE IX > Section 1"
        }
    ],
    constitutionContentAmendments: [
        {
            actionType: "Edit",
            reason: "Renaming Article IX and reordering.",
            baseContent: { id: 59, title: "ARTICLE IX. TECHNOLOGY & SECURITY", type: "Article", order: 9, children: [] },
            revisedContent: { id: 59, title: "ARTICLE IX. SECURITY & EDUCATION", type: "Article", order: 8, children: [] },
            parentId: undefined
        },
        {
            actionType: "Edit",
            reason: "Swapping Article VIII down to order 9.",
            baseContent: { id: 55, title: "ARTICLE VIII. AMENDMENT PROCESS ", type: "Article", order: 8, children: [] },
            revisedContent: { id: 55, title: "ARTICLE VIII. AMENDMENT PROCESS ", type: "Article", order: 9, children: [] },
            parentId: undefined
        },
        {
            actionType: "Edit",
            reason: "Changing Section type to GuardRail.",
            baseContent: { id: 60, title: "Section 1 - Security and Audits", type: "Section", order: 1, children: [] },
            revisedContent: { id: 60, title: "GuardRail: Audit Requirements", type: "GuardRail", order: 1, children: [] },
            parentId: 59
        },
        {
            actionType: "Add",
            reason: "Adding Education Section.",
            baseContent: undefined,
            revisedContent: { id: 403, title: "Section 6: Education Mandate", type: "Section", order: 6, children: [] },
            parentId: 27
        }
    ],
    comments: [
        { id: 33, owner: getOwner("KtorZ"), text: "Formal verification is expensive and slow. We need to balance this, see \\c 2.3 Article I Tenet 1 regarding expediency.", likes: ["u80"], dislikes: [], favorites: ["u80"], replyTo: null },
        { id: 34, owner: getOwner("Phil"), text: "Security failures are more expensive. We cannot rush.", likes: ["u82"], dislikes: [], favorites: [], replyTo: 33 },
        { id: 35, owner: getOwner("Nicolas"), text: "I support the 5% education bucket in \\a 3. We need more Plutus devs.", likes: ["u84"], dislikes: [], favorites: [], replyTo: null },
        { id: 36, owner: getOwner("Mike"), text: "Who manages the Ethics board in \\a 8?", likes: ["u85"], dislikes: [], favorites: [], replyTo: null },
        { id: 37, owner: getOwner("Phil"), text: "It would be elected by SPOs.", likes: ["u86"], dislikes: [], favorites: [], replyTo: 36 },
        { id: 38, owner: getOwner("Linda"), text: "Removing liquid democracy in \\a 10 seems extreme. Why?", likes: ["u87"], dislikes: ["u89"], favorites: [], replyTo: null },
        { id: 39, owner: getOwner("Phil"), text: "It allows for vote buying. We need 1-person-1-vote eventually.", likes: [], dislikes: ["u90"], favorites: [], replyTo: 38 },
        { id: 40, owner: getOwner("Bee"), text: "Does the audit requirement apply to Catalyst proposals too?", likes: ["u92"], dislikes: [], favorites: [], replyTo: null },
        { id: 41, owner: getOwner("Phil"), text: "Only those requesting direct treasury withdrawals via governance actions.", likes: ["u93"], dislikes: [], favorites: [], replyTo: 40 },
        { id: 42, owner: getOwner("Peyton"), text: "This slows down marketing efforts significantly.", likes: ["u94"], dislikes: [], favorites: [], replyTo: null }
    ]
  },
  {
    id: "op-206",
    owner: getOwner("KtorZ"),
    intent: "The rapid evolution of our governance tooling has outpaced our standards. We are seeing proprietary silos emerge where open source should be the norm. My intention is to amend Article IX to strictly define 'Community Tooling'. Any software funded by the treasury must be open-sourced under permissive licenses (Apache 2.0 or MIT). Additionally, we need to formalize the CIP (Cardano Improvement Proposal) process within the constitution itself, ensuring that technical governance remains meritocratic and peer-reviewed, rather than becoming a popularity contest among DReps who may lack engineering context.",
    createdDate: "02 Dec 2025 - Epoch 596",
    createdTimestamp: 1764690000000,
    updatedDate: "03 Dec 2025 - Epoch 598",
    updatedTimestamp: 1764770000000,
    status: "Voting",
    events: [
        {
            id: "evt-202-a",
            subject: "Open Source Standards in Governance",
            description: "Deep dive into why proprietary tools undermine trustless governance.",
            startDate: "15 Dec 2025 | 16:00 UTC",
            duration: "2h 00m",
            status: "Waiting",
            socialMedia: "discord",
            link: "https://discord.gg/cardano-devs",
            hosts: [
                { ...getOwner("KtorZ"), duty: "Host" },
                { ...getOwner("Phil"), duty: "Co-Host" }
            ]
        },
        {
            id: "evt-202-b",
            subject: "CIP Process Workshop",
            description: "How to draft a successful CIP for constitutional recognition.",
            startDate: "18 Dec 2025 | 14:00 UTC",
            duration: "1h 30m",
            status: "Live Now",
            socialMedia: "youtube",
            link: "https://youtube.com/ktorz_dev",
            hosts: [
                { ...getOwner("KtorZ"), duty: "Host" }
            ]
        }
    ],
    ruleAmendments: [
        {
            actionType: "Edit",
            reason: "Mandating open source for treasury projects and reordering.",
            baseRule: { id: 31, constitutionContentId: 31, content: "Any governance action requesting ada from the Cardano Blockchain treasury shall require an allocation of ada...", order: 1 },
            revisedRule: { id: 31, constitutionContentId: 31, content: "Any governance action requesting treasury funds for software development must contractually commit to Open Source licensing (MIT/Apache 2.0).", order: 2 },
            path: "ARTICLE IV > Section 4"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 31 Sibling.",
            baseRule: { id: 31, constitutionContentId: 31, content: "Any governance action requesting treasury funds...", order: 1 }, // Virtual
            revisedRule: { id: 31, constitutionContentId: 31, content: "Audit costs must be included.", order: 1 },
            path: "ARTICLE IV > Section 4"
        },
        {
            actionType: "Add",
            reason: "Formalizing CIP process.",
            baseRule: undefined,
            revisedRule: { id: 201, constitutionContentId: 60, content: "Protocol parameter changes must be accompanied by a finalized CIP (Cardano Improvement Proposal).", order: 2 },
            path: "ARTICLE IX > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Clarifying dev rights and reordering.",
            baseRule: { id: 4, constitutionContentId: 5, content: "Anyone desiring to develop and deploy applications on the Cardano Blockchain shall not unreasonably be prevented...", order: 1 },
            revisedRule: { id: 4, constitutionContentId: 5, content: "Developers shall have guaranteed access to open APIs. No proprietary gatekeeping of core ledger data is permitted.", order: 2 },
            path: "ARTICLE I > Section 1 > Tenet 2"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 4 Sibling.",
            baseRule: { id: 4, constitutionContentId: 5, content: "Developers shall have guaranteed access...", order: 1 }, // Virtual
            revisedRule: { id: 4, constitutionContentId: 5, content: "Open development is a right.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 2"
        },
        {
            actionType: "Edit",
            reason: "Swapping order for priority.",
            baseRule: { id: 63, constitutionContentId: 59, content: "Cardano shall maintain best-practice security standards...", order: 1 },
            revisedRule: { id: 63, constitutionContentId: 59, content: "Cardano shall maintain best-practice security standards...", order: 2 },
            path: "ARTICLE IX > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 63 Sibling (Placeholder for new rule).",
            baseRule: { id: 63, constitutionContentId: 59, content: "Cardano shall maintain...", order: 2 }, // Virtual
            revisedRule: { id: 63, constitutionContentId: 59, content: "Open Source is mandatory for core infra.", order: 1 },
            path: "ARTICLE IX > Section 1"
        },
        {
            actionType: "Add",
            reason: "Adding audit requirement for closed source components.",
            baseRule: undefined,
            revisedRule: { id: 202, constitutionContentId: 59, content: "Legacy closed-source components must undergo quarterly independent security audits published on-chain.", order: 3 },
            path: "ARTICLE IX > Section 1"
        },
        {
            actionType: "Remove",
            reason: "Redundant rule.",
            baseRule: { id: 26, constitutionContentId: 25, content: "All owners of ada shall have the right to ensure that the process for participating...", order: 4 },
            revisedRule: undefined,
            path: "ARTICLE III > Section 5"
        },
        {
            actionType: "Edit",
            reason: "Defining technical meritocracy.",
            baseRule: { id: 25, constitutionContentId: 25, content: "'Hard Fork Initiation' and 'Protocol Parameter Change' governance actions shall undergo sufficient technical review...", order: 3 },
            revisedRule: { id: 25, constitutionContentId: 25, content: "Hard Forks require technical ratification by a quorum of recognized core maintainers as defined in the Guardrails.", order: 3 },
            path: "ARTICLE III > Section 5"
        },
        {
            actionType: "Add",
            reason: "Protecting testnets.",
            baseRule: undefined,
            revisedRule: { id: 203, constitutionContentId: 61, content: "A permanent, incentivized testnet must be maintained to validate all governance upgrades before mainnet deployment.", order: 2 },
            path: "ARTICLE IX > Section 2"
        }
    ],
    constitutionContentAmendments: [
        {
            actionType: "Edit",
            reason: "Renaming Article IX Section 1 and reordering.",
            baseContent: { id: 60, title: "Section 1 - Security and Audits", type: "Section", order: 1, children: [] },
            revisedContent: { id: 60, title: "Section 1 - Open Source & Security", type: "Section", order: 2, children: [] },
            parentId: 59
        },
        {
            actionType: "Edit",
            reason: "Swapping Section 2 to Order 1.",
            baseContent: { id: 61, title: "Section 2 - Upgrades and Testing", type: "Section", order: 2, children: [] },
            revisedContent: { id: 61, title: "Section 2 - Upgrades and Testing", type: "Section", order: 1, children: [] },
            parentId: 59
        },
        {
            actionType: "Edit",
            reason: "Changing Section type to Appendix.",
            baseContent: { id: 61, title: "Section 2 - Upgrades and Testing", type: "Section", order: 1, children: [] },
            revisedContent: { id: 61, title: "Appendix: Testing Standards", type: "appendix", order: 1, children: [] },
            parentId: 59
        },
        {
            actionType: "Add",
            reason: "Adding CIP Standards Appendix.",
            baseContent: undefined,
            revisedContent: { id: 301, title: "Appendix: CIP Standards", type: "appendix", order: 12, children: [] },
            parentId: undefined
        }
    ],
    comments: [
        { id: 43, owner: getOwner("Phil"), text: "This is crucial. We have seen too many projects take money and deliver closed binaries. I support \\a 1 fully.", likes: ["u20"], dislikes: [], favorites: ["u20"], replyTo: null },
        { id: 44, owner: getOwner("Peter"), text: "Does this apply to marketing tools as well? Or just node infrastructure?", likes: ["u25"], dislikes: [], favorites: [], replyTo: 43 },
        { id: 45, owner: getOwner("KtorZ"), text: "Primarily node infrastructure and voting clients. Marketing is separate.", likes: ["u26"], dislikes: [], favorites: [], replyTo: 44 },
        { id: 46, owner: getOwner("YUTA"), text: "Japanese community devs would love to participate in the CIP process if it is more accessible.", likes: ["u28"], dislikes: [], favorites: [], replyTo: null },
        { id: 47, owner: getOwner("Nicolas"), text: "The definition of 'recognized core maintainers' in \\a 10 needs to be very precise to avoid cabals.", likes: ["u30"], dislikes: [], favorites: ["u30"], replyTo: null },
        { id: 48, owner: getOwner("Mike"), text: "Agreed Nicolas. Who appoints them?", likes: ["u33"], dislikes: [], favorites: [], replyTo: 47 },
        { id: 49, owner: getOwner("Peyton"), text: "We should ensure this doesn't stifle commercial innovation on top of Cardano though.", likes: ["u34"], dislikes: [], favorites: [], replyTo: 43 },
        { id: 50, owner: getOwner("Linda"), text: "Open source is the only way to verify security. Look at \\c 2.3 Article I Tenet 2.", likes: ["u38"], dislikes: [], favorites: ["u38"], replyTo: null },
        { id: 51, owner: getOwner("Bee"), text: "Testnet incentives are long overdue.", likes: ["u40"], dislikes: [], favorites: [], replyTo: null },
        { id: 52, owner: getOwner("KtorZ"), text: "Exactly Bee. We need builders testing breaking changes before they hit mainnet.", likes: ["u41"], dislikes: [], favorites: [], replyTo: 51 },
        { id: 53, owner: getOwner("Phil"), text: "We need more devs.", likes: ["u42"], dislikes: [], favorites: [], replyTo: null }
    ]
  },
  {
    id: "op-207",
    owner: getOwner("Bee"),
    intent: "Decentralization does not mean lack of accountability. The 'encouraged' code of conduct currently in the constitution is insufficient to protect our community from bad actors. My proposal mandates a signed, legally binding Code of Ethics for all registered DReps and CC members, with on-chain revocation triggers for hate speech, doxxing, or confirmed financial fraud. We must prioritize the safety and dignity of all participants to foster a healthy political environment.",
    createdDate: "22 Dec 2025 - Epoch 598",
    createdTimestamp: 1766400000000,
    updatedDate: "23 Dec 2025 - Epoch 598",
    updatedTimestamp: 1766480000000,
    status: "Draft",
    events: [
        {
            id: "evt-207-a",
            subject: "Ethics in Web3 Panel",
            description: "Debating the balance between censorship resistance and community safety.",
            startDate: "10 Jan 2026 | 14:00 UTC",
            duration: "1h 30m",
            status: "Waiting",
            socialMedia: "x",
            link: "https://twitter.com/i/spaces/ethics_web3",
            hosts: [
                { ...getOwner("Bee"), duty: "Host" },
                { ...getOwner("Linda"), duty: "Speaker" }
            ]
        }
    ],
    ruleAmendments: [
        {
            actionType: "Edit",
            reason: "Making Code of Conduct mandatory and reordering.",
            baseRule: { id: 36, constitutionContentId: 36, content: "DReps who are representing delegators are expected to periodically adopt, and update as they deem appropriate, codes of conduct...", order: 1 },
            revisedRule: { id: 36, constitutionContentId: 36, content: "DReps MUST sign the Universal Code of Ethics upon registration. Violation results in automatic deregulation proposal.", order: 2 },
            path: "ARTICLE V > Section 3"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 36 Sibling.",
            baseRule: { id: 36, constitutionContentId: 36, content: "DReps MUST sign the Universal Code of Ethics...", order: 1 }, // Virtual
            revisedRule: { id: 36, constitutionContentId: 36, content: "Ethics are mandatory.", order: 1 },
            path: "ARTICLE V > Section 3"
        },
        {
            actionType: "Edit",
            reason: "Mandatory CC Ethics and reordering.",
            baseRule: { id: 56, constitutionContentId: 51, content: "The Constitutional Committee shall operate pursuant to a code of conduct periodically adopted...", order: 2 },
            revisedRule: { id: 56, constitutionContentId: 51, content: "The CC shall operate pursuant to a binding Code of Ethics. Breaches are grounds for immediate 'No Confidence' motion.", order: 1 },
            path: "ARTICLE VII > Section 6"
        },
        {
            actionType: "Edit",
            reason: "Swapping Rule 55 to Order 2.",
            baseRule: { id: 55, constitutionContentId: 51, content: "Constitutional Committee processes shall be transparent...", order: 1 },
            revisedRule: { id: 55, constitutionContentId: 51, content: "Transparency is key.", order: 2 },
            path: "ARTICLE VII > Section 6"
        },
        {
            actionType: "Add",
            reason: "Defining ethical violations.",
            baseRule: undefined,
            revisedRule: { id: 701, constitutionContentId: 36, content: "Ethical violations include: Sybil attacks, bribery, hate speech, and doxxing.", order: 3 },
            path: "ARTICLE V > Section 3"
        },
        {
            actionType: "Remove",
            reason: "Removing ambiguity on DRep conduct.",
            baseRule: { id: 37, constitutionContentId: 37, content: "The Cardano Community is expected to support the creation... of tools to enable owners of ada to explore... DRep codes of conduct...", order: 1 },
            revisedRule: undefined,
            path: "ARTICLE V > Section 4"
        },
        {
            actionType: "Add",
            reason: "Whistleblower protection.",
            baseRule: undefined,
            revisedRule: { id: 702, constitutionContentId: 51, content: "An anonymous whistleblower channel for CC misconduct must be maintained by the Guardrails script.", order: 3 },
            path: "ARTICLE VII > Section 6"
        },
        {
            actionType: "Edit",
            reason: "Clarifying fair treatment.",
            baseRule: { id: 10, constitutionContentId: 11, content: "All users of the Cardano Blockchain shall be treated fairly...", order: 1 },
            revisedRule: { id: 10, constitutionContentId: 11, content: "All users shall be treated fairly, provided they adhere to the Community Standards.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 8"
        }
    ],
    constitutionContentAmendments: [
        {
            actionType: "Edit",
            reason: "Renaming Article V Section 3 and reordering.",
            baseContent: { id: 36, title: "Section 3", type: "Section", order: 3, children: [] },
            revisedContent: { id: 36, title: "Section 3: DRep Ethics", type: "Section", order: 4, children: [] },
            parentId: 33
        },
        {
            actionType: "Edit",
            reason: "Swapping Section 4 to Order 3.",
            baseContent: { id: 37, title: "Section 4", type: "Section", order: 4, children: [] },
            revisedContent: { id: 37, title: "Section 4", type: "Section", order: 3, children: [] },
            parentId: 33
        },
        {
            actionType: "Edit",
            reason: "Changing Section type to GuardRail.",
            baseContent: { id: 37, title: "Section 4", type: "Section", order: 3, children: [] },
            revisedContent: { id: 37, title: "GuardRail: Conduct Tools", type: "GuardRail", order: 3, children: [] },
            parentId: 33
        },
        {
            actionType: "Add",
            reason: "Adding Ethics Appendix.",
            baseContent: undefined,
            revisedContent: { id: 705, title: "Appendix: Universal Code of Ethics", type: "appendix", order: 13, children: [] },
            parentId: undefined
        }
    ],
    comments: [
        { id: 54, owner: getOwner("Linda"), text: "This is a slippery slope. 'Hate speech' definitions vary globally. We risk censorship. See \\c 2.3 Preamble regarding open participation.", likes: ["u220"], dislikes: ["u223"], favorites: ["u220"], replyTo: null },
        { id: 55, owner: getOwner("Bee"), text: "We can define it based on UN standards. We cannot allow toxicity to drive away builders.", likes: ["u224"], dislikes: [], favorites: [], replyTo: 54 },
        { id: 56, owner: getOwner("Mike"), text: "I support the anti-bribery clause in \\a 5. Vote buying is rampant.", likes: ["u226"], dislikes: [], favorites: [], replyTo: null },
        { id: 57, owner: getOwner("KtorZ"), text: "On-chain revocation is technically hard. Who triggers it? A multisig? That's centralization.", likes: ["u228"], dislikes: [], favorites: [], replyTo: null },
        { id: 58, owner: getOwner("Bee"), text: "It would be triggered by a specific governance action type, voted on by SPOs.", likes: ["u230"], dislikes: [], favorites: [], replyTo: 57 },
        { id: 59, owner: getOwner("Peter"), text: "I like the Whistleblower channel idea in \\a 7.", likes: ["u231"], dislikes: [], favorites: [], replyTo: null },
        { id: 60, owner: getOwner("YUTA"), text: "In Japan, anonymous reporting is culturally important. I support this.", likes: ["u232"], dislikes: [], favorites: [], replyTo: 59 }
    ]
  },
  {
    id: "op-208",
    owner: getOwner("Mike"),
    intent: "We are ignoring the hardware reality. As an SPO, I see the network struggle during high load. Governance actions that bloat the ledger size without increasing throughput are dangerous. I propose a 'Lean Ledger' amendment to Article IX, requiring all on-chain metadata for governance to be compressed or stored via IPFS pointers only. Furthermore, we must mandate dynamic block sizing adjustments based on epoch load to ensure the network remains performant for simple transactions, prioritizing value transfer over governance chatter.",
    createdDate: "25 Dec 2025 - Epoch 598",
    createdTimestamp: 1766660000000,
    updatedDate: "25 Dec 2025 - Epoch 599",
    updatedTimestamp: 1766660000000,
    status: "Voting",
    events: [], // 0 events as requested
    ruleAmendments: [
        {
            actionType: "Edit",
            reason: "Limiting metadata bloat.",
            baseRule: { id: 23, constitutionContentId: 25, content: "In order to promote transparency... all proposed governance actions are expected to follow a standardized and legible format...", order: 1 },
            revisedRule: { id: 23, constitutionContentId: 25, content: "Governance actions shall minimize on-chain footprint. Extensive text must be off-loaded to IPFS with only the hash stored on-chain.", order: 1 },
            path: "ARTICLE III > Section 5"
        },
        {
            actionType: "Add",
            reason: "Lean Ledger mandate.",
            baseRule: undefined,
            revisedRule: { id: 801, constitutionContentId: 59, content: "Ledger sustainability is paramount. Governance metadata is secondary to transaction throughput.", order: 5 },
            path: "ARTICLE IX > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Prioritizing transaction speed.",
            baseRule: { id: 2, constitutionContentId: 3, content: "Transactions on the Cardano Blockchain shall be processed reliably, without unreasonable delay or censorship, and shall serve their intended purpose.", order: 1 },
            revisedRule: { id: 2, constitutionContentId: 3, content: "Financial transactions take priority over governance metadata in block construction during congestion.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 1"
        },
        {
            actionType: "Remove",
            reason: "Removing vague cost predictability to allow congestion pricing.",
            baseRule: { id: 3, constitutionContentId: 4, content: "The cost of transactions on the Cardano Blockchain shall be predictable and not unreasonable.", order: 1 },
            revisedRule: undefined,
            path: "ARTICLE I > Section 1 > Tenet 1"
        },
        {
            actionType: "Add",
            reason: "Dynamic fees for governance.",
            baseRule: undefined,
            revisedRule: { id: 802, constitutionContentId: 4, content: "Governance submission fees shall scale dynamically with ledger bloat.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 1"
        },
        {
            actionType: "Edit",
            reason: "Swapping Tenet 8 and 9.",
            baseRule: { id: 10, constitutionContentId: 11, content: "All users of the Cardano Blockchain shall be treated fairly...", order: 1 },
            revisedRule: { id: 10, constitutionContentId: 11, content: "All users of the Cardano Blockchain shall be treated fairly...", order: 2 },
            path: "ARTICLE I > Section 1 > Tenet 8"
        },
        {
            actionType: "Edit",
            reason: "Swapping Tenet 9 to Order 1.",
            baseRule: { id: 11, constitutionContentId: 12, content: "Financial stability shall be maintained...", order: 1 }, // Virtual
            revisedRule: { id: 11, constitutionContentId: 12, content: "Stability is key.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 9"
        },
        {
            actionType: "Edit",
            reason: "SPO check on performance.",
            baseRule: { id: 41, constitutionContentId: 42, content: "SPOs shall act as a check on the power of the Constitutional Committee...", order: 1 },
            revisedRule: { id: 41, constitutionContentId: 42, content: "SPOs shall veto any parameter change that empirically degrades block propagation beyond 500ms.", order: 1 },
            path: "ARTICLE VI > Section 2"
        },
        {
            actionType: "Add",
            reason: "Archive node funding.",
            baseRule: undefined,
            revisedRule: { id: 803, constitutionContentId: 28, content: "Treasury funds must subsidize archive nodes to store historical governance data.", order: 5 },
            path: "ARTICLE IV > Section 1"
        }
    ],
    constitutionContentAmendments: [
        {
            actionType: "Edit",
            reason: "Renaming Article I Section 2.",
            baseContent: { id: 13, title: "Section 2", type: "Section", order: 2, children: [] },
            revisedContent: { id: 13, title: "Section 2: Ledger Efficiency", type: "Section", order: 2, children: [] },
            parentId: 1
        },
        {
            actionType: "Edit",
            reason: "Changing Section type to GuardRail.",
            baseContent: { id: 13, title: "Section 2: Ledger Efficiency", type: "Section", order: 2, children: [] },
            revisedContent: { id: 13, title: "GuardRail: Ledger Efficiency", type: "GuardRail", order: 2, children: [] },
            parentId: 1
        },
        {
            actionType: "Edit",
            reason: "Swapping Tenet 8 content order.",
            baseContent: { id: 10, title: "Tenet 8", type: "Tenet", order: 8, children: [] },
            revisedContent: { id: 10, title: "Tenet 8", type: "Tenet", order: 9, children: [] },
            parentId: 2
        },
        {
            actionType: "Edit",
            reason: "Swapping Tenet 9 content order.",
            baseContent: { id: 11, title: "Tenet 9", type: "Tenet", order: 9, children: [] },
            revisedContent: { id: 11, title: "Tenet 9", type: "Tenet", order: 8, children: [] },
            parentId: 2
        }
    ],
    comments: [
        { id: 61, owner: getOwner("KtorZ"), text: "Technically sound. \\a 1 is best practice anyway, but enforcing it on-chain needs new ledger rules.", likes: ["u240"], dislikes: [], favorites: ["u240"], replyTo: null },
        { id: 62, owner: getOwner("Phil"), text: "Prioritizing financial tx over governance in \\a 3 is controversial. Governance is what secures the chain long-term.", likes: ["u243"], dislikes: ["u244"], favorites: [], replyTo: null },
        { id: 63, owner: getOwner("Mike"), text: "If the chain halts because of metadata bloat, there is no governance. Performance is security.", likes: ["u246"], dislikes: [], favorites: ["u246"], replyTo: 62 },
        { id: 64, owner: getOwner("Linda"), text: "I worry about \\a 5 making governance expensive for small players. Dynamic fees hurt the poor.", likes: ["u248"], dislikes: [], favorites: [], replyTo: null },
        { id: 65, owner: getOwner("Bee"), text: "Agreed Linda. We need a waiver system.", likes: ["u250"], dislikes: [], favorites: [], replyTo: 64 },
        { id: 66, owner: getOwner("Peter"), text: "500ms propagation limit in \\a 8 is very strict. Can the network handle that globally?", likes: ["u251"], dislikes: [], favorites: [], replyTo: null },
        { id: 67, owner: getOwner("Mike"), text: "It must, or we lose sync.", likes: ["u252"], dislikes: [], favorites: [], replyTo: 66 },
        { id: 68, owner: getOwner("KtorZ"), text: "Compression is good.", likes: ["u253"], dislikes: [], favorites: [], replyTo: null }
    ]
  },
  {
    id: "op-209",
    owner: getOwner("Nicolas"),
    intent: "Interoperability is not just about bridges; it is about shared security standards. My proposal adds a 'Sidechain Constitution' clause to Article I. Any sidechain securing more than 10M ADA must adhere to the same basic tenets as the main chain regarding censorship resistance and open access. We cannot allow the Cardano brand to be diluted by centralized L2s that claim to be 'Cardano-native' while operating multisigs with no oversight.",
    createdDate: "05 Jan 2026 - Epoch 600",
    createdTimestamp: 1767610800000,
    updatedDate: "05 Jan 2026 - Epoch 600",
    updatedTimestamp: 1767610800000,
    status: "Draft",
    events: [
        {
            id: "evt-209-a",
            subject: "Sidechain Security Summit",
            description: "Establishing minimum viable decentralization for partner chains.",
            startDate: "10 Jan 2026 | 12:00 UTC",
            duration: "2h 00m",
            status: "Waiting",
            socialMedia: "discord",
            link: "https://discord.gg/sidechains",
            hosts: [
                { ...getOwner("Nicolas"), duty: "Host" },
                { ...getOwner("KtorZ"), duty: "Speaker" }
            ]
        },
        {
            id: "evt-209-b",
            subject: "Bridge Risks AMA",
            description: "Why multisigs are not enough.",
            startDate: "12 Jan 2026 | 16:00 UTC",
            duration: "1h 30m",
            status: "Finished",
            socialMedia: "x",
            link: "https://twitter.com/i/spaces/bridges",
            hosts: [
                { ...getOwner("Nicolas"), duty: "Host" }
            ]
        }
    ],
    ruleAmendments: [
        {
            actionType: "Edit",
            reason: "Defining Sidechain Standards and reordering.",
            baseRule: { id: 7, constitutionContentId: 8, content: "The Cardano Blockchain shall not unreasonably impede interoperability.", order: 1 },
            revisedRule: { id: 7, constitutionContentId: 8, content: "Interoperability is encouraged, but partner chains must adhere to the 'Censorship Resistance' tenet.", order: 2 },
            path: "ARTICLE I > Section 1 > Tenet 5"
        },
        {
            actionType: "Edit",
            reason: "Swapping Tenet 6 to Order 1.",
            baseRule: { id: 8, constitutionContentId: 9, content: "The Cardano Blockchain shall preserve in a safe manner...", order: 1 },
            revisedRule: { id: 8, constitutionContentId: 9, content: "Safety is key.", order: 1 },
            path: "ARTICLE I > Section 1 > Tenet 6"
        },
        {
            actionType: "Add",
            reason: "Sidechain certification.",
            baseRule: undefined,
            revisedRule: { id: 901, constitutionContentId: 8, content: "Sidechains with >10M ADA TVL must submit to annual constitutionality audits by the CC.", order: 3 },
            path: "ARTICLE I > Section 1 > Tenet 5"
        },
        {
            actionType: "Add",
            reason: "Bridge security.",
            baseRule: undefined,
            revisedRule: { id: 902, constitutionContentId: 59, content: "Canonical bridges must use trustless light-client verification.", order: 5 },
            path: "ARTICLE IX > Section 1"
        },
        {
            actionType: "Edit",
            reason: "Treasury for L2s.",
            baseRule: { id: 28, constitutionContentId: 28, content: "Any participant in the Cardano Community may propose a Cardano Blockchain ecosystem budget...", order: 1 },
            revisedRule: { id: 28, constitutionContentId: 28, content: "Budget proposals for Layer 2 scaling solutions are prioritized if they are open source.", order: 1 },
            path: "ARTICLE IV > Section 1"
        },
        {
            actionType: "Remove",
            reason: "Removing restriction on treasury for external projects.",
            baseRule: { id: 30, constitutionContentId: 30, content: "Withdrawals from the Cardano Blockchain treasury that would cause...", order: 1 },
            revisedRule: undefined,
            path: "ARTICLE IV > Section 3"
        },
        {
            actionType: "Add",
            reason: "Emergency halt for L2.",
            baseRule: undefined,
            revisedRule: { id: 904, constitutionContentId: 13, content: "The Guardrails must include circuit breakers for bridged assets during hacks.", order: 3 },
            path: "ARTICLE I > Section 2"
        }
    ],
    constitutionContentAmendments: [
        {
            actionType: "Edit",
            reason: "Renaming Article I Section 1 and reordering.",
            baseContent: { id: 2, title: "Section 1", type: "Section", order: 1, children: [] },
            revisedContent: { id: 2, title: "Section 1: Core Tenets & Sidechains", type: "Section", order: 2, children: [] },
            parentId: 1
        },
        {
            actionType: "Edit",
            reason: "Swapping Section 2 to Order 1.",
            baseContent: { id: 13, title: "Section 2", type: "Section", order: 2, children: [] },
            revisedContent: { id: 13, title: "Section 2", type: "Section", order: 1, children: [] },
            parentId: 1
        },
        {
            actionType: "Edit",
            reason: "Changing Tenet 5 type to Section.",
            baseContent: { id: 7, title: "Tenet 5", type: "Tenet", order: 5, children: [] },
            revisedContent: { id: 7, title: "Section: Interoperability", type: "Section", order: 5, children: [] },
            parentId: 2
        },
        {
            actionType: "Add",
            reason: "Adding Sidechain Appendix.",
            baseContent: undefined,
            revisedContent: { id: 905, title: "Appendix: Sidechain Standards", type: "appendix", order: 14, children: [] },
            parentId: undefined
        }
    ],
    comments: [
        { id: 69, owner: getOwner("KtorZ"), text: "Enforcing tenets on sidechains is hard. They are sovereign chains.", likes: ["u260"], dislikes: [], favorites: [], replyTo: null },
        { id: 70, owner: getOwner("Nicolas"), text: "If they use the Cardano brand or treasury, they must comply.", likes: ["u262"], dislikes: [], favorites: ["u262"], replyTo: 69 },
        { id: 71, owner: getOwner("Phil"), text: "Circuit breakers in \\a 7 are essential. Look at the bridge hacks in 2024.", likes: ["u264"], dislikes: [], favorites: [], replyTo: null },
        { id: 72, owner: getOwner("Peter"), text: "Will this stifle innovation on Partner Chains?", likes: ["u265"], dislikes: [], favorites: [], replyTo: null },
        { id: 73, owner: getOwner("Linda"), text: "It protects users. That is more important.", likes: ["u266"], dislikes: ["u267"], favorites: [], replyTo: 72 },
        { id: 74, owner: getOwner("Mike"), text: "Trustless light clients are heavy. Can we afford the on-chain verification costs?", likes: ["u268"], dislikes: [], favorites: [], replyTo: null },
        { id: 75, owner: getOwner("Nicolas"), text: "Mithril will solve this.", likes: ["u269"], dislikes: [], favorites: [], replyTo: 74 },
        { id: 76, owner: getOwner("YUTA"), text: "Japan is very interested in enterprise sidechains. Regulation might conflict with \\a 1.", likes: ["u270"], dislikes: [], favorites: [], replyTo: null },
        { id: 77, owner: getOwner("Bee"), text: "Ref \\c 2.3 Article I Tenet 5.", likes: ["u271"], dislikes: [], favorites: [], replyTo: null }
    ]
  }
];
