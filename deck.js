.pragma library

// The 78-card Rider–Waite–Smith deck with short upright/reversed readings,
// plus the seeded daily draw. Card pictures are the public-domain 1909 scans
// in cards/; glyphs are Material Design codepoints from the bar's Nerd Font,
// used in the bar and as fallback art if a picture is missing.

var SUITS = {
  wands: { name: "Wands", element: "Fire", glyph: 0xF1844 },
  cups: { name: "Cups", element: "Water", glyph: 0xF0876 },
  swords: { name: "Swords", element: "Air", glyph: 0xF04E5 },
  pentacles: { name: "Pentacles", element: "Earth", glyph: 0xF1667 }
}

var RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
             "Page", "Knight", "Queen", "King"]

// Court cards show a chess piece over the suit glyph.
var COURT_GLYPHS = { 11: 0xF0859, 12: 0xF0858, 13: 0xF085A, 14: 0xF0857 }

var ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
             "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"]

// Pips per row, top to bottom, for the numbered minor cards.
var PIP_ROWS = {
  2: [1, 1], 3: [1, 1, 1], 4: [2, 2], 5: [2, 1, 2], 6: [2, 2, 2],
  7: [2, 3, 2], 8: [3, 2, 3], 9: [3, 3, 3], 10: [3, 4, 3]
}

