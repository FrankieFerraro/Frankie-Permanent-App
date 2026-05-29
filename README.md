# Frankie 2.0 GitHub PWA

A static, mobile-first app-style version of Frankie 2.0. It is designed to run on GitHub Pages or any static host.

## What works
- Home dashboard with Message of the Day
- Daily Score linked to checklist completion
- Slow premium flame/streak display
- Working daily checklist with local saving
- Working Notes tab with Today, All Notes and Calendar
- 25 seeded test notes for usability testing
- Working Wins/Achievement List with headings, subheadings and tasks
- Mentor prompts
- Stats
- Settings, backup and restore

## Data
Data is stored locally in the browser using localStorage. Frankie and Jade will each have their own data on their own phone. This version does not yet sync between phones.

## GitHub Pages steps
1. Create a new GitHub repository.
2. Upload all files in this folder to the root of the repository.
3. Go to Settings > Pages.
4. Set Source to Deploy from branch.
5. Choose main branch and /root.
6. Open the published Pages URL on iPhone Safari.
7. Tap Share > Add to Home Screen.

## Important
This is a permanent app-style prototype, not an App Store native app. It is the best free/fast path for daily use while the full native app is developed later.


V1.1 polish notes
- Daily Checklist includes pencil and trash emoji buttons like the Manus design.
- Wins tasks also include pencil and trash buttons.
- Flame animation slowed down and streak number kept integrated inside the flame.
- Extra emoji cues added across Wins and Notes for a smoother app-like feel.


V1.3 updates
- Phoenix streak intro animation added
- Shows streak in a center-screen animation then disappears


V1.4 updates
- Calendar layout tightened to stop horizontal overflow
- Stats spacing fixed
- Bottom duplicate Shared Streak card removed
- Partner Last Active card added
- Mentor responses now open in themed dropdown cards instead of old alert boxes


V1.5 updates
- Added first version of long-press drag and reorder in Wins
- Tasks can be moved between main headings and subheadings
- Subheadings and main heading cards can also be reordered


V1.6 updates
- Wins add buttons now create inline editable rows instead of pop-ups
- Main headings, subheadings and tasks can be edited directly by tapping the text
- Pencil button now focuses the task text instead of opening a prompt


V1.7 updates
- Added main heading count to Wins
- Made heading/subheading delete buttons more compact
- Deleting a subheading now keeps its tasks by moving them under the main heading
- Deleting a main heading now moves its content into a safe Moved Items section instead of deleting everything


V1.8 updates
- Replaced the Message of the Day library with the higher-standard Frankie-built quote set
- Added a larger daily rotation library
- Message changes automatically once per day without a New button


V1.9 updates
- Added permanent Water Intake tracker to Home
- Water counts as one daily checklist task
- 10 droplets represent 2.5L total, 250ml each
- Tapping a droplet fills all previous droplets automatically


V2.0 updates
- Replaced CSS flame with extracted flame asset from the supplied screenshot
- Streak number now overlays the exact flame style


V2.1 updates
- Re-captured the exact flame asset with the full bottom/base included
- Removed leftover card/background edges from the flame PNG transparency


V2.2 updates
- Added Finance tab
- Added payslip logging with pay date, period, employer, hours, gross, net, tax, super, notes and attachment
- Added quick pay calculator with multiple lines
- Added saved rates for Frankie/Jade
- Added income insights for 4, 13, 26, all-time and custom weekly averages


V2.3 updates
- Water droplets can now be tapped or swiped left/right
- Sliding across droplets fills or reduces water live as your finger moves


V2.4 updates
- Daily Checklist now uses inline editing instead of prompt pop-ups
- Plus button sits beside the Daily Checklist title and instantly adds a new task
- New tasks focus automatically so you can type straight away
- Pencil icon removed from checklist rows because tapping the text edits directly


V2.5 updates
- Settings redesigned into cleaner grouped sections inspired by Claude’s layout
- Sections now grouped into Profile, App, Data and About
- Reduced visual clutter and made rows feel more premium/app-like
