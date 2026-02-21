export const DOMAINS = {
  sleep: {
    id: 'sleep',
    label: 'Sleep',
    emoji: '🌙',
    description: 'Rest, recovery and nighttime routines',
    color: '#B99CFF',
  },
  physical: {
    id: 'physical',
    label: 'Physical',
    emoji: '🌿',
    description: 'Body recovery and physical wellbeing',
    color: '#1CBE72',
  },
  mental: {
    id: 'mental',
    label: 'Mental',
    emoji: '☁️',
    description: 'Emotional health and mental wellbeing',
    color: '#F9F37E',
  },
  motherhood: {
    id: 'motherhood',
    label: 'Motherhood',
    emoji: '🌸',
    description: 'Bonding, confidence and adjusting to parenthood',
    color: '#FF9767',
  },
}

// Each question has 4 options scored 1-4 (1 = worst, 4 = best)
// Total per domain: 5 questions × max 4 = 20 points
// Superb: 17–20 | Good: 13–16 | Fair: 9–12 | Poor: 5–8

export const QUESTIONS = {
  sleep: [
    {
      id: 'sleep_1',
      text: 'How many hours of sleep are you getting in total across a day (including naps)?',
      options: [
        { label: 'Less than 3 hours', score: 1 },
        { label: '3–5 hours', score: 2 },
        { label: '5–7 hours', score: 3 },
        { label: 'More than 7 hours', score: 4 },
      ],
    },
    {
      id: 'sleep_2',
      text: 'How often are you waking up during the night?',
      options: [
        { label: 'More than 5 times — it feels relentless', score: 1 },
        { label: '3–5 times', score: 2 },
        { label: '1–2 times', score: 3 },
        { label: 'Rarely, I get longer stretches', score: 4 },
      ],
    },
    {
      id: 'sleep_3',
      text: 'How do you feel when you wake up in the morning?',
      options: [
        { label: 'Completely exhausted, like I didn\'t sleep at all', score: 1 },
        { label: 'Very tired — barely functioning', score: 2 },
        { label: 'A little tired, but I can manage', score: 3 },
        { label: 'Reasonably rested', score: 4 },
      ],
    },
    {
      id: 'sleep_4',
      text: 'How easy is it for you to fall back asleep after night feedings or settling?',
      options: [
        { label: 'Very hard — I lie awake for a long time', score: 1 },
        { label: 'Difficult — takes quite a while', score: 2 },
        { label: 'Somewhat manageable', score: 3 },
        { label: 'Pretty easy', score: 4 },
      ],
    },
    {
      id: 'sleep_5',
      text: 'Overall, how is lack of sleep affecting your daily life this week?',
      options: [
        { label: 'Significantly — I\'m struggling to function', score: 1 },
        { label: 'Quite a lot — it\'s really hard', score: 2 },
        { label: 'Somewhat — I\'m managing but it\'s tough', score: 3 },
        { label: 'Minimally — it\'s okay', score: 4 },
      ],
    },
  ],

  physical: [
    {
      id: 'physical_1',
      text: 'How would you describe your energy levels throughout the day?',
      options: [
        { label: 'I have almost no energy — just getting through the day is hard', score: 1 },
        { label: 'Very low — I\'m constantly drained', score: 2 },
        { label: 'Some energy, though I tire easily', score: 3 },
        { label: 'Decent energy for most of the day', score: 4 },
      ],
    },
    {
      id: 'physical_2',
      text: 'Are you experiencing any physical pain or discomfort?',
      options: [
        { label: 'Significant pain that\'s affecting my daily life', score: 1 },
        { label: 'Moderate pain — it\'s hard to ignore', score: 2 },
        { label: 'Mild discomfort that comes and goes', score: 3 },
        { label: 'Little to no discomfort', score: 4 },
      ],
    },
    {
      id: 'physical_3',
      text: 'How do you feel your body is recovering from birth?',
      options: [
        { label: 'I feel very far from recovered', score: 1 },
        { label: 'Recovery feels slow and difficult', score: 2 },
        { label: 'I can see progress, though it\'s gradual', score: 3 },
        { label: 'I\'m feeling good about my recovery', score: 4 },
      ],
    },
    {
      id: 'physical_4',
      text: 'How comfortable do you feel in your body right now?',
      options: [
        { label: 'Very uncomfortable — I feel disconnected from my body', score: 1 },
        { label: 'Mostly uncomfortable', score: 2 },
        { label: 'Somewhat okay, accepting changes slowly', score: 3 },
        { label: 'Comfortable — I\'m being kind to myself', score: 4 },
      ],
    },
    {
      id: 'physical_5',
      text: 'Are you able to take care of your basic daily needs (eating, hygiene, movement)?',
      options: [
        { label: 'No — I need significant help with basics', score: 1 },
        { label: 'Only with help', score: 2 },
        { label: 'Mostly, with some difficulty', score: 3 },
        { label: 'Yes, I\'m managing well', score: 4 },
      ],
    },
  ],

  mental: [
    {
      id: 'mental_1',
      text: 'How have you been feeling emotionally this week?',
      options: [
        { label: 'Very low, sad or empty most of the time', score: 1 },
        { label: 'Often sad or anxious', score: 2 },
        { label: 'Some ups and downs, but managing', score: 3 },
        { label: 'Mostly okay — even some good moments', score: 4 },
      ],
    },
    {
      id: 'mental_2',
      text: 'How often have you felt overwhelmed this week?',
      options: [
        { label: 'Almost constantly — it feels like too much', score: 1 },
        { label: 'Very often', score: 2 },
        { label: 'Sometimes, but I can usually regroup', score: 3 },
        { label: 'Rarely — I feel mostly in control', score: 4 },
      ],
    },
    {
      id: 'mental_3',
      text: 'How well are you coping with the pressures of new motherhood?',
      options: [
        { label: 'I\'m really not coping well', score: 1 },
        { label: 'Struggling significantly', score: 2 },
        { label: 'Managing, though it\'s challenging', score: 3 },
        { label: 'Coping fairly well', score: 4 },
      ],
    },
    {
      id: 'mental_4',
      text: 'Have you been able to find any moments of joy, calm or pleasure this week?',
      options: [
        { label: 'Not at all — nothing feels good right now', score: 1 },
        { label: 'Very rarely', score: 2 },
        { label: 'Occasionally', score: 3 },
        { label: 'Yes, I\'ve had some genuinely lovely moments', score: 4 },
      ],
    },
    {
      id: 'mental_5',
      text: 'How supported do you feel emotionally (by your partner, family, friends or others)?',
      options: [
        { label: 'Not supported at all — I feel alone in this', score: 1 },
        { label: 'Very little support', score: 2 },
        { label: 'Some support — it could be more', score: 3 },
        { label: 'Well supported', score: 4 },
      ],
    },
  ],

  motherhood: [
    {
      id: 'motherhood_1',
      text: 'How confident do you feel in your ability to care for your baby?',
      options: [
        { label: 'Not at all confident — I feel lost', score: 1 },
        { label: 'Lacking confidence often', score: 2 },
        { label: 'Growing in confidence, slowly', score: 3 },
        { label: 'Fairly confident overall', score: 4 },
      ],
    },
    {
      id: 'motherhood_2',
      text: 'How connected do you feel to your baby?',
      options: [
        { label: 'I\'m struggling to feel connected', score: 1 },
        { label: 'Connection feels minimal', score: 2 },
        { label: 'Building connection slowly', score: 3 },
        { label: 'I feel a strong connection', score: 4 },
      ],
    },
    {
      id: 'motherhood_3',
      text: 'How is feeding going overall (whether breastfeeding, bottle or formula)?',
      options: [
        { label: 'Very challenging and distressing', score: 1 },
        { label: 'Quite difficult', score: 2 },
        { label: 'Some challenges, but we\'re getting there', score: 3 },
        { label: 'Going fairly well', score: 4 },
      ],
    },
    {
      id: 'motherhood_4',
      text: 'How are you adjusting to your new identity as a mother?',
      options: [
        { label: 'Really struggling with who I am now', score: 1 },
        { label: 'Finding it very hard to adjust', score: 2 },
        { label: 'Slowly finding my footing', score: 3 },
        { label: 'Adjusting and feeling more like myself', score: 4 },
      ],
    },
    {
      id: 'motherhood_5',
      text: 'How supported do you feel in your role as a new parent?',
      options: [
        { label: 'Very unsupported — I feel like I\'m doing this alone', score: 1 },
        { label: 'Mostly unsupported', score: 2 },
        { label: 'Some support — I\'d welcome more', score: 3 },
        { label: 'Well supported', score: 4 },
      ],
    },
  ],
}

export const SCORE_THRESHOLDS = {
  superb: { min: 17, max: 20, label: 'Superb', color: '#7AFF71', bg: 'rgba(122, 255, 113, 0.15)' },
  good: { min: 13, max: 16, label: 'Good', color: '#1CBE72', bg: 'rgba(28, 190, 114, 0.15)' },
  fair: { min: 9, max: 12, label: 'Fair', color: '#F9F37E', bg: 'rgba(249, 243, 126, 0.15)' },
  poor: { min: 5, max: 8, label: 'Poor', color: '#FF9767', bg: 'rgba(255, 151, 103, 0.15)' },
}

export function getScoreLevel(score) {
  if (score >= 17) return 'superb'
  if (score >= 13) return 'good'
  if (score >= 9) return 'fair'
  return 'poor'
}
