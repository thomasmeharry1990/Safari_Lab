/**
 * Safari Lab - seed exercise library (v1.2 Bible Section 3.2, EX-001..EX-139).
 *
 * Compact rows expanded by defineExercise(). IDs are STABLE - never change an
 * existing EX-xxx id once released. Add new exercises with new ids only.
 * `pattern` already holds the nearest canonical v1.4 MovementPattern.
 */
import { defineExercise, type Seed } from './factory';
import type { ExerciseDefinition } from '@/lib/models/exercise';

const ROWS: Seed[] = [
  // --- Chest ---
  { id: 'EX-001', name: 'Barbell Bench Press', primary: 'chest', secondary: ['front_delts', 'triceps'], pattern: 'horizontal_push', equipment: ['barbell', 'bench'], level: 'intermediate', d: [3, 5, 3, 10], swap: 'bench-press', pos: 'lying', cues: ['Set your shoulder blades down and back', 'Lower the bar to your lower chest', 'Drive your feet into the floor'] },
  { id: 'EX-002', name: 'Dumbbell Bench Press', primary: 'chest', secondary: ['front_delts', 'triceps'], pattern: 'horizontal_push', equipment: ['dumbbells', 'bench'], level: 'beginner', d: [3, 4, 6, 12], swap: 'bench-press', pos: 'lying' },
  { id: 'EX-003', name: 'Incline Dumbbell Press', primary: 'chest', secondary: ['front_delts', 'triceps'], pattern: 'horizontal_push', equipment: ['dumbbells', 'bench'], level: 'beginner', d: [3, 4, 8, 12], swap: 'incline-press', pos: 'lying' },
  { id: 'EX-004', name: 'Incline Barbell Press', primary: 'chest', secondary: ['front_delts', 'triceps'], pattern: 'horizontal_push', equipment: ['barbell', 'bench'], level: 'intermediate', d: [3, 5, 5, 10], swap: 'incline-press', pos: 'lying' },
  { id: 'EX-005', name: 'Machine Chest Press', primary: 'chest', secondary: ['triceps'], pattern: 'horizontal_push', equipment: ['machine'], level: 'beginner', d: [3, 4, 8, 15], swap: 'machine-chest-press', pos: 'seated' },
  { id: 'EX-006', name: 'Smith Machine Bench Press', primary: 'chest', secondary: ['triceps'], pattern: 'horizontal_push', equipment: ['smith', 'bench'], level: 'beginner', d: [3, 4, 6, 12], swap: 'bench-press', pos: 'lying' },
  { id: 'EX-007', name: 'Push-Up', primary: 'chest', secondary: ['triceps', 'core'], pattern: 'horizontal_push', equipment: ['bodyweight'], level: 'beginner', d: [2, 4, 8, 20], swap: 'push-up', pos: 'mixed' },
  { id: 'EX-008', name: 'Weighted Push-Up', primary: 'chest', secondary: ['triceps', 'core'], pattern: 'horizontal_push', equipment: ['bodyweight', 'plate'], level: 'advanced', d: [3, 4, 6, 12], swap: 'push-up', pos: 'mixed' },
  { id: 'EX-009', name: 'Cable Fly', primary: 'chest', pattern: 'horizontal_push', equipment: ['cable'], level: 'beginner', d: [2, 4, 10, 20], swap: 'chest-fly', iso: true },
  { id: 'EX-010', name: 'Pec Deck', primary: 'chest', pattern: 'horizontal_push', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 20], swap: 'chest-fly', iso: true, pos: 'seated' },
  { id: 'EX-011', name: 'Dumbbell Fly', primary: 'chest', pattern: 'horizontal_push', equipment: ['dumbbells', 'bench'], level: 'intermediate', d: [2, 3, 10, 15], swap: 'chest-fly', iso: true, pos: 'lying' },
  { id: 'EX-012', name: 'Low-to-High Cable Fly', primary: 'chest', pattern: 'horizontal_push', equipment: ['cable'], level: 'beginner', d: [2, 4, 12, 20], swap: 'incline-fly', iso: true },
  { id: 'EX-013', name: 'Dips - Chest Bias', primary: 'chest', secondary: ['triceps', 'front_delts'], pattern: 'vertical_push', equipment: ['bodyweight', 'dip-bars'], level: 'advanced', d: [3, 4, 6, 12], swap: 'dip', pos: 'mixed' },
  { id: 'EX-014', name: 'Machine Incline Press', primary: 'chest', secondary: ['front_delts', 'triceps'], pattern: 'horizontal_push', equipment: ['machine'], level: 'beginner', d: [3, 4, 8, 15], swap: 'incline-press', pos: 'seated' },
  { id: 'EX-015', name: 'Landmine Press', primary: 'chest', secondary: ['front_delts', 'triceps'], pattern: 'horizontal_push', equipment: ['barbell', 'landmine'], level: 'intermediate', d: [3, 4, 8, 12], swap: 'landmine-press' },

  // --- Back and Lats ---
  { id: 'EX-016', name: 'Pull-Up', primary: 'lats', secondary: ['biceps', 'upper_back'], pattern: 'vertical_pull', equipment: ['bodyweight', 'pullup-bar'], level: 'intermediate', d: [3, 5, 4, 10], swap: 'vertical-pull', pos: 'mixed', cues: ['Start from a dead hang', 'Drive your elbows down and back', 'Pull your chest toward the bar'] },
  { id: 'EX-017', name: 'Assisted Pull-Up', primary: 'lats', secondary: ['biceps'], pattern: 'vertical_pull', equipment: ['machine', 'pullup-bar'], level: 'beginner', d: [3, 4, 6, 12], swap: 'vertical-pull', pos: 'mixed' },
  { id: 'EX-018', name: 'Lat Pulldown', primary: 'lats', secondary: ['biceps'], pattern: 'vertical_pull', equipment: ['cable', 'machine'], level: 'beginner', d: [3, 4, 8, 15], swap: 'vertical-pull', pos: 'seated' },
  { id: 'EX-019', name: 'Neutral Grip Pulldown', primary: 'lats', secondary: ['biceps'], pattern: 'vertical_pull', equipment: ['cable', 'machine'], level: 'beginner', d: [3, 4, 8, 15], swap: 'vertical-pull', pos: 'seated' },
  { id: 'EX-020', name: 'Seated Cable Row', primary: 'upper_back', secondary: ['lats', 'biceps'], pattern: 'horizontal_pull', equipment: ['cable'], level: 'beginner', d: [3, 4, 8, 15], swap: 'row', pos: 'seated' },
  { id: 'EX-021', name: 'Chest Supported Dumbbell Row', primary: 'upper_back', secondary: ['lats', 'biceps'], pattern: 'horizontal_pull', equipment: ['dumbbells', 'bench'], level: 'beginner', d: [3, 4, 8, 12], swap: 'row', pos: 'supported' },
  { id: 'EX-022', name: 'One Arm Dumbbell Row', primary: 'lats', secondary: ['upper_back', 'biceps'], pattern: 'horizontal_pull', equipment: ['dumbbell', 'bench'], level: 'beginner', d: [3, 4, 8, 12], swap: 'row', uni: true, pos: 'supported' },
  { id: 'EX-023', name: 'Barbell Bent-Over Row', primary: 'upper_back', secondary: ['lats', 'biceps', 'lower_back'], pattern: 'horizontal_pull', equipment: ['barbell'], level: 'intermediate', d: [3, 5, 5, 10], swap: 'row', cues: ['Hinge to a strong flat-back position', 'Row to your lower ribs', 'Keep your neck neutral'] },
  { id: 'EX-024', name: 'Pendlay Row', primary: 'upper_back', secondary: ['lats', 'biceps'], pattern: 'horizontal_pull', equipment: ['barbell'], level: 'advanced', d: [3, 5, 3, 8], swap: 'row' },
  { id: 'EX-025', name: 'Machine Row', primary: 'upper_back', secondary: ['lats', 'biceps'], pattern: 'horizontal_pull', equipment: ['machine'], level: 'beginner', d: [3, 4, 8, 15], swap: 'row', pos: 'seated' },
  { id: 'EX-026', name: 'T-Bar Row', primary: 'upper_back', secondary: ['lats', 'biceps'], pattern: 'horizontal_pull', equipment: ['machine', 'barbell'], level: 'intermediate', d: [3, 4, 6, 12], swap: 'row' },
  { id: 'EX-027', name: 'Straight Arm Pulldown', primary: 'lats', pattern: 'vertical_pull', equipment: ['cable'], level: 'beginner', d: [2, 4, 10, 20], swap: 'lat-isolation', iso: true },
  { id: 'EX-028', name: 'Cable Pullover', primary: 'lats', pattern: 'vertical_pull', equipment: ['cable'], level: 'beginner', d: [2, 4, 10, 20], swap: 'lat-isolation', iso: true },
  { id: 'EX-029', name: 'Inverted Row', primary: 'upper_back', secondary: ['lats', 'biceps'], pattern: 'horizontal_pull', equipment: ['bodyweight', 'bar'], level: 'beginner', d: [2, 4, 8, 15], swap: 'row', pos: 'mixed' },
  { id: 'EX-030', name: 'Meadows Row', primary: 'lats', secondary: ['upper_back', 'biceps'], pattern: 'horizontal_pull', equipment: ['barbell', 'landmine'], level: 'advanced', d: [3, 4, 8, 12], swap: 'row', uni: true },
  { id: 'EX-031', name: 'Rack Pull', primary: 'lats', secondary: ['traps', 'hamstrings', 'lower_back'], pattern: 'hinge', equipment: ['barbell'], level: 'advanced', d: [2, 4, 3, 8], swap: 'deadlift-variant', plate: true },
  { id: 'EX-032', name: 'Deadlift', primary: 'hamstrings', secondary: ['glutes', 'lats', 'lower_back', 'traps'], pattern: 'hinge', equipment: ['barbell'], level: 'advanced', d: [2, 5, 2, 6], swap: 'deadlift-variant', plate: true, cues: ['Take the slack out of the bar', 'Push the floor away', 'Keep the bar close to your body'] },

  // --- Shoulders and Delts ---
  { id: 'EX-033', name: 'Standing Barbell Overhead Press', primary: 'front_delts', secondary: ['side_delts', 'triceps'], pattern: 'vertical_push', equipment: ['barbell'], level: 'intermediate', d: [3, 5, 3, 8], swap: 'overhead-press', plate: true, cues: ['Brace your core and squeeze your glutes', 'Press the bar in a straight line', 'Move your head through at lockout'] },
  { id: 'EX-034', name: 'Seated Dumbbell Shoulder Press', primary: 'front_delts', secondary: ['side_delts', 'triceps'], pattern: 'vertical_push', equipment: ['dumbbells', 'bench'], level: 'beginner', d: [3, 4, 6, 12], swap: 'overhead-press', pos: 'seated' },
  { id: 'EX-035', name: 'Machine Shoulder Press', primary: 'front_delts', secondary: ['triceps'], pattern: 'vertical_push', equipment: ['machine'], level: 'beginner', d: [3, 4, 8, 15], swap: 'overhead-press', pos: 'seated' },
  { id: 'EX-036', name: 'Arnold Press', primary: 'front_delts', secondary: ['side_delts', 'triceps'], pattern: 'vertical_push', equipment: ['dumbbells'], level: 'intermediate', d: [2, 4, 8, 12], swap: 'overhead-press', pos: 'seated' },
  { id: 'EX-037', name: 'Dumbbell Lateral Raise', primary: 'side_delts', pattern: 'lateral_raise', equipment: ['dumbbells'], level: 'beginner', d: [3, 5, 10, 25], swap: 'side-delt', iso: true },
  { id: 'EX-038', name: 'Cable Lateral Raise', primary: 'side_delts', pattern: 'lateral_raise', equipment: ['cable'], level: 'beginner', d: [3, 5, 10, 25], swap: 'side-delt', iso: true, uni: true },
  { id: 'EX-039', name: 'Machine Lateral Raise', primary: 'side_delts', pattern: 'lateral_raise', equipment: ['machine'], level: 'beginner', d: [3, 5, 10, 25], swap: 'side-delt', iso: true, pos: 'seated' },
  { id: 'EX-040', name: 'Rear Delt Fly', primary: 'rear_delts', pattern: 'rear_delt', equipment: ['dumbbells', 'bench'], level: 'beginner', d: [2, 4, 12, 20], swap: 'rear-delt', iso: true, pos: 'supported' },
  { id: 'EX-041', name: 'Reverse Pec Deck', primary: 'rear_delts', pattern: 'rear_delt', equipment: ['machine'], level: 'beginner', d: [2, 4, 12, 20], swap: 'rear-delt', iso: true, pos: 'seated' },
  { id: 'EX-042', name: 'Face Pull', primary: 'rear_delts', secondary: ['traps'], pattern: 'rear_delt', equipment: ['cable', 'rope'], level: 'beginner', d: [2, 4, 12, 20], swap: 'rear-delt', iso: true },
  { id: 'EX-043', name: 'Cable Rear Delt Row', primary: 'rear_delts', pattern: 'rear_delt', equipment: ['cable'], level: 'beginner', d: [2, 4, 10, 15], swap: 'rear-delt', iso: true },
  { id: 'EX-044', name: 'Front Raise', primary: 'front_delts', pattern: 'lateral_raise', equipment: ['dumbbells', 'plate'], level: 'beginner', d: [2, 3, 10, 15], swap: 'front-delt', iso: true },
  { id: 'EX-045', name: 'Upright Row', primary: 'side_delts', secondary: ['traps'], pattern: 'vertical_pull', equipment: ['cable', 'barbell'], level: 'intermediate', d: [2, 3, 8, 12], swap: 'delt-trap', iso: true },
  { id: 'EX-046', name: 'Shrug', primary: 'traps', pattern: 'vertical_pull', equipment: ['dumbbell', 'barbell', 'machine'], level: 'beginner', d: [2, 4, 8, 15], swap: 'shrug', iso: true },

  // --- Biceps and Forearms ---
  { id: 'EX-047', name: 'Barbell Curl', primary: 'biceps', pattern: 'curl', equipment: ['barbell'], level: 'beginner', d: [2, 4, 6, 12], swap: 'biceps-curl', iso: true },
  { id: 'EX-048', name: 'EZ Bar Curl', primary: 'biceps', pattern: 'curl', equipment: ['ez-bar'], level: 'beginner', d: [2, 4, 8, 12], swap: 'biceps-curl', iso: true },
  { id: 'EX-049', name: 'Dumbbell Curl', primary: 'biceps', pattern: 'curl', equipment: ['dumbbells'], level: 'beginner', d: [2, 4, 8, 12], swap: 'biceps-curl', iso: true },
  { id: 'EX-050', name: 'Incline Dumbbell Curl', primary: 'biceps', pattern: 'curl', equipment: ['dumbbells', 'bench'], level: 'intermediate', d: [2, 4, 8, 15], swap: 'biceps-curl', iso: true, pos: 'seated' },
  { id: 'EX-051', name: 'Hammer Curl', primary: 'biceps', secondary: ['forearms'], pattern: 'curl', equipment: ['dumbbells'], level: 'beginner', d: [2, 4, 8, 15], swap: 'hammer-curl', iso: true },
  { id: 'EX-052', name: 'Cable Curl', primary: 'biceps', pattern: 'curl', equipment: ['cable'], level: 'beginner', d: [2, 4, 10, 15], swap: 'biceps-curl', iso: true },
  { id: 'EX-053', name: 'Preacher Curl', primary: 'biceps', pattern: 'curl', equipment: ['machine', 'ez-bar'], level: 'beginner', d: [2, 4, 8, 15], swap: 'preacher-curl', iso: true, pos: 'seated' },
  { id: 'EX-054', name: 'Bayesian Cable Curl', primary: 'biceps', pattern: 'curl', equipment: ['cable'], level: 'intermediate', d: [2, 4, 10, 15], swap: 'biceps-curl', iso: true },
  { id: 'EX-055', name: 'Concentration Curl', primary: 'biceps', pattern: 'curl', equipment: ['dumbbell'], level: 'beginner', d: [2, 3, 10, 15], swap: 'biceps-curl', iso: true, uni: true, pos: 'seated' },
  { id: 'EX-056', name: 'Reverse Curl', primary: 'forearms', secondary: ['biceps'], pattern: 'curl', equipment: ['ez-bar', 'barbell'], level: 'beginner', d: [2, 3, 10, 15], swap: 'forearm', iso: true },
  { id: 'EX-057', name: 'Wrist Curl', primary: 'forearms', pattern: 'curl', equipment: ['dumbbell', 'barbell'], level: 'beginner', d: [2, 3, 12, 20], swap: 'forearm', iso: true, pos: 'seated' },
  { id: 'EX-058', name: 'Farmer Carry', primary: 'forearms', secondary: ['traps', 'core'], pattern: 'carry', equipment: ['dumbbells', 'kettlebells'], level: 'beginner', d: [2, 4, 20, 60], swap: 'carry' },

  // --- Triceps ---
  { id: 'EX-059', name: 'Cable Rope Pushdown', primary: 'triceps', pattern: 'extension', equipment: ['cable', 'rope'], level: 'beginner', d: [2, 4, 10, 20], swap: 'triceps-pushdown', iso: true },
  { id: 'EX-060', name: 'Straight Bar Pushdown', primary: 'triceps', pattern: 'extension', equipment: ['cable', 'bar'], level: 'beginner', d: [2, 4, 10, 20], swap: 'triceps-pushdown', iso: true },
  { id: 'EX-061', name: 'Overhead Cable Extension', primary: 'triceps', pattern: 'extension', equipment: ['cable', 'rope'], level: 'beginner', d: [2, 4, 10, 15], swap: 'overhead-triceps', iso: true },
  { id: 'EX-062', name: 'Dumbbell Overhead Extension', primary: 'triceps', pattern: 'extension', equipment: ['dumbbell'], level: 'beginner', d: [2, 4, 10, 15], swap: 'overhead-triceps', iso: true },
  { id: 'EX-063', name: 'Skull Crusher', primary: 'triceps', pattern: 'extension', equipment: ['ez-bar', 'dumbbells'], level: 'intermediate', d: [2, 4, 8, 12], swap: 'skull-crusher', iso: true, pos: 'lying' },
  { id: 'EX-064', name: 'Close Grip Bench Press', primary: 'triceps', secondary: ['chest', 'front_delts'], pattern: 'horizontal_push', equipment: ['barbell', 'bench'], level: 'intermediate', d: [3, 4, 5, 10], swap: 'triceps-press', pos: 'lying', plate: true },
  { id: 'EX-065', name: 'Dip - Triceps Bias', primary: 'triceps', secondary: ['chest'], pattern: 'vertical_push', equipment: ['bodyweight', 'dip-bars'], level: 'advanced', d: [3, 4, 6, 12], swap: 'dip', pos: 'mixed' },
  { id: 'EX-066', name: 'Machine Triceps Extension', primary: 'triceps', pattern: 'extension', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 15], swap: 'triceps-extension', iso: true, pos: 'seated' },
  { id: 'EX-067', name: 'Single Arm Cable Pushdown', primary: 'triceps', pattern: 'extension', equipment: ['cable'], level: 'beginner', d: [2, 4, 10, 15], swap: 'triceps-pushdown', iso: true, uni: true },
  { id: 'EX-068', name: 'Bench Dip', primary: 'triceps', pattern: 'extension', equipment: ['bodyweight', 'bench'], level: 'beginner', d: [2, 3, 8, 15], swap: 'dip', iso: true, pos: 'mixed' },

  // --- Quads ---
  { id: 'EX-069', name: 'Barbell Back Squat', primary: 'quads', secondary: ['glutes', 'hamstrings'], pattern: 'squat', equipment: ['barbell', 'rack'], level: 'intermediate', d: [3, 5, 3, 10], swap: 'squat', plate: true, cues: ['Brace hard before you unrack', 'Sit down between your hips', 'Drive up through mid-foot'] },
  { id: 'EX-070', name: 'Front Squat', primary: 'quads', secondary: ['glutes', 'core'], pattern: 'squat', equipment: ['barbell', 'rack'], level: 'advanced', d: [3, 5, 3, 8], swap: 'squat', plate: true },
  { id: 'EX-071', name: 'Goblet Squat', primary: 'quads', secondary: ['glutes'], pattern: 'squat', equipment: ['dumbbell', 'kettlebell'], level: 'beginner', d: [3, 4, 8, 15], swap: 'squat' },
  { id: 'EX-072', name: 'Leg Press', primary: 'quads', secondary: ['glutes'], pattern: 'squat', equipment: ['machine'], level: 'beginner', d: [3, 5, 8, 15], swap: 'leg-press', pos: 'seated' },
  { id: 'EX-073', name: 'Hack Squat', primary: 'quads', secondary: ['glutes'], pattern: 'squat', equipment: ['machine'], level: 'intermediate', d: [3, 5, 6, 12], swap: 'squat-machine' },
  { id: 'EX-074', name: 'Smith Machine Squat', primary: 'quads', secondary: ['glutes'], pattern: 'squat', equipment: ['smith'], level: 'beginner', d: [3, 4, 8, 12], swap: 'squat' },
  { id: 'EX-075', name: 'Bulgarian Split Squat', primary: 'quads', secondary: ['glutes'], pattern: 'lunge', equipment: ['dumbbells', 'bench'], level: 'intermediate', d: [3, 4, 8, 12], swap: 'single-leg-squat', uni: true },
  { id: 'EX-076', name: 'Walking Lunge', primary: 'quads', secondary: ['glutes'], pattern: 'lunge', equipment: ['dumbbells'], level: 'beginner', d: [2, 4, 10, 16], swap: 'lunge', uni: true },
  { id: 'EX-077', name: 'Reverse Lunge', primary: 'quads', secondary: ['glutes'], pattern: 'lunge', equipment: ['dumbbells', 'bodyweight'], level: 'beginner', d: [2, 4, 8, 12], swap: 'lunge', uni: true },
  { id: 'EX-078', name: 'Step-Up', primary: 'quads', secondary: ['glutes'], pattern: 'lunge', equipment: ['dumbbells', 'box'], level: 'beginner', d: [2, 4, 8, 12], swap: 'single-leg-squat', uni: true },
  { id: 'EX-079', name: 'Leg Extension', primary: 'quads', pattern: 'extension', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 20], swap: 'leg-extension', iso: true, pos: 'seated' },
  { id: 'EX-080', name: 'Sissy Squat', primary: 'quads', pattern: 'squat', equipment: ['bodyweight', 'machine'], level: 'advanced', d: [2, 4, 8, 15], swap: 'knee-dominant', iso: true },
  { id: 'EX-081', name: 'Split Squat', primary: 'quads', secondary: ['glutes'], pattern: 'lunge', equipment: ['dumbbells', 'bodyweight'], level: 'beginner', d: [2, 4, 8, 12], swap: 'lunge', uni: true },
  { id: 'EX-082', name: 'Belt Squat', primary: 'quads', secondary: ['glutes'], pattern: 'squat', equipment: ['machine'], level: 'beginner', d: [3, 5, 8, 15], swap: 'squat-machine' },

  // --- Hamstrings ---
  { id: 'EX-083', name: 'Romanian Deadlift', primary: 'hamstrings', secondary: ['glutes', 'lower_back'], pattern: 'hinge', equipment: ['barbell'], level: 'intermediate', d: [3, 5, 5, 10], swap: 'hinge', plate: true, cues: ['Push your hips back, soft knees', 'Keep the bar against your legs', 'Stop when you feel a deep hamstring stretch'] },
  { id: 'EX-084', name: 'Dumbbell Romanian Deadlift', primary: 'hamstrings', secondary: ['glutes'], pattern: 'hinge', equipment: ['dumbbells'], level: 'beginner', d: [3, 4, 8, 12], swap: 'hinge' },
  { id: 'EX-085', name: 'Seated Leg Curl', primary: 'hamstrings', pattern: 'knee_flexion', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 20], swap: 'leg-curl', iso: true, pos: 'seated' },
  { id: 'EX-086', name: 'Lying Leg Curl', primary: 'hamstrings', pattern: 'knee_flexion', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 20], swap: 'leg-curl', iso: true, pos: 'lying' },
  { id: 'EX-087', name: 'Standing Leg Curl', primary: 'hamstrings', pattern: 'knee_flexion', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 15], swap: 'leg-curl', iso: true, uni: true },
  { id: 'EX-088', name: 'Nordic Hamstring Curl', primary: 'hamstrings', pattern: 'knee_flexion', equipment: ['bodyweight'], level: 'advanced', d: [2, 4, 3, 8], swap: 'nordic', pos: 'kneeling' },
  { id: 'EX-089', name: 'Good Morning', primary: 'hamstrings', secondary: ['glutes', 'lower_back'], pattern: 'hinge', equipment: ['barbell'], level: 'advanced', d: [2, 4, 6, 10], swap: 'hinge', plate: true },
  { id: 'EX-090', name: 'Glute Ham Raise', primary: 'hamstrings', secondary: ['glutes'], pattern: 'knee_flexion', equipment: ['machine'], level: 'advanced', d: [2, 4, 6, 12], swap: 'nordic' },
  { id: 'EX-091', name: 'Cable Pull-Through', primary: 'hamstrings', secondary: ['glutes'], pattern: 'hinge', equipment: ['cable', 'rope'], level: 'beginner', d: [2, 4, 10, 15], swap: 'hinge' },
  { id: 'EX-092', name: 'Single-Leg RDL', primary: 'hamstrings', secondary: ['glutes'], pattern: 'hinge', equipment: ['dumbbells'], level: 'intermediate', d: [2, 4, 8, 12], swap: 'single-leg-hinge', uni: true },
  { id: 'EX-093', name: 'Back Extension - Hamstring Bias', primary: 'hamstrings', secondary: ['glutes', 'lower_back'], pattern: 'hinge', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 15], swap: 'back-extension' },

  // --- Glutes ---
  { id: 'EX-094', name: 'Barbell Hip Thrust', primary: 'glutes', secondary: ['hamstrings'], pattern: 'hip_thrust', equipment: ['barbell', 'bench'], level: 'beginner', d: [3, 5, 6, 12], swap: 'hip-thrust', pos: 'supported', plate: true, cues: ['Tuck your chin and ribs down', 'Drive through your heels', 'Squeeze glutes hard at lockout'] },
  { id: 'EX-095', name: 'Smith Machine Hip Thrust', primary: 'glutes', secondary: ['hamstrings'], pattern: 'hip_thrust', equipment: ['smith', 'bench'], level: 'beginner', d: [3, 5, 8, 12], swap: 'hip-thrust', pos: 'supported' },
  { id: 'EX-096', name: 'Dumbbell Hip Thrust', primary: 'glutes', secondary: ['hamstrings'], pattern: 'hip_thrust', equipment: ['dumbbell', 'bench'], level: 'beginner', d: [3, 4, 10, 15], swap: 'hip-thrust', pos: 'supported' },
  { id: 'EX-097', name: 'Glute Bridge', primary: 'glutes', secondary: ['hamstrings'], pattern: 'hip_thrust', equipment: ['bodyweight', 'barbell'], level: 'beginner', d: [2, 4, 10, 20], swap: 'bridge', pos: 'lying' },
  { id: 'EX-098', name: 'Cable Kickback', primary: 'glutes', pattern: 'hip_thrust', equipment: ['cable', 'ankle-strap'], level: 'beginner', d: [2, 4, 12, 20], swap: 'kickback', iso: true, uni: true },
  { id: 'EX-099', name: 'Machine Glute Kickback', primary: 'glutes', pattern: 'hip_thrust', equipment: ['machine'], level: 'beginner', d: [2, 4, 12, 20], swap: 'kickback', iso: true, uni: true },
  { id: 'EX-100', name: '45 Degree Back Extension - Glute Bias', primary: 'glutes', secondary: ['hamstrings'], pattern: 'hip_thrust', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 15], swap: 'back-extension' },
  { id: 'EX-101', name: 'Sumo Deadlift', primary: 'glutes', secondary: ['hamstrings', 'quads', 'lower_back'], pattern: 'hinge', equipment: ['barbell'], level: 'advanced', d: [2, 5, 3, 8], swap: 'deadlift-variant', plate: true },
  { id: 'EX-102', name: 'Kettlebell Swing', primary: 'glutes', secondary: ['hamstrings'], pattern: 'hinge', equipment: ['kettlebell'], level: 'intermediate', d: [3, 5, 10, 20], swap: 'swing', prog: 'reps' },
  { id: 'EX-103', name: 'Cable Pull-Through (Glute Bias)', primary: 'glutes', secondary: ['hamstrings'], pattern: 'hinge', equipment: ['cable', 'rope'], level: 'beginner', d: [2, 4, 10, 15], swap: 'hinge', slug: 'cable-pull-through-glute-bias' },
  { id: 'EX-104', name: 'Hip Abduction Machine', primary: 'abductors', secondary: ['glutes'], pattern: 'hip_thrust', equipment: ['machine'], level: 'beginner', d: [2, 5, 12, 25], swap: 'abduction', iso: true, pos: 'seated' },
  { id: 'EX-105', name: 'Banded Lateral Walk', primary: 'abductors', secondary: ['glutes'], pattern: 'hip_thrust', equipment: ['band'], level: 'beginner', d: [2, 4, 12, 20], swap: 'abduction', iso: true },
  { id: 'EX-106', name: 'Frog Pump', primary: 'glutes', pattern: 'hip_thrust', equipment: ['bodyweight', 'band'], level: 'beginner', d: [2, 4, 15, 30], swap: 'bridge', pos: 'lying' },
  { id: 'EX-107', name: 'Curtsy Lunge', primary: 'glutes', secondary: ['quads', 'abductors'], pattern: 'lunge', equipment: ['dumbbells', 'bodyweight'], level: 'intermediate', d: [2, 4, 8, 12], swap: 'lunge', uni: true },
  { id: 'EX-108', name: 'Cable Hip Abduction', primary: 'abductors', secondary: ['glutes'], pattern: 'hip_thrust', equipment: ['cable', 'ankle-strap'], level: 'beginner', d: [2, 4, 12, 20], swap: 'abduction', iso: true, uni: true },

  // --- Calves and Lower Leg ---
  { id: 'EX-109', name: 'Standing Calf Raise', primary: 'calves', pattern: 'calf_raise', equipment: ['machine'], level: 'beginner', d: [3, 5, 8, 15], swap: 'calf-raise', iso: true },
  { id: 'EX-110', name: 'Seated Calf Raise', primary: 'calves', pattern: 'calf_raise', equipment: ['machine'], level: 'beginner', d: [3, 5, 10, 20], swap: 'calf-raise', iso: true, pos: 'seated' },
  { id: 'EX-111', name: 'Leg Press Calf Raise', primary: 'calves', pattern: 'calf_raise', equipment: ['machine'], level: 'beginner', d: [3, 5, 10, 20], swap: 'calf-raise', iso: true, pos: 'seated' },
  { id: 'EX-112', name: 'Single-Leg Calf Raise', primary: 'calves', pattern: 'calf_raise', equipment: ['bodyweight', 'dumbbell'], level: 'beginner', d: [2, 4, 10, 20], swap: 'calf-raise', iso: true, uni: true },
  { id: 'EX-113', name: 'Tibialis Raise', primary: 'calves', pattern: 'calf_raise', equipment: ['bodyweight', 'machine'], level: 'beginner', d: [2, 4, 12, 25], swap: 'tibialis', iso: true },
  { id: 'EX-114', name: 'Donkey Calf Raise', primary: 'calves', pattern: 'calf_raise', equipment: ['machine', 'bodyweight'], level: 'intermediate', d: [3, 5, 10, 20], swap: 'calf-raise', iso: true },
  { id: 'EX-115', name: 'Jump Rope', primary: 'cardio', secondary: ['calves'], pattern: 'conditioning', equipment: ['rope'], level: 'beginner', d: [3, 10, 3, 10], swap: 'conditioning', timed: true },
  { id: 'EX-116', name: 'Sled Push', primary: 'cardio', secondary: ['quads', 'glutes'], pattern: 'conditioning', equipment: ['sled'], level: 'beginner', d: [3, 8, 10, 30], swap: 'sled', prog: 'distance' },

  // --- Core ---
  { id: 'EX-117', name: 'Plank', primary: 'core', pattern: 'anti_rotation', equipment: ['bodyweight'], level: 'beginner', d: [2, 4, 20, 60], swap: 'plank', timed: true, pos: 'mixed' },
  { id: 'EX-118', name: 'Side Plank', primary: 'core', secondary: ['obliques'], pattern: 'anti_rotation', equipment: ['bodyweight'], level: 'beginner', d: [2, 4, 20, 45], swap: 'side-plank', timed: true, uni: true, pos: 'mixed' },
  { id: 'EX-119', name: 'Dead Bug', primary: 'core', pattern: 'anti_rotation', equipment: ['bodyweight'], level: 'beginner', d: [2, 4, 8, 12], swap: 'anti-extension', pos: 'lying' },
  { id: 'EX-120', name: 'Pallof Press', primary: 'core', secondary: ['obliques'], pattern: 'anti_rotation', equipment: ['cable', 'band'], level: 'beginner', d: [2, 4, 8, 15], swap: 'anti-rotation', iso: true },
  { id: 'EX-121', name: 'Cable Crunch', primary: 'abs', pattern: 'core_flexion', equipment: ['cable'], level: 'beginner', d: [2, 4, 10, 20], swap: 'crunch', iso: true, pos: 'kneeling' },
  { id: 'EX-122', name: 'Machine Crunch', primary: 'abs', pattern: 'core_flexion', equipment: ['machine'], level: 'beginner', d: [2, 4, 10, 20], swap: 'crunch', iso: true, pos: 'seated' },
  { id: 'EX-123', name: 'Hanging Knee Raise', primary: 'abs', pattern: 'core_flexion', equipment: ['pullup-bar'], level: 'intermediate', d: [2, 4, 8, 15], swap: 'leg-raise', pos: 'mixed' },
  { id: 'EX-124', name: 'Hanging Leg Raise', primary: 'abs', pattern: 'core_flexion', equipment: ['pullup-bar'], level: 'advanced', d: [2, 4, 6, 12], swap: 'leg-raise', pos: 'mixed' },
  { id: 'EX-125', name: 'Reverse Crunch', primary: 'abs', pattern: 'core_flexion', equipment: ['bodyweight', 'bench'], level: 'beginner', d: [2, 4, 10, 20], swap: 'crunch', pos: 'lying' },
  { id: 'EX-126', name: 'Ab Wheel Rollout', primary: 'core', pattern: 'anti_rotation', equipment: ['ab-wheel'], level: 'advanced', d: [2, 4, 5, 12], swap: 'anti-extension', pos: 'kneeling' },
  { id: 'EX-127', name: 'Russian Twist', primary: 'obliques', secondary: ['abs'], pattern: 'core_flexion', equipment: ['bodyweight', 'medicine-ball'], level: 'beginner', d: [2, 4, 12, 20], swap: 'rotation', pos: 'seated' },
  { id: 'EX-128', name: 'Farmer Carry (Core)', primary: 'core', secondary: ['forearms', 'traps'], pattern: 'carry', equipment: ['dumbbells', 'kettlebells'], level: 'beginner', d: [2, 4, 20, 60], swap: 'carry', slug: 'farmer-carry-core' },
  { id: 'EX-129', name: 'Suitcase Carry', primary: 'core', secondary: ['obliques', 'forearms'], pattern: 'carry', equipment: ['dumbbell', 'kettlebell'], level: 'beginner', d: [2, 4, 20, 50], swap: 'carry', uni: true },

  // --- Conditioning and Mobility ---
  { id: 'EX-130', name: 'Battle Ropes', primary: 'cardio', secondary: ['side_delts'], pattern: 'conditioning', equipment: ['ropes'], level: 'beginner', d: [4, 10, 15, 30], swap: 'conditioning', timed: true },
  { id: 'EX-131', name: 'Row Ergometer', primary: 'cardio', pattern: 'conditioning', equipment: ['rower'], level: 'beginner', d: [1, 1, 5, 30], swap: 'conditioning', timed: true, pos: 'seated' },
  { id: 'EX-132', name: 'Assault Bike', primary: 'cardio', pattern: 'conditioning', equipment: ['bike'], level: 'beginner', d: [1, 1, 5, 20], swap: 'conditioning', timed: true, pos: 'seated' },
  { id: 'EX-133', name: 'Treadmill Incline Walk', primary: 'cardio', pattern: 'conditioning', equipment: ['treadmill'], level: 'beginner', d: [1, 1, 10, 45], swap: 'conditioning', timed: true },
  { id: 'EX-134', name: 'Sled Drag', primary: 'cardio', secondary: ['hamstrings', 'quads'], pattern: 'conditioning', equipment: ['sled'], level: 'beginner', d: [3, 8, 10, 30], swap: 'sled', prog: 'distance' },
  { id: 'EX-135', name: "World's Greatest Stretch", primary: 'cardio', pattern: 'mobility', equipment: ['bodyweight'], level: 'beginner', d: [1, 3, 3, 5], swap: 'mobility', pos: 'mixed' },
  { id: 'EX-136', name: 'Hip Flexor Stretch', primary: 'cardio', pattern: 'mobility', equipment: ['bodyweight'], level: 'beginner', d: [1, 1, 30, 60], swap: 'mobility', timed: true, uni: true, pos: 'kneeling' },
  { id: 'EX-137', name: 'Band Pull-Apart', primary: 'rear_delts', pattern: 'mobility', equipment: ['band'], level: 'beginner', d: [2, 3, 15, 25], swap: 'warm-up' },
  { id: 'EX-138', name: 'Scapular Pull-Up', primary: 'lats', secondary: ['traps'], pattern: 'mobility', equipment: ['pullup-bar'], level: 'beginner', d: [2, 3, 5, 10], swap: 'warm-up', pos: 'mixed' },
  { id: 'EX-139', name: 'Bodyweight Squat Warm-Up', primary: 'quads', pattern: 'mobility', equipment: ['bodyweight'], level: 'beginner', d: [2, 3, 10, 15], swap: 'warm-up' },
];

export const SEED_EXERCISES: ExerciseDefinition[] = ROWS.map(defineExercise);