// [name, glyph, upright keywords, upright reading, reversed keywords, reversed reading]
var MAJORS = [
  ["The Fool", 0xF0D7F,
    "beginnings, innocence, spontaneity, a leap of faith",
    "A fresh start is calling. Trust the journey and step forward with an open heart.",
    "recklessness, hesitation, naivety",
    "You may be leaping without looking, or holding back from a start you need to make."],
  ["The Magician", 0xF06E4,
    "willpower, skill, resourcefulness, manifestation",
    "You have every tool you need. Focus your intent and turn ideas into action.",
    "manipulation, untapped talent, poor planning",
    "Your power is scattered or misused. Check your motives and gather your skills before acting."],
  ["The High Priestess", 0xF14F7,
    "intuition, mystery, inner knowledge",
    "Be still and listen inward. You already know the answer, even if you haven't said it yet.",
    "secrets, ignored intuition, withdrawal",
    "You're tuning out your inner voice, or something is being kept hidden. Make time for quiet."],
  ["The Empress", 0xF024A,
    "abundance, nurturing, creativity, nature",
    "Growth comes through care. Nourish yourself, your work and the people around you.",
    "creative block, dependence, self-neglect",
    "You've been giving more than you receive. Tend to your own needs so creativity can return."],
  ["The Emperor", 0xF01A5,
    "authority, structure, stability, leadership",
    "Bring order to the chaos. Clear rules and steady leadership will carry you forward.",
    "rigidity, domination, lack of discipline",
    "Control has turned into stubbornness, or structure is missing entirely. Find the balance."],
  ["The Hierophant", 0xF030B,
    "tradition, guidance, shared beliefs, learning",
    "Lean on proven paths and wise teachers. There's value in doing things the established way.",
    "rebellion, unconventional paths, questioning rules",
    "It may be time to break from convention and trust your own way of doing things."],
  ["The Lovers", 0xF0A56,
    "love, harmony, partnership, meaningful choices",
    "A bond or decision rooted in your true values. Choose with your heart and your principles.",
    "imbalance, disharmony, misaligned values",
    "Something is out of alignment in a relationship or a choice. Be honest about what you want."],
  ["The Chariot", 0xF15C1,
    "determination, willpower, victory, control",
    "Drive forward with focus. Harness opposing forces and you will reach your goal.",
    "lack of direction, scattered energy, obstacles",
    "You're pulled in too many directions. Take back the reins before pushing ahead."],
  ["Strength", 0xF03E9,
    "courage, patience, compassion, inner strength",
    "Gentle persistence beats force. Meet challenges with a calm heart and quiet confidence.",
    "self-doubt, low energy, raw emotion",
    "Your confidence is shaken. Be kind to yourself and rebuild your strength slowly."],
  ["The Hermit", 0xF05E2,
    "introspection, solitude, inner guidance, wisdom",
    "Step back from the noise. Time alone will light the way forward.",
    "isolation, loneliness, withdrawal",
    "Solitude has turned into isolation. Reach out, or come back from the retreat."],
  ["Wheel of Fortune", 0xF094B,
    "cycles, change, luck, turning points",
    "The wheel is turning in your favour. Embrace change; what goes around comes around.",
    "bad luck, resisting change, setbacks",
    "A downturn, or a cycle repeating itself. Let go of what you can't control and adapt."],
  ["Justice", 0xF05D1,
    "fairness, truth, cause and effect, accountability",
    "Actions have consequences. Be honest and fair, and the outcome will be just.",
    "unfairness, dishonesty, avoiding accountability",
    "Something is unbalanced or untrue. Own your part and set the record straight."],
  ["The Hanged Man", 0xF02E6,
    "surrender, pause, new perspective, letting go",
    "Stop struggling and wait. Seeing things from a different angle shows you the way.",
    "stalling, resistance, indecision",
    "You're stuck because you won't let go. Make the decision you've been putting off."],
  ["Death", 0xF068C,
    "endings, transformation, transition, release",
    "Rarely literal: something is ending so that something new can begin. Let it go.",
    "resisting change, stagnation, fear of endings",
    "Holding on to what's already over keeps you stuck. Allow the transition."],
  ["Temperance", 0xF0680,
    "balance, moderation, patience, harmony",
    "Blend opposites, take the middle path and let things unfold at their own pace.",
    "imbalance, excess, impatience",
    "Too much of something is throwing you off. Slow down and restore the balance."],
  ["The Devil", 0xF0C6F,
    "attachment, temptation, addiction, shadow self",
    "Notice what binds you: habits, fears or desires. The chains are looser than they look.",
    "release, breaking free, reclaiming power",
    "You're seeing through what held you back. Now is the moment to break free."],
  ["The Tower", 0xF0682,
    "sudden change, upheaval, revelation, awakening",
    "Something built on shaky ground falls. It's jarring, but it clears space for the truth.",
    "averted disaster, fear of change, delaying the inevitable",
    "You may be resisting a needed shake-up. A small change now prevents a bigger one later."],
  ["The Star", 0xF0AE2,
    "hope, renewal, inspiration, serenity",
    "After the storm comes healing. Have faith; you're on the right path.",
    "despair, lost faith, disconnection",
    "Hope feels far away. Reconnect with what inspires you and trust that it will return."],
  ["The Moon", 0xF0594,
    "illusion, intuition, uncertainty, dreams",
    "Not everything is as it seems. Trust your intuition while the path is unclear.",
    "clarity returning, fear released, truth revealed",
    "The fog is lifting. Confusion fades and hidden things come to light."],
  ["The Sun", 0xF05A8,
    "joy, success, vitality, positivity",
    "A bright day. Warmth, success and confidence shine on everything you do.",
    "temporary gloom, blocked joy, overconfidence",
    "The sun is behind a cloud, not gone. Find the small joys and keep going."],
  ["Judgement", 0xF1096,
    "reflection, reckoning, awakening, renewal",
    "A call to rise. Look honestly at the past and step into a new chapter.",
    "self-doubt, harsh self-judgement, ignoring the call",
    "You're judging yourself too harshly or avoiding a wake-up call. Forgive yourself and listen."],
  ["The World", 0xF01E7,
    "completion, achievement, wholeness, travel",
    "A cycle comes to a fulfilling close. Celebrate how far you've come.",
    "unfinished business, delays, lack of closure",
    "You're close, but not done. Tie up loose ends before moving on."]
]

