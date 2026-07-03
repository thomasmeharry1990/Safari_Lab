/**
 * Safari Lab - SEO landing page content (Stage 15).
 *
 * Data-driven, crawlable landing pages with unique copy and a prefilled-generator
 * CTA. No thin pages: each has a lead, sections, FAQs and related exercises.
 */

export type LandingGroup =
  | 'goals'
  | 'splits'
  | 'muscle-groups'
  | 'equipment'
  | 'programs';

export interface GeneratorPrefill {
  goal?: string;
  days?: number;
  split?: string;
  muscles?: string[];
  equipment?: string;
}

export interface Landing {
  group: LandingGroup;
  slug: string;
  h1: string;
  lead: string;
  sections: { h2: string; body: string[] }[];
  faqs: { q: string; a: string }[];
  prefill: GeneratorPrefill;
  relatedExerciseIds: string[];
  seo: { title: string; description: string };
}

export const GROUP_META: Record<
  LandingGroup,
  { title: string; path: string; blurb: string }
> = {
  goals: {
    title: 'Training goals',
    path: '/goals',
    blurb: 'Pick a goal and generate a plan built around it.',
  },
  splits: {
    title: 'Training splits',
    path: '/splits',
    blurb: 'Understand each split, then build one in a tap.',
  },
  'muscle-groups': {
    title: 'Muscle groups',
    path: '/muscle-groups',
    blurb: 'Target a body part with the right exercises and volume.',
  },
  equipment: {
    title: 'By equipment',
    path: '/equipment',
    blurb: 'Train with whatever you have — gym, dumbbells or bodyweight.',
  },
  programs: {
    title: 'Program templates',
    path: '/programs',
    blurb: 'Ready-made program shapes you can generate and lock.',
  },
};

