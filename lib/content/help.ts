/** Safari Lab - Help Centre articles (premium P3). Static, searchable content. */

export interface HelpArticle {
  q: string;
  category: string;
  keywords: string;
  a: string[];
}

export const HELP_CATEGORIES = [
  'Getting started',
  'Training',
  'Your data',
  'Offline & install',
  'Troubleshooting',
] as const;

export const HELP_ARTICLES: HelpArticle[] = [
  {
    category: 'Getting started',
    q: 'Do I need an account?',
    keywords: 'account sign up login register free',
    a: [
      'No. Safari Lab never asks you to sign up or log in. Everything you create is stored in your browser on this device, and a save file is how you move it elsewhere.',
    ],
  },
  {
    category: 'Getting started',
    q: 'How do I create a program?',
    keywords: 'generate program plan wizard create build',
    a: [
      'Open the Program Generator (Start Your Safari → Create a program), answer a few questions — goal, days, priority muscles, equipment — and Safari Lab builds a balanced multi-week block.',
      'Review the draft, swap or block any exercises, then lock it in. Your locked program lives under My Program.',
    ],
  },
  {
    category: 'Getting started',
    q: 'What is a Quick Safari?',
    keywords: 'quick safari one-off session no program',
    a: [
      'A Quick Safari is a single workout with no program required — pick your goal, time and equipment and get a session you can log right away. It still counts toward your progress, and you can turn it into a full program in one tap.',
    ],
  },
  {
    category: 'Training',
    q: 'How does progression work?',
    keywords: 'progression next weight reps double progression overload',
    a: [
      'Safari Lab uses double progression. When you hit the top of the rep range on every set, it suggests adding load and resetting reps to the bottom. Otherwise it keeps the weight and nudges you for one more rep.',
      'In gym mode each exercise shows your last time, your best ever, and a suggested next target, pre-filled into the set inputs.',
    ],
  },
  {
    category: 'Training',
    q: 'Can I swap or block exercises?',
    keywords: 'swap block exercise substitute alternative remove',
    a: [
      'Yes. On a draft program (or in gym mode) you can Swap any exercise for an equivalent, or Block one so it never appears again until you unblock it. Blocked exercises are remembered on your device.',
    ],
  },
  {
    category: 'Training',
    q: 'What if I miss a session, am sore, or run short on time?',
    keywords: 'adapt missed sore soreness low time equipment adaptation',
    a: [
      'Use Adapt session on Today’s Safari. Tell Safari Lab what’s going on — short on time, sore muscles, missing equipment, or a missed session — and it reshapes today’s workout, explains every change, and lets you undo it.',
    ],
  },
  {
    category: 'Your data',
    q: 'Where is my data stored?',
    keywords: 'data storage local device privacy cloud indexeddb',
    a: [
      'On your device, in your browser’s local storage (IndexedDB). Nothing is uploaded to a server — Safari Lab has no accounts and no cloud database.',
    ],
  },
  {
    category: 'Your data',
    q: 'How do I back up my training?',
    keywords: 'backup export slfit save file download',
    a: [
      'Go to Backup & save files and choose Export. You’ll download a .slfit file — plain JSON that belongs to you — containing your program, history and settings. Keep it somewhere safe.',
    ],
  },
  {
    category: 'Your data',
    q: 'How do I move to a new device?',
    keywords: 'move transfer new device import restore',
    a: [
      'Export a save file on your old device, then on the new one open Backup & save files → Import, pick the file, review the preview and confirm. Your programs, history and settings are restored.',
    ],
  },
  {
    category: 'Your data',
    q: 'How do I clear my data?',
    keywords: 'clear delete reset data controls wipe',
    a: [
      'Settings → Data controls → Clear all local data. This permanently removes everything Safari Lab has stored on this device, so export a backup first if you want to keep it.',
    ],
  },
  {
    category: 'Offline & install',
    q: 'Does Safari Lab work offline?',
    keywords: 'offline no connection service worker pwa',
    a: [
      'Yes — once it has loaded, Safari Lab keeps working without a connection: gym mode, your program, the exercise library and progress all run on your device. Only the very first load needs the internet.',
    ],
  },
  {
    category: 'Offline & install',
    q: 'Can I install it like an app?',
    keywords: 'install pwa add to home screen app icon',
    a: [
      'Yes. In most browsers you can Install / Add to Home Screen to run Safari Lab full-screen with its own icon. It’s a Progressive Web App, so there’s no app store needed.',
    ],
  },
  {
    category: 'Troubleshooting',
    q: 'My data disappeared',
    keywords: 'lost data disappeared cleared browser private mode',
    a: [
      'Local data is tied to this browser on this device. Clearing your browser storage, using private/incognito mode, or switching browsers will lose it unless you have a save file. Import your latest .slfit to restore.',
    ],
  },
  {
    category: 'Troubleshooting',
    q: 'A save file won’t import',
    keywords: 'import failed corrupt invalid slfit error',
    a: [
      'Safari Lab checks every file before touching your data. If it’s declined, the file may be corrupt, from another app, or from a newer version. Nothing on your device changes. Try re-exporting a fresh file from the source device.',
    ],
  },
];
