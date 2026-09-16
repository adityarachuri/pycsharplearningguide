export interface AnalogyPair {
  id: string;
  humanConcept: string;
  pythonConcept: string;
  explanation: string;
  pythonCode: string;
  caveat: string;
}

export const LANGUAGE_ANALOGY_VERDICT =
  'Treat every pairing below as a memory hook, not a technical equivalence. A keyword is not literally a "word" and a module is not literally a "paragraph" — the analogy exists to make the shape of the language memorable on first encounter, then gets replaced by precise vocabulary as you go deeper.';

export const ANALOGY_PAIRS: AnalogyPair[] = [
  {
    id: 'vocabulary',
    humanConcept: 'Vocabulary',
    pythonConcept: 'Keywords, identifiers, built-in functions',
    explanation: 'Just as a human language has a finite set of words with fixed meanings (and you extend your vocabulary as you learn), Python has ~35 reserved keywords (`def`, `if`, `class`, `return`…) plus a much larger set of built-in functions (`len()`, `print()`, `range()`) you accumulate familiarity with over time.',
    pythonCode: `# Keywords: reserved, fixed meaning (cannot be used as variable names)
def calculate_total(items):   # "def" always means "define a function"
    return sum(items)          # "return" always means "send this value back"

# Built-ins: part of your growing vocabulary, not reserved
print(len([1, 2, 3]))  # "print" and "len" are functions, not keywords`,
    caveat: 'Unlike a spoken language, Python’s "vocabulary" is exhaustively documented — there is no ambiguity or regional dialect. `keyword.kwlist` lists literally every reserved word.'
  },
  {
    id: 'grammar',
    humanConcept: 'Grammar',
    pythonConcept: 'Syntax rules',
    explanation: 'Grammar dictates how words combine into valid sentences. Python’s syntax dictates how tokens combine into valid statements — and just like a grammatically broken sentence is hard to parse, invalid Python syntax raises a `SyntaxError` before your program ever runs.',
    pythonCode: `# Valid "grammar": correct statement structure
if temperature > 30:
    print("It's hot")

# Invalid "grammar" — this would raise SyntaxError: expected ':'
# if temperature > 30
#     print("It's hot")`,
    caveat: 'Python’s grammar is 100% unambiguous by design (there’s exactly one way to parse valid code) — human grammar is famously full of ambiguity ("I saw the man with the telescope").'
  },
  {
    id: 'nouns',
    humanConcept: 'Nouns',
    pythonConcept: 'Data — variables, objects, values',
    explanation: 'Nouns name things. In Python, variables name data — numbers, strings, lists, custom objects — the "things" your program manipulates.',
    pythonCode: `student_name = "Priya"    # a noun-like value: a string
age = 24                  # a noun-like value: a number
grades = [88, 92, 79]     # a noun-like value: a list of numbers`,
    caveat: 'A Python variable is a LABEL pointing at an object, not a box containing one — closer to a sticky note than to a noun’s fixed referent. Two labels can point at the exact same object.'
  },
  {
    id: 'verbs',
    humanConcept: 'Verbs',
    pythonConcept: 'Functions and methods — actions',
    explanation: 'Verbs describe actions. Functions and methods are Python’s actions: `sort()` sorts, `append()` appends, `calculate_average()` calculates an average. The name should almost always read as a verb phrase.',
    pythonCode: `grades = [88, 92, 79]
grades.sort()              # a "verb": sorts the list in place
grades.append(95)          # a "verb": appends a new grade

def calculate_average(nums):   # a "verb phrase" naming the action
    return sum(nums) / len(nums)`,
    caveat: 'Not every callable is a pure "action" — some functions (like a class constructor `Point(3, 4)`) are closer to nouns being constructed than verbs being performed. The analogy bends here.'
  },
  {
    id: 'sentences',
    humanConcept: 'Sentences',
    pythonConcept: 'Statements',
    explanation: 'A sentence is a complete, standalone unit of meaning. A Python statement — an assignment, a function call, an `if` block — is a complete, executable unit. Multiple statements form a function the way multiple sentences form a paragraph.',
    pythonCode: `# Each line is a complete "sentence" (statement)
total = 0
total = total + 10
print(total)`,
    caveat: 'Python statements execute strictly top-to-bottom, left-to-right within a scope — human sentences within a paragraph don’t have to be read in a single fixed order to make sense (though they usually are).'
  },
  {
    id: 'questions',
    humanConcept: 'Questions',
    pythonConcept: 'Conditions (if/elif/else)',
    explanation: 'A question expects a yes/no (or multiple-choice) answer that determines what happens next. An `if` statement asks a True/False question of your data and branches accordingly.',
    pythonCode: `age = 20
if age >= 18:          # the "question": is this true?
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")`,
    caveat: 'A Python condition must resolve to exactly `True` or `False` (via `bool()`) — there’s no "maybe" the way a human answer to a nuanced question might be.'
  },
  {
    id: 'repetition',
    humanConcept: 'Repetition',
    pythonConcept: 'Loops (for, while)',
    explanation: 'Repeating a phrase for emphasis, or repeating a chant, mirrors what a loop does: execute the same statements multiple times, once per item or until a condition changes.',
    pythonCode: `for grade in [88, 92, 79]:   # "repeat this for each grade"
    print(f"Grade: {grade}")

count = 0
while count < 3:             # "repeat until this is no longer true"
    print("Practicing...")
    count += 1`,
    caveat: 'A Python loop must have an explicit, checkable stopping condition (or it becomes an infinite loop) — human repetition for emphasis rarely has a hard-coded exit rule.'
  },
  {
    id: 'paragraphs',
    humanConcept: 'Paragraphs',
    pythonConcept: 'Functions, classes, and modules',
    explanation: 'A paragraph groups related sentences around one idea. A function groups related statements around one task; a class groups related functions (methods) and data around one concept; a module groups related classes/functions into one file.',
    pythonCode: `# A function: a "paragraph" of statements around one task
def greet_student(name):
    message = f"Welcome, {name}!"
    print(message)
    return message

# A class: a "paragraph" grouping related data + actions
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade`,
    caveat: 'Unlike a paragraph’s flexible length, Python functions/classes are governed by strict indentation rules — the "paragraph boundary" is syntactically enforced, not stylistic.'
  },
  {
    id: 'conversation',
    humanConcept: 'Conversation',
    pythonConcept: 'Program flow — calling functions, passing data',
    explanation: 'A conversation is an exchange: one party speaks, the other responds, information flows back and forth. A running Python program is a "conversation" between functions — one calls another, passes arguments, receives a return value, and continues.',
    pythonCode: `def ask_age():
    return int(input("How old are you? "))

def respond(age):
    if age >= 18:
        return "You can vote."
    return "Not yet eligible to vote."

age = ask_age()           # the "question"
reply = respond(age)      # the "response"
print(reply)               # the "conversation" continues`,
    caveat: 'A Python "conversation" between functions is entirely deterministic and synchronous by default — no small talk, no interruptions, no back-and-forth beyond exactly what the code specifies.'
  }
];