// Per suit, Ace..King: [upright keywords, upright reading, reversed keywords, reversed reading]
var MINORS = {
  wands: [
    ["inspiration, new venture, creative spark",
      "A burst of energy and a new idea. Act on it while the spark is hot.",
      "delays, low motivation, false starts",
      "The spark is there but keeps stalling. Find out what's draining your drive."],
    ["planning, future vision, decisions",
      "The world is in your hands. Plan your next move and look beyond the familiar.",
      "fear of the unknown, poor planning",
      "You're playing it too safe. Leaving your comfort zone is part of the plan."],
    ["expansion, foresight, progress",
      "Your ships are coming in. The effort is paying off, so think bigger.",
      "obstacles, delays, frustration",
      "Progress is slower than you hoped. Revisit the plan instead of giving up."],
    ["celebration, harmony, homecoming",
      "A time to celebrate milestones with the people who matter.",
      "instability, lack of support, transition",
      "Things feel unsettled at home or in your circle. Look for common ground."],
    ["conflict, competition, tension",
      "Clashing egos and friction. Healthy competition can sharpen you, but pick your battles.",
      "avoiding conflict, truce, resolution",
      "Tension is easing, or being dodged. Talk it out rather than letting it simmer."],
    ["victory, recognition, success",
      "A public win and well-earned recognition. Enjoy it.",
      "ego, fall from grace, no recognition",
      "Credit isn't coming, or pride is getting in the way. Stay grounded."],
    ["defence, perseverance, standing your ground",
      "You have the high ground. Hold your position and defend what matters.",
      "overwhelm, giving up, feeling attacked",
      "You're worn down defending everything. Choose what's worth fighting for."],
    ["speed, movement, swift action",
      "Things move fast now. Messages arrive and plans take off, so keep up.",
      "delays, frustration, waiting",
      "Momentum has stalled. Be patient and don't force what isn't ready."],
    ["resilience, persistence, last stand",
      "You're tired, but nearly there. One more push.",
      "exhaustion, defensiveness, paranoia",
      "You're running on empty. Rest, and let your guard down a little."],
    ["burden, responsibility, hard work",
      "You're carrying too much. Success came with a heavy load, so share it.",
      "letting go, delegation, release",
      "Time to put some of the weight down. Not everything is yours to carry."],
    ["enthusiasm, exploration, discovery",
      "Curious, eager energy. A new interest or message sparks excitement.",
      "no direction, procrastination, setbacks",
      "Lots of ideas, little follow-through. Pick one and start."],
    ["energy, passion, adventure",
      "Charging ahead with fire and confidence. Bold action brings progress.",
      "haste, recklessness, frustration",
      "Rushing in without a plan. Channel the energy before it burns out."],
    ["confidence, courage, warmth",
      "Radiant and self-assured. Own your space and lead with warmth.",
      "insecurity, jealousy, demanding",
      "Self-doubt is dimming your light. Reconnect with what makes you confident."],
    ["leadership, vision, boldness, honour",
      "A visionary leader. Take charge and inspire others with your plans.",
      "impulsiveness, arrogance, high expectations",
      "Leading by force or expecting too much. Listen as well as lead."]
  ],
  cups: [
    ["new feelings, love, compassion",
      "An overflowing heart. Open yourself to love, kindness and new connections.",
      "blocked emotions, repressed feelings, emptiness",
      "Feelings are bottled up. Let them flow, starting with kindness toward yourself."],
    ["partnership, unity, mutual attraction",
      "A meaningful connection built on mutual respect, in love or friendship.",
      "imbalance, broken communication, tension",
      "A relationship feels one-sided. An honest conversation can restore the balance."],
    ["friendship, celebration, community",
      "Raise a glass with friends. Joy is better shared.",
      "overindulgence, gossip, feeling left out",
      "Too much partying, or feeling left out. Check in on your real friendships."],
    ["apathy, contemplation, missed opportunity",
      "Bored or withdrawn, you may be overlooking what's being offered. Look up.",
      "renewed interest, acceptance, moving on",
      "You're coming out of a slump and ready to say yes again."],
    ["loss, regret, disappointment",
      "You're focused on what spilled. Grieve it, then notice what's still standing.",
      "acceptance, recovery, forgiveness",
      "You're making peace with the past and starting to move on."],
    ["nostalgia, memories, innocence, kindness",
      "Fond memories and simple kindness. Reconnect with someone from your past.",
      "living in the past, rose-tinted memories",
      "Nostalgia is holding you back. Honour the past, but live in the present."],
    ["choices, illusion, wishful thinking",
      "Many options, not all of them real. Look closely before you choose.",
      "clarity, focus, decisive action",
      "The illusions fade and you can see which path is real."],
    ["walking away, disillusionment, seeking meaning",
      "Time to leave what no longer fulfils you, even if it looks fine from outside.",
      "fear of change, staying too long, drifting",
      "You know it's time to go but keep hesitating. What's keeping you there?"],
    ["contentment, satisfaction, wishes fulfilled",
      "The wish card. Enjoy what you have; what you want is within reach.",
      "smugness, dissatisfaction, materialism",
      "Getting what you wanted didn't satisfy you. Look for something deeper."],
    ["harmony, family, happiness, fulfilment",
      "Lasting happiness and loving bonds. Home is where the heart is.",
      "disconnection, family strain, misaligned values",
      "Harmony at home is strained. Reconnect over what you all value."],
    ["creative opportunity, curiosity, intuition",
      "A sweet surprise or a creative idea. Stay open to the unexpected.",
      "emotional immaturity, creative block, insecurity",
      "Feelings are running young or getting stuck. Give your inner child some care."],
    ["romance, charm, imagination",
      "An offer that moves the heart. Follow your feelings with grace.",
      "moodiness, unrealistic expectations, jealousy",
      "Daydreaming more than doing. Ground your ideals in reality."],
    ["compassion, calm, emotional security",
      "Lead with empathy. Your calm presence and intuition support the people around you.",
      "codependency, overwhelm, insecurity",
      "You're absorbing everyone's feelings. Set boundaries and care for yourself."],
    ["emotional balance, diplomacy, generosity",
      "Calm in the storm. Steady emotions and wise compassion guide your choices.",
      "manipulation, moodiness, coldness",
      "Emotions are being suppressed or used as leverage. Be honest about how you feel."]
  ],
  swords: [
    ["clarity, breakthrough, truth, new ideas",
      "A moment of mental clarity cuts through the confusion. Speak the truth.",
      "confusion, chaos, misinformation",
      "Your thoughts are clouded. Get the facts before you decide."],
    ["indecision, stalemate, avoidance",
      "Blindfolded between two options. You can't avoid the choice forever.",
      "information overload, lesser of two evils",
      "Overthinking is paralysing you. Take off the blindfold and choose."],
    ["heartbreak, grief, painful truth",
      "A painful truth or loss. Let yourself feel it; that's how it heals.",
      "recovery, forgiveness, releasing pain",
      "The worst of the hurt is passing. Begin to let go."],
    ["rest, recovery, contemplation",
      "Retreat and recharge. A pause now restores your strength.",
      "restlessness, burnout, stagnation",
      "You need rest but keep pushing, or you've rested too long. Find the middle."],
    ["conflict, defeat, winning at all costs",
      "A hollow victory. Ask whether being right is worth what it costs.",
      "reconciliation, making amends, moving on",
      "You're ready to end the fight. Apologise, or simply walk away."],
    ["transition, moving on, leaving behind",
      "Leaving troubled waters for calmer shores. The journey itself is healing.",
      "unfinished business, resisting change",
      "You can't move on until you face what's been left behind."],
    ["deception, strategy, sneakiness",
      "Someone, maybe you, is being sneaky. Be strategic, but stay honest.",
      "confession, conscience, coming clean",
      "Secrets come out. Honesty now saves trouble later."],
    ["restriction, feeling trapped, self-imposed limits",
      "You feel trapped, but the bonds are loose. The way out begins in your mind.",
      "release, new perspective, freedom",
      "You're seeing a way out. Take the first step toward freedom."],
    ["anxiety, worry, sleepless nights",
      "Worries loom largest at night. Most fears are worse in your head than in reality.",
      "hope, reaching out, easing anxiety",
      "The anxiety is lifting. Share your worries; they shrink when spoken."],
    ["painful ending, rock bottom, betrayal",
      "It's over and it hurts, but rock bottom is solid ground to rebuild on.",
      "recovery, regeneration, the worst is over",
      "The worst has passed. Get up slowly; healing has started."],
    ["curiosity, new ideas, vigilance",
      "Sharp and eager to learn. Ask questions and speak your mind.",
      "gossip, hasty words, all talk",
      "Words before thought. Check your facts and your tone."],
    ["ambition, action, drive, fast thinking",
      "Charging toward the goal at full speed. Decisive action wins.",
      "impulsiveness, rudeness, no direction",
      "Rushing in with sharp words. Slow down and think it through."],
    ["independence, clear boundaries, honesty",
      "Clear-headed and direct. Speak your truth with honesty and fairness.",
      "coldness, bitterness, harsh judgement",
      "Sharpness has turned into cruelty. Soften without losing your honesty."],
    ["intellect, authority, truth, clear thinking",
      "Lead with logic and integrity. Make the fair, rational call.",
      "manipulation, tyranny, misuse of power",
      "Intellect is being used to control. Make sure your reasoning is fair."]
  ],
  pentacles: [
    ["new opportunity, prosperity, manifestation",
      "A seed of opportunity in money, work or health. Plant it well.",
      "missed opportunity, poor planning, scarcity",
      "An opportunity slips away or isn't on solid ground. Check the details."],
    ["balance, adaptability, juggling priorities",
      "Juggling many things at once. Keep your rhythm and stay flexible.",
      "overwhelm, disorganisation, overcommitment",
      "Too many balls in the air. Drop what doesn't matter."],
    ["teamwork, craftsmanship, collaboration",
      "Good work comes from collaboration. Your skills are being recognised.",
      "poor teamwork, misalignment, low effort",
      "The team isn't pulling together. Clarify roles and goals."],
    ["saving, security, control",
      "Holding tight to what you have. Security matters, but don't grip too hard.",
      "greed, overspending, letting go",
      "You're either clinging too tightly or spending too freely. Find the middle."],
    ["hardship, loss, isolation, worry",
      "A hard time, materially or emotionally. Help is closer than you think, so ask.",
      "recovery, improvement, hardship ending",
      "Things are getting better. Accept the help on offer."],
    ["generosity, charity, giving and receiving",
      "Give and receive freely. Share your resources with others.",
      "strings attached, debt, one-sided giving",
      "Check the balance of giving. Is help coming with conditions?"],
    ["patience, long-term view, investment",
      "Your work is growing. Be patient and take stock before the harvest.",
      "impatience, poor returns, little reward",
      "The effort isn't paying off yet. Rethink where you invest your energy."],
    ["diligence, skill, mastery, hard work",
      "Head down, perfecting your craft. Steady practice leads to mastery.",
      "perfectionism, lack of focus, uninspired work",
      "Going through the motions, or obsessing over details. Remember why it matters."],
    ["independence, luxury, self-sufficiency",
      "Enjoy the fruits of your labour. You've earned this comfort.",
      "overwork, financial setbacks, superficiality",
      "Working too hard to enjoy it, or living beyond your means. Rebalance."],
    ["wealth, legacy, family, long-term success",
      "Lasting security and a legacy to share. Think long-term.",
      "financial loss, family disputes, instability",
      "Money or family tension threatens stability. Protect what matters."],
    ["ambition, study, new opportunities",
      "A practical new start or course of study. Be diligent and curious.",
      "procrastination, lack of progress, missed lessons",
      "Big plans, little follow-through. Take one practical step today."],
    ["routine, reliability, steady progress",
      "Slow and steady wins. Consistent effort gets the job done.",
      "stagnation, boredom, laziness",
      "Routine has become a rut. Shake things up a little."],
    ["nurturing, practicality, comfort",
      "Warm and grounded. Care for home, body and finances with practical wisdom.",
      "work-home imbalance, self-neglect",
      "You're looking after everyone but yourself. Tend to your own comfort."],
    ["abundance, security, discipline, success",
      "Material success through discipline. You're a steady provider.",
      "greed, stubbornness, materialism",
      "Money or status is taking over. Remember what wealth is for."]
  ]
}