export const LANDINGS: Landing[] = [
  // ---------------- Goals ----------------
  {
    group: 'goals',
    slug: 'build-muscle',
    h1: 'Build Muscle',
    lead: 'Hypertrophy comes from training each muscle with enough hard sets, in a rep range you can progress, recovered enough to add weight or reps over time. Safari Lab builds that structure for you and adapts it as you train.',
    sections: [
      {
        h2: 'How to train for size',
        body: [
          'Most muscle growth happens in moderate rep ranges — roughly 6 to 15 reps — taken close to failure. What matters more than any magic range is weekly volume: the number of hard sets per muscle, kept inside a range you can recover from.',
          'Safari Lab scores exercises by muscle, pattern and equipment, leads each session with a big compound while you are fresh, and fills in accessories that hit your priority muscles first.',
        ],
      },
      {
        h2: 'Progress beats perfection',
        body: [
          'Add a rep when you can, add weight when you hit the top of the range, and keep most sessions repeatable. Safari Lab’s gym mode shows your last time and best ever, and recommends your next target automatically.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many days a week should I train to build muscle?',
        a: 'Three to five days works well for most people. More days let you spread volume out; fewer days mean fuller sessions. Safari Lab balances either.',
      },
      {
        q: 'Do I need to lift to failure?',
        a: 'No — training close to failure (a rep or two in reserve) on most sets drives growth while keeping your form and recovery intact.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 4, split: 'auto', equipment: 'full_gym' },
    relatedExerciseIds: ['EX-001', 'EX-069', 'EX-094', 'EX-018'],
    seo: {
      title: 'Build Muscle — Free Hypertrophy Program Generator',
      description:
        'Build a free adaptive muscle-building program. Volume, rep ranges and progression, generated in your browser and stored on your device.',
    },
  },
  {
    group: 'goals',
    slug: 'strength',
    h1: 'Get Stronger',
    lead: 'Strength is a skill as much as a quality. It rewards heavier loads, lower reps, longer rest and consistent practice of the big lifts. Safari Lab prioritises compounds and paces your progression.',
    sections: [
      {
        h2: 'Lower reps, longer rest',
        body: [
          'Strength blocks live mostly in the 3–6 rep range with full rest between sets, so you can move meaningful weight with good technique. Accessory work still matters — it builds the muscle and resilience that let your main lifts climb.',
        ],
      },
      {
        h2: 'Practise the lifts',
        body: [
          'Squat, hinge, press and pull show up often so the movements become second nature. Safari Lab leads each session with your strongest compound and keeps the ramp-up sets sensible.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can beginners train for strength?',
        a: 'Yes. Beginners get stronger fast on simple, stable lifts. Safari Lab keeps the exercise selection approachable and the jumps conservative.',
      },
    ],
    prefill: { goal: 'strength', days: 4, split: 'upper_lower', equipment: 'full_gym' },
    relatedExerciseIds: ['EX-069', 'EX-001', 'EX-032', 'EX-033'],
    seo: {
      title: 'Get Stronger — Free Strength Program Generator',
      description:
        'Generate a free strength-focused gym program: compound lifts, lower reps, smart progression. Local-first, no account.',
    },
  },
  {
    group: 'goals',
    slug: 'general-fitness',
    h1: 'General Fitness',
    lead: 'You don’t need a competition goal to train well. A balanced plan that hits every major muscle, moves you through full ranges and leaves you feeling better is enough — and it’s the most sustainable goal of all.',
    sections: [
      {
        h2: 'Balanced and beginner-friendly',
        body: [
          'General-fitness training uses moderate reps, stable exercises and enough variety to stay interesting. Safari Lab keeps intimidation low with machine and dumbbell options and clear form cues.',
        ],
      },
      {
        h2: 'Consistency is the point',
        body: [
          'Two to four focused sessions a week, repeated, beats an ambitious plan you can’t keep. Safari Lab adapts around missed sessions and short days so life doesn’t derail you.',
        ],
      },
    ],
    faqs: [
      {
        q: 'I’m completely new — where do I start?',
        a: 'Pick general fitness, three days a week, and the equipment you have. Safari Lab does the rest and explains every choice.',
      },
    ],
    prefill: { goal: 'general_fitness', days: 3, split: 'full_body', equipment: 'full_gym' },
    relatedExerciseIds: ['EX-071', 'EX-002', 'EX-018', 'EX-117'],
    seo: {
      title: 'General Fitness — Free Beginner-Friendly Program',
      description:
        'A balanced, beginner-friendly gym program generated for free. Full-body training, clear cues, stored on your device.',
    },
  },

  // ---------------- Splits ----------------
  {
    group: 'splits',
    slug: 'push-pull-legs',
    h1: 'Push / Pull / Legs Split',
    lead: 'Push/Pull/Legs groups your training by movement: pushing muscles one day, pulling muscles the next, legs on the third. It scales cleanly from three to six days and keeps sessions focused.',
    sections: [
      {
        h2: 'How PPL works',
        body: [
          'Push days train chest, shoulders and triceps. Pull days train back, rear delts and biceps. Leg days train quads, hamstrings, glutes and calves. Run it three days a week, or twice through for six.',
        ],
      },
      {
        h2: 'Who it suits',
        body: [
          'PPL is a great fit for intermediate lifters who can train four to six days and want each muscle hit with real focus. Safari Lab prefills a PPL shape and fills each day with the right exercises.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is PPL good for beginners?',
        a: 'It can be, but beginners often progress faster on full-body training three days a week. Safari Lab will suggest the best fit for your day count.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 6, split: 'ppl', equipment: 'full_gym' },
    relatedExerciseIds: ['EX-001', 'EX-016', 'EX-069'],
    seo: {
      title: 'Push Pull Legs Split — Free PPL Program Generator',
      description:
        'Generate a free Push/Pull/Legs program for 3–6 days a week. Balanced volume, real exercises, stored on your device.',
    },
  },
  {
    group: 'splits',
    slug: 'full-body',
    h1: 'Full Body Split',
    lead: 'Full-body training hits every major muscle each session. With two to four sessions a week it delivers high frequency, high adherence and fast beginner progress.',
    sections: [
      {
        h2: 'Why full body works',
        body: [
          'Training each muscle two or three times a week beats hammering it once. Full-body sessions keep volume per session moderate, so you recover well and rarely miss a muscle.',
        ],
      },
      {
        h2: 'Ideal for busy schedules',
        body: [
          'If you can only train two or three times a week, full body is the most efficient way to cover everything. Safari Lab rotates exercises across days so sessions stay fresh.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many exercises per full-body session?',
        a: 'Usually four to six — a couple of compounds plus targeted accessories. Safari Lab sizes each session to your available time.',
      },
    ],
    prefill: { goal: 'general_fitness', days: 3, split: 'full_body', equipment: 'full_gym' },
    relatedExerciseIds: ['EX-069', 'EX-001', 'EX-016', 'EX-094'],
    seo: {
      title: 'Full Body Split — Free Full-Body Workout Generator',
      description:
        'Build a free full-body gym program for 2–4 days a week. High frequency, beginner-friendly, local-first.',
    },
  },

  // ---------------- Muscle groups ----------------
  {
    group: 'muscle-groups',
    slug: 'glutes',
    h1: 'Glute Training',
    lead: 'Strong glutes drive every hinge, squat and sprint — and they respond to loaded hip extension, plenty of volume and a mix of heavy and higher-rep work.',
    sections: [
      {
        h2: 'The best glute exercises',
        body: [
          'Hip thrusts and their variations load hip extension directly. Romanian deadlifts and pull-throughs train the stretch. Abduction work builds the side glutes. A good glute plan uses all three.',
        ],
      },
      {
        h2: 'Volume and progression',
        body: [
          'Glutes tolerate and reward higher volume than most muscles. Prioritise them in Safari Lab and they’ll get extra sets and earlier placement — within a recovery-safe weekly cap.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How often should I train glutes?',
        a: 'Two to three times a week works well. Safari Lab spreads the volume across your training days.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 4, split: 'auto', muscles: ['glutes'], equipment: 'full_gym' },
    relatedExerciseIds: ['EX-094', 'EX-083', 'EX-101', 'EX-104'],
    seo: {
      title: 'Glute Training — Free Glute-Focused Program',
      description:
        'The best glute exercises and a free glute-priority program generator. Hip thrusts, RDLs and abduction, built around you.',
    },
  },
  {
    group: 'muscle-groups',
    slug: 'back',
    h1: 'Back Training',
    lead: 'A complete back needs vertical pulls for the lats, horizontal pulls for the mid-back, and enough volume to balance all the pressing you do.',
    sections: [
      {
        h2: 'Pull from every angle',
        body: [
          'Pull-ups and pulldowns build width; rows build thickness. Face pulls and rear-delt work keep your shoulders healthy. Safari Lab mixes the angles so nothing gets neglected.',
        ],
      },
      {
        h2: 'Grow your pulling strength',
        body: [
          'Progress your rows and pulldowns the same way you progress a press — add a rep, then add load. Gym mode tracks it for you.',
        ],
      },
    ],
    faqs: [
      {
        q: 'I can’t do a pull-up yet — what should I do?',
        a: 'Use assisted pull-ups or lat pulldowns and build strength over time. Safari Lab picks the right regression for your level.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 4, split: 'upper_lower', muscles: ['lats'], equipment: 'full_gym' },
    relatedExerciseIds: ['EX-016', 'EX-023', 'EX-018', 'EX-020'],
    seo: {
      title: 'Back Training — Free Back Workout Generator',
      description:
        'Build a wider, thicker back with a free back-priority program. Pull-ups, rows and pulldowns, generated locally.',
    },
  },
  {
    group: 'muscle-groups',
    slug: 'shoulders',
    h1: 'Shoulder Training',
    lead: 'Well-rounded shoulders need pressing for the front delts, lateral raises for the side delts, and plenty of rear-delt work — the part most people skip.',
    sections: [
      {
        h2: 'Train all three heads',
        body: [
          'Overhead pressing builds the front delts (and your legs of everyday pressing). Lateral raises build the side delts that make shoulders look broad. Face pulls and rear-delt flyes round it out and protect your shoulders.',
        ],
      },
      {
        h2: 'Side and rear delts love volume',
        body: [
          'The small delt muscles recover quickly and respond to frequent, higher-rep work. Prioritise shoulders in Safari Lab for extra raise volume.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Why do my shoulders look flat?',
        a: 'Usually not enough side-delt volume. Add lateral raises across several days — Safari Lab will program them for you.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 4, split: 'auto', muscles: ['side_delts'], equipment: 'full_gym' },
    relatedExerciseIds: ['EX-033', 'EX-037', 'EX-042'],
    seo: {
      title: 'Shoulder Training — Free Delt Workout Generator',
      description:
        'Build capped, balanced shoulders with a free delt-focused program. Presses, lateral raises and rear-delt work.',
    },
  },

  // ---------------- Equipment ----------------
  {
    group: 'equipment',
    slug: 'dumbbells',
    h1: 'Dumbbells Only',
    lead: 'A pair of adjustable dumbbells and a bench can train your whole body. Dumbbells build balance and control, and they’re forgiving on the joints.',
    sections: [
      {
        h2: 'What you can train',
        body: [
          'Presses, rows, curls, extensions, squats, lunges, hip thrusts and RDLs all work with dumbbells. Safari Lab only picks exercises your kit supports, so no session asks for a machine you don’t have.',
        ],
      },
      {
        h2: 'Progress without a rack',
        body: [
          'When you run out of load, add reps, slow the tempo, or move to single-limb versions. Safari Lab’s progression handles the jump for you.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can you build muscle with just dumbbells?',
        a: 'Absolutely. Enough sets taken close to failure grow muscle regardless of the tool.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 4, split: 'auto', equipment: 'dumbbells' },
    relatedExerciseIds: ['EX-002', 'EX-084', 'EX-049', 'EX-034'],
    seo: {
      title: 'Dumbbells Only — Free Dumbbell Workout Generator',
      description:
        'A free full-body program using only dumbbells and a bench. No machines required, built around your kit.',
    },
  },
  {
    group: 'equipment',
    slug: 'full-gym',
    h1: 'Full Gym',
    lead: 'With barbells, machines, cables and dumbbells you have every tool for every job — the most complete way to build strength and size.',
    sections: [
      {
        h2: 'Use the right tool for each muscle',
        body: [
          'Barbells for heavy compounds, cables for constant-tension isolation, machines for safe overload when you’re tired. Safari Lab picks the best fit for each slot and rotates variations across your week.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Should I only use free weights?',
        a: 'No — machines and cables are excellent for isolation and for training hard with less fatigue. A good plan uses all of them.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 4, split: 'auto', equipment: 'full_gym' },
    relatedExerciseIds: ['EX-069', 'EX-001', 'EX-018', 'EX-094'],
    seo: {
      title: 'Full Gym — Free Complete Workout Generator',
      description:
        'Generate a free gym program using barbells, machines, cables and dumbbells. The most complete entry point.',
    },
  },
  {
    group: 'equipment',
    slug: 'bodyweight',
    h1: 'Bodyweight Only',
    lead: 'No equipment, no problem. Bodyweight training builds real strength and control — you just progress with leverage and reps instead of load.',
    sections: [
      {
        h2: 'Honest about the limits',
        body: [
          'Bodyweight training is excellent for pushing, core and single-leg work, and good for pulling if you have a bar. Loading the lower body hard is harder — so we lean on higher reps, tempo and tougher variations.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I get strong with bodyweight only?',
        a: 'Yes, especially early on. Progress to harder variations (like one-leg or elevated versions) as you improve.',
      },
    ],
    prefill: { goal: 'general_fitness', days: 3, split: 'full_body', equipment: 'bodyweight' },
    relatedExerciseIds: ['EX-007', 'EX-016', 'EX-097', 'EX-117'],
    seo: {
      title: 'Bodyweight Only — Free No-Equipment Workout Generator',
      description:
        'A free bodyweight program you can do anywhere. Honest about progression, built for your level.',
    },
  },

  // ---------------- Programs ----------------
  {
    group: 'programs',
    slug: '4-day-upper-lower',
    h1: '4-Day Upper / Lower',
    lead: 'The 4-day upper/lower split is the default for a reason: two upper days and two lower days give every muscle twice-weekly frequency with enough volume to grow, on a schedule most people can keep.',
    sections: [
      {
        h2: 'How the week runs',
        body: [
          'Upper, Lower, Upper, Lower — with rest spread through the week. Each upper day trains chest, back and shoulders; each lower day trains quads, hamstrings and glutes. Safari Lab rotates the exercises so day one and day three aren’t identical.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Who is upper/lower best for?',
        a: 'Intermediate lifters training four days a week who want balanced, twice-weekly frequency. Safari Lab prefills it here.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 4, split: 'upper_lower', equipment: 'full_gym' },
    relatedExerciseIds: ['EX-001', 'EX-016', 'EX-069', 'EX-094'],
    seo: {
      title: '4-Day Upper/Lower — Free Program Generator',
      description:
        'Generate the classic 4-day upper/lower split for free. Twice-weekly frequency, balanced volume, stored on your device.',
    },
  },
  {
    group: 'programs',
    slug: 'back-and-glutes',
    h1: 'Back & Glutes Priority',
    lead: 'Want a stronger posterior chain? This template prioritises back and glutes — extra sets and earlier placement — while keeping the rest of your body balanced.',
    sections: [
      {
        h2: 'Priority done right',
        body: [
          'Prioritising two muscles means more volume for them, not ignoring everything else. Safari Lab adds carry-in sets for back and glutes within a recovery-safe cap and still maintains your chest, shoulders and quads.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Will prioritising two muscles hurt the rest?',
        a: 'No — non-priority muscles still get maintenance volume. You just bias your best effort toward the two you chose.',
      },
    ],
    prefill: { goal: 'build_muscle', days: 4, split: 'upper_lower', muscles: ['lats', 'glutes'], equipment: 'full_gym' },
    relatedExerciseIds: ['EX-016', 'EX-023', 'EX-094', 'EX-083'],
    seo: {
      title: 'Back & Glutes Priority — Free Program Generator',
      description:
        'A free back-and-glutes priority program. Extra posterior-chain volume, balanced everywhere else, built in your browser.',
    },
  },
];

export function getLandings(group: LandingGroup): Landing[] {
  return LANDINGS.filter((l) => l.group === group);
}

export function getLanding(group: LandingGroup, slug: string): Landing | undefined {
  return LANDINGS.find((l) => l.group === group && l.slug === slug);
}

/** Build the prefilled-generator query string for a landing. */
export function prefillHref(prefill: GeneratorPrefill): string {
  const p = new URLSearchParams();
  if (prefill.goal) p.set('goal', prefill.goal);
  if (prefill.days) p.set('days', String(prefill.days));
  if (prefill.split) p.set('split', prefill.split);
  if (prefill.muscles?.length) p.set('muscles', prefill.muscles.join(','));
  if (prefill.equipment) p.set('equipment', prefill.equipment);
  const qs = p.toString();
  return qs ? `/workout-generator?${qs}` : '/workout-generator';
}
