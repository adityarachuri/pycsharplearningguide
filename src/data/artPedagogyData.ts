export interface ArtAnalogy {
  id: string;
  artConcept: string;
  pythonConcept: string;
  explanation: string;
  pythonCode: string;
  caveat: string;
}

export const ART_PEDAGOGY_VERDICT =
  'Code, poetry, and music all share one property: meaning emerges from structure repeated and varied over time. That shared property is why these analogies illuminate real things about reading and writing Python — they are not just a decorative metaphor layered on top of unrelated mechanics.';

export const ART_ANALOGIES: ArtAnalogy[] = [
  {
    id: 'motifs',
    artConcept: 'Musical Motifs & Reusable Phrases',
    pythonConcept: 'Functions',
    explanation: 'A motif is a short musical idea a composer reuses and varies throughout a piece — think of the four-note opening of Beethoven’s 5th Symphony recurring in different forms. A function is the same idea in code: a reusable unit you define once and invoke wherever that "phrase" is needed, sometimes with variation (parameters).',
    pythonCode: `# A "motif": one idea, defined once, reused (and varied) throughout
def fanfare(name):
    return f"♪ Presenting: {name}! ♪"

print(fanfare("the Orchestra"))
print(fanfare("the Soloist"))   # same motif, different variation`,
    caveat: 'A function must be EXACTLY reproducible given the same inputs (no artistic drift) — the analogy captures reuse and variation, not the expressive freedom a performer has interpreting a motif differently each time.'
  },
  {
    id: 'rhythm',
    artConcept: 'Rhythm & Repetition',
    pythonConcept: 'Loops',
    explanation: 'Rhythm is a pattern repeated at regular intervals — a drumbeat, a poem’s meter. A loop is rhythm in code: a pattern of statements repeated at a regular "interval" (once per iteration), with `for`/`while` playing the role of the time signature governing how the repetition proceeds.',
    pythonCode: `# A steady 4/4 "rhythm": four repeated beats
for beat in range(1, 5):
    print(f"Beat {beat}: tap")

# A "rhythm" that continues until a condition changes — like a
# vamp that plays until the conductor cues the next section
energy = 100
while energy > 0:
    print("Playing...")
    energy -= 25`,
    caveat: 'A loop’s "rhythm" is perfectly regular by default — real musical rhythm often has intentional syncopation and irregularity that a straightforward `for` loop doesn’t capture without deliberately varying the logic inside it.'
  },
  {
    id: 'choreography',
    artConcept: 'Choreography',
    pythonConcept: 'Algorithms',
    explanation: 'Choreography is a precise, ordered sequence of steps that achieves a specific effect when executed correctly — exactly what an algorithm is: a precise, ordered sequence of operations that achieves a specific result.',
    pythonCode: `# An algorithm as "choreography": precise, ordered steps
def bubble_sort(nums):
    n = len(nums)
    for i in range(n):               # "pass" through the routine
        for j in range(n - i - 1):   # each "step" compares neighbors
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]  # "swap" — a move
    return nums

print(bubble_sort([5, 2, 8, 1, 9]))`,
    caveat: 'Unlike choreography, an algorithm’s "steps" must be unambiguous enough for a machine with zero judgment to execute — there’s no room for a dancer’s interpretive nuance in what "compare and swap" means.'
  },
  {
    id: 'composition',
    artConcept: 'Musical Composition',
    pythonConcept: 'Program Structure & Architecture',
    explanation: 'A composer arranges movements, themes, and instrumentation into a coherent whole. A programmer arranges modules, functions, and classes into a coherent program — both are exercises in organizing many small, individually-meaningful pieces into something larger that makes sense as a whole.',
    pythonCode: `# "Composition": small pieces (functions) arranged into a coherent whole
def load_data(path): ...
def clean_data(data): ...
def analyze_data(data): ...
def generate_report(results): ...

def main():                    # the "score" that arranges the pieces
    data = load_data("sales.csv")
    clean = clean_data(data)
    results = analyze_data(clean)
    generate_report(results)`,
    caveat: 'A well-composed program is judged by correctness and maintainability, not aesthetic or emotional effect — "elegant code" is a real, valuable property, but it’s not equivalent to a moving piece of music.'
  },
  {
    id: 'poetic-patterns',
    artConcept: 'Poetic Patterns & Structure',
    pythonConcept: 'Idioms & Comprehensions',
    explanation: 'A poem’s form (a sonnet’s 14 lines, a haiku’s 5-7-5 syllables) is a recognized structural pattern that compresses meaning into a tight, conventional shape. A Python list comprehension is the same idea: a recognized, conventional syntactic shape that compresses a loop-and-filter into one tight expression.',
    pythonCode: `# The "loose prose" version — technically correct, verbose
squares = []
for n in range(10):
    if n % 2 == 0:
        squares.append(n ** 2)

# The "poetic form" version — same meaning, compressed conventional shape
squares = [n ** 2 for n in range(10) if n % 2 == 0]`,
    caveat: 'A comprehension’s compression must never sacrifice CLARITY the way poetic compression sometimes trades clarity for effect — an overly clever, deeply nested comprehension is a code smell, not a virtue.'
  },
  {
    id: 'improvisation',
    artConcept: 'Improvisation Within Structure',
    pythonConcept: 'Dynamic Typing & Duck Typing',
    explanation: 'A jazz improviser doesn’t abandon structure — they work within a chord progression and time signature while making real-time choices. Python’s dynamic typing is structurally similar: your code follows the disciplined structure of functions and control flow, while individual variables can flexibly adapt to whatever type of value "fits" at that moment (duck typing).',
    pythonCode: `# "Improvising" within the structure of a fixed function signature
def describe_length(item):
    return f"This has {len(item)} elements"

print(describe_length("hello"))      # a string "fits" — has __len__
print(describe_length([1, 2, 3]))     # a list "fits" too
print(describe_length({"a": 1}))      # so does a dict

# The STRUCTURE (the function, the len() call) stays fixed;
# what "improvises" is which concrete type flows through it.`,
    caveat: 'Unlike a jazz improviser’s intentional creative risk-taking, duck typing "flexibility" that leads to a `TypeError` at runtime is a bug, not an artistic choice — the analogy explains WHY Python allows this, not that runtime errors are desirable.'
  }
];