function pad2(n) {
  return (n < 10 ? "0" : "") + n
}

function majorCard(i) {
  var m = MAJORS[i]
  return {
    index: i, major: true, number: i, numeral: ROMAN[i], name: m[0], glyph: m[1],
    // The Hanged Man hangs upside down.
    glyphRotation: i === 12 ? 180 : 0,
    suit: "", suitName: "", element: "", courtGlyph: 0, image: "major-" + pad2(i) + ".jpg",
    upright: m[2], uprightText: m[3], reversed: m[4], reversedText: m[5]
  }
}

function minorCard(suitKey, rank, index) {
  var s = SUITS[suitKey]
  var m = MINORS[suitKey][rank - 1]
  return {
    index: index, major: false, number: rank,
    numeral: rank >= 2 && rank <= 10 ? ROMAN[rank] : "",
    name: RANKS[rank - 1] + " of " + s.name, glyph: s.glyph, glyphRotation: 0,
    suit: suitKey, suitName: s.name, element: s.element, courtGlyph: COURT_GLYPHS[rank] || 0,
    image: suitKey + "-" + pad2(rank) + ".jpg",
    upright: m[0], uprightText: m[1], reversed: m[2], reversedText: m[3]
  }
}

var CARDS = (function() {
  var out = []
  for (var i = 0; i < MAJORS.length; i++) out.push(majorCard(i))
  var order = ["wands", "cups", "swords", "pentacles"]
  for (var s = 0; s < order.length; s++) {
    for (var r = 1; r <= 14; r++) out.push(minorCard(order[s], r, out.length))
  }
  return out
})()

function pipRows(card) {
  return !card.major && PIP_ROWS[card.number] ? PIP_ROWS[card.number] : []
}

// FNV-1a with a murmur-style finalizer, so neighbouring dates land on
// unrelated cards.
function hash(text) {
  var h = 0x811c9dc5
  for (var i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return h >>> 0
}

// One card per date key ("2026-10-21"); the same key always draws the same card.
function drawFor(dateKey, allowReversed) {
  var h = hash("reva.tarot:" + dateKey)
  return {
    card: CARDS[h % CARDS.length],
    reversed: allowReversed && (hash("reversed:" + dateKey) & 1) === 1
  }
}
