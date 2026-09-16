import type { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  // ============================= BEGINNER =============================
  {
    id: 'sum-of-evens',
    title: 'Sum of Even Numbers',
    difficulty: 'beginner',
    category: 'fundamentals',
    tags: ['variables', 'loops', 'conditions'],
    learningObjective: 'Practice iterating over a list, checking a condition with the modulo operator, and accumulating a running total.',
    problemStatement: 'Write a function `sum_evens(numbers)` that returns the sum of all even numbers in the given list. If there are no even numbers, return 0.',
    inputDescription: 'A list of integers, which may be empty and may contain negative numbers.',
    outputDescription: 'An integer: the sum of all even values in the list.',
    constraints: ['0 <= len(numbers) <= 10,000', 'Each number fits in a standard Python int'],
    examples: [
      { input: '[1, 2, 3, 4, 5, 6]', output: '12', explanation: '2 + 4 + 6 = 12' },
      { input: '[1, 3, 5]', output: '0', explanation: 'No even numbers.' },
      { input: '[-4, -3, -2]', output: '-6', explanation: 'Negative even numbers count too: -4 + -2 = -6' }
    ],
    starterCode: `def sum_evens(numbers):
    # Your code here
    pass`,
    hints: [
      'Use the modulo operator `%` to check if a number is even: `n % 2 == 0`.',
      'Start with a running total of 0, then add each qualifying number as you loop.',
      'A one-line solution is possible with `sum(n for n in numbers if n % 2 == 0)`.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'mixed odd and even', assertionCode: 'assert sum_evens([1, 2, 3, 4, 5, 6]) == 12' },
      { id: 't2', isExample: true, description: 'no evens', assertionCode: 'assert sum_evens([1, 3, 5]) == 0' },
      { id: 't3', description: 'empty list', assertionCode: 'assert sum_evens([]) == 0' },
      { id: 't4', description: 'negative evens', assertionCode: 'assert sum_evens([-4, -3, -2]) == -6' },
      { id: 't5', description: 'single even', assertionCode: 'assert sum_evens([8]) == 8' }
    ],
    referenceSolution: `def sum_evens(numbers):
    return sum(n for n in numbers if n % 2 == 0)`,
    explanation: 'A generator expression filters the list down to even numbers as it’s consumed, and `sum()` reduces that stream to a single total in one pass — the same effect as an explicit loop with an `if n % 2 == 0: total += n` body, just more idiomatic Python.',
    complexityAnalysis: 'Time: O(n) — one pass over the list. Space: O(1) — the generator produces values lazily rather than building an intermediate list.',
    relatedConcepts: ['List comprehensions', 'Generator expressions', 'The modulo operator'],
    nextChallengeId: 'palindrome-check'
  },
  {
    id: 'palindrome-check',
    title: 'Palindrome Check',
    difficulty: 'beginner',
    category: 'fundamentals',
    tags: ['strings', 'slicing'],
    learningObjective: 'Practice string normalization (case-folding, stripping non-alphanumeric characters) and slicing.',
    problemStatement: 'Write a function `is_palindrome(text)` that returns True if the input string is a palindrome, ignoring case, spaces, and punctuation — and False otherwise.',
    inputDescription: 'A string, possibly containing spaces, punctuation, and mixed case.',
    outputDescription: 'A boolean.',
    constraints: ['0 <= len(text) <= 10,000'],
    examples: [
      { input: '"racecar"', output: 'True' },
      { input: '"A man, a plan, a canal: Panama"', output: 'True', explanation: 'Ignoring case, spaces, and punctuation, this reads the same forwards and backwards.' },
      { input: '"hello"', output: 'False' }
    ],
    starterCode: `def is_palindrome(text):
    # Your code here
    pass`,
    hints: [
      'Normalize first: lowercase the string and keep only alphanumeric characters.',
      'Python string slicing with a step of -1 (`s[::-1]`) reverses a string.',
      'Compare the normalized string to its own reversed version.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'simple palindrome', assertionCode: 'assert is_palindrome("racecar") is True' },
      { id: 't2', isExample: true, description: 'sentence with punctuation', assertionCode: 'assert is_palindrome("A man, a plan, a canal: Panama") is True' },
      { id: 't3', isExample: true, description: 'not a palindrome', assertionCode: 'assert is_palindrome("hello") is False' },
      { id: 't4', description: 'empty string', assertionCode: 'assert is_palindrome("") is True' },
      { id: 't5', description: 'single character', assertionCode: 'assert is_palindrome("x") is True' }
    ],
    referenceSolution: `def is_palindrome(text):
    normalized = "".join(ch.lower() for ch in text if ch.isalnum())
    return normalized == normalized[::-1]`,
    explanation: 'Filtering with `ch.isalnum()` strips spaces and punctuation in one pass while lowercasing handles case-insensitivity; `[::-1]` then produces a reversed copy for a direct equality check.',
    complexityAnalysis: 'Time: O(n) for normalizing plus O(n) for reversing = O(n) overall. Space: O(n) for the normalized string.',
    relatedConcepts: ['String slicing', 'str.isalnum()', 'Generator expressions'],
    nextChallengeId: 'word-frequency'
  },
  {
    id: 'word-frequency',
    title: 'Word Frequency Counter',
    difficulty: 'beginner',
    category: 'fundamentals',
    tags: ['dictionaries', 'strings'],
    learningObjective: 'Practice building a frequency dictionary and using `dict.get()` with a default.',
    problemStatement: 'Write a function `word_frequencies(text)` that returns a dictionary mapping each lowercase word in the input text to how many times it appears. Split on whitespace; ignore leading/trailing punctuation on each word.',
    inputDescription: 'A string of space-separated words, possibly with punctuation attached.',
    outputDescription: 'A dict mapping each word (lowercase, punctuation-stripped) to its integer count.',
    constraints: ['0 <= len(text) <= 10,000'],
    examples: [
      { input: '"the cat sat on the mat"', output: '{"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}' },
      { input: '"Hi! Hi there."', output: '{"hi": 2, "there": 1}', explanation: 'Case-insensitive and punctuation-stripped.' }
    ],
    starterCode: `def word_frequencies(text):
    # Your code here
    pass`,
    hints: [
      '`text.split()` splits on any whitespace and handles multiple spaces automatically.',
      'Use `word.strip(string.punctuation)` (or a simple loop) to remove leading/trailing punctuation from each word.',
      'A `dict.get(word, 0) + 1` pattern avoids needing to check membership before incrementing.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'repeated words', assertionCode: 'assert word_frequencies("the cat sat on the mat") == {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}' },
      { id: 't2', isExample: true, description: 'punctuation and case', assertionCode: 'assert word_frequencies("Hi! Hi there.") == {"hi": 2, "there": 1}' },
      { id: 't3', description: 'empty text', assertionCode: 'assert word_frequencies("") == {}' },
      { id: 't4', description: 'single word', assertionCode: 'assert word_frequencies("Python") == {"python": 1}' }
    ],
    referenceSolution: `import string

def word_frequencies(text):
    counts = {}
    for raw_word in text.split():
        word = raw_word.lower().strip(string.punctuation)
        if word:
            counts[word] = counts.get(word, 0) + 1
    return counts`,
    explanation: '`str.strip(string.punctuation)` removes any leading/trailing characters found in `string.punctuation` (not just one specific character), which is exactly what’s needed for stripping attached punctuation like "Hi!" → "hi".',
    complexityAnalysis: 'Time: O(n) where n is the number of characters in the text. Space: O(k) where k is the number of distinct words.',
    relatedConcepts: ['dict.get()', 'collections.Counter (a built-in alternative)', 'str.strip()'],
    nextChallengeId: 'fizzbuzz-variant'
  },
  {
    id: 'fizzbuzz-variant',
    title: 'FizzBuzz with a Twist',
    difficulty: 'beginner',
    category: 'fundamentals',
    tags: ['conditions', 'loops'],
    learningObjective: 'Practice multi-branch conditionals and building a result list instead of printing directly (making the function testable).',
    problemStatement: 'Write a function `fizzbuzz(n)` that returns a list of strings for the numbers 1 through n (inclusive): "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of both, and the number itself (as a string) otherwise.',
    inputDescription: 'A positive integer n.',
    outputDescription: 'A list of n strings.',
    constraints: ['1 <= n <= 10,000'],
    examples: [
      { input: '15', output: '["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]' }
    ],
    starterCode: `def fizzbuzz(n):
    # Your code here
    pass`,
    hints: [
      'Check the "both" case (divisible by 15, or by both 3 and 5) before the individual Fizz/Buzz cases, or you’ll never reach it.',
      'Build a list and return it at the end, rather than printing — that’s what makes this testable.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'classic range of 15', assertionCode: 'assert fizzbuzz(15) == ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]' },
      { id: 't2', description: 'n = 1', assertionCode: 'assert fizzbuzz(1) == ["1"]' },
      { id: 't3', description: 'n = 3 ends on Fizz', assertionCode: 'assert fizzbuzz(3) == ["1", "2", "Fizz"]' },
      { id: 't4', description: 'n = 5 ends on Buzz', assertionCode: 'assert fizzbuzz(5) == ["1", "2", "Fizz", "4", "Buzz"]' }
    ],
    referenceSolution: `def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result`,
    explanation: 'Checking `i % 15 == 0` first (equivalent to divisible by both 3 and 5) avoids the classic bug of the "Fizz" branch matching first and never reaching the combined case.',
    complexityAnalysis: 'Time: O(n). Space: O(n) for the result list.',
    relatedConcepts: ['Conditional branching order', 'range()', 'String formatting']
  },

  // ============================ INTERMEDIATE ============================
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'intermediate',
    category: 'dsa',
    tags: ['arrays', 'hash-map'],
    learningObjective: 'Practice trading an O(n²) brute-force nested loop for an O(n) single-pass hash-map lookup.',
    problemStatement: 'Given a list of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`, as a list `[i, j]` with i < j. Assume exactly one valid solution exists.',
    inputDescription: '`nums`: a list of integers. `target`: an integer.',
    outputDescription: 'A list of two indices `[i, j]`.',
    constraints: ['2 <= len(nums) <= 10,000', 'Exactly one valid pair exists'],
    examples: [
      { input: 'nums=[2, 7, 11, 15], target=9', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums=[3, 2, 4], target=6', output: '[1, 2]' }
    ],
    starterCode: `def two_sum(nums, target):
    # Your code here
    pass`,
    hints: [
      'A brute-force nested loop works (O(n²)) but there’s a single-pass O(n) approach.',
      'As you iterate, store each number’s index in a dict. Before storing, check whether `target - current_number` is already a key in that dict.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'basic pair', assertionCode: 'assert two_sum([2, 7, 11, 15], 9) == [0, 1]' },
      { id: 't2', isExample: true, description: 'pair not at the start', assertionCode: 'assert two_sum([3, 2, 4], 6) == [1, 2]' },
      { id: 't3', description: 'duplicate values summing to target', assertionCode: 'assert two_sum([3, 3], 6) == [0, 1]' },
      { id: 't4', description: 'negative numbers', assertionCode: 'assert two_sum([-1, -2, -3, -4, -5], -8) == [2, 4]' }
    ],
    referenceSolution: `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    explanation: 'Checking `seen` BEFORE inserting the current number ensures a number never pairs with itself unless it genuinely appears twice at different indices, and the dict lookup makes each check O(1) instead of O(n).',
    complexityAnalysis: 'Time: O(n) — one pass, O(1) average dict lookups. Space: O(n) for the `seen` dict. Brute force is O(n²) time, O(1) space.',
    relatedConcepts: ['Hash maps', 'enumerate()', 'Time/space trade-offs'],
    nextChallengeId: 'valid-parentheses'
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'intermediate',
    category: 'dsa',
    tags: ['stack', 'strings'],
    learningObjective: 'Recognize when a stack is the right data structure for matching nested/balanced pairs.',
    problemStatement: 'Write a function `is_valid(s)` that returns True if the string of brackets `()`, `{}`, `[]` is validly matched and nested — False otherwise.',
    inputDescription: 'A string containing only the characters `(){}[]`.',
    outputDescription: 'A boolean.',
    constraints: ['0 <= len(s) <= 10,000'],
    examples: [
      { input: '"()[]{}"', output: 'True' },
      { input: '"(]"', output: 'False' },
      { input: '"([)]"', output: 'False', explanation: 'Brackets must close in the correct nested order.' }
    ],
    starterCode: `def is_valid(s):
    # Your code here
    pass`,
    hints: [
      'Use a list as a stack: push opening brackets, pop when you see a closing bracket.',
      'A dict mapping each closing bracket to its matching opening bracket makes the comparison a single lookup.',
      'If you try to pop from an empty stack, or the popped bracket doesn’t match, the string is invalid.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'all matched', assertionCode: 'assert is_valid("()[]{}") is True' },
      { id: 't2', isExample: true, description: 'mismatched pair', assertionCode: 'assert is_valid("(]") is False' },
      { id: 't3', isExample: true, description: 'wrong nesting order', assertionCode: 'assert is_valid("([)]") is False' },
      { id: 't4', description: 'empty string is valid', assertionCode: 'assert is_valid("") is True' },
      { id: 't5', description: 'unclosed bracket', assertionCode: 'assert is_valid("(((") is False' },
      { id: 't6', description: 'nested correctly', assertionCode: 'assert is_valid("{[()]}") is True' }
    ],
    referenceSolution: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack`,
    explanation: 'The stack naturally tracks "what needs to close next" — every opening bracket is pushed, and every closing bracket must match whatever is currently on top. An empty stack at the end confirms nothing was left unclosed.',
    complexityAnalysis: 'Time: O(n). Space: O(n) worst case (an all-opening-brackets string).',
    relatedConcepts: ['Stacks (LIFO)', 'list.append()/list.pop() as a stack'],
    nextChallengeId: 'binary-search'
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'intermediate',
    category: 'dsa',
    tags: ['searching', 'arrays'],
    learningObjective: 'Implement binary search from scratch and reason about the O(log n) complexity it provides over linear search.',
    problemStatement: 'Write a function `binary_search(sorted_list, target)` that returns the index of `target` in `sorted_list` (ascending order), or -1 if it’s not present. Do not use `list.index()` or `in`.',
    inputDescription: '`sorted_list`: a list of integers sorted ascending. `target`: an integer to find.',
    outputDescription: 'An integer index, or -1.',
    constraints: ['0 <= len(sorted_list) <= 100,000', 'sorted_list contains no duplicates'],
    examples: [
      { input: 'sorted_list=[1, 3, 5, 7, 9, 11], target=7', output: '3' },
      { input: 'sorted_list=[1, 3, 5, 7, 9, 11], target=4', output: '-1' }
    ],
    starterCode: `def binary_search(sorted_list, target):
    # Your code here
    pass`,
    hints: [
      'Track a `low` and `high` index bounding the search range, starting at 0 and len(sorted_list) - 1.',
      'Each iteration, check the midpoint. If it’s too big, search the left half; too small, search the right half.',
      'The loop ends when `low > high` — that’s your signal the target isn’t present.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'found in middle', assertionCode: 'assert binary_search([1, 3, 5, 7, 9, 11], 7) == 3' },
      { id: 't2', isExample: true, description: 'not found', assertionCode: 'assert binary_search([1, 3, 5, 7, 9, 11], 4) == -1' },
      { id: 't3', description: 'first element', assertionCode: 'assert binary_search([1, 3, 5, 7, 9, 11], 1) == 0' },
      { id: 't4', description: 'last element', assertionCode: 'assert binary_search([1, 3, 5, 7, 9, 11], 11) == 5' },
      { id: 't5', description: 'empty list', assertionCode: 'assert binary_search([], 5) == -1' }
    ],
    referenceSolution: `def binary_search(sorted_list, target):
    low, high = 0, len(sorted_list) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    explanation: 'Each comparison eliminates half of the remaining search space, which is exactly why binary search runs in O(log n) instead of the O(n) a left-to-right scan requires — doubling the input size only adds one more comparison.',
    complexityAnalysis: 'Time: O(log n). Space: O(1) — this iterative version uses no extra data structures.',
    relatedConcepts: ['Divide and conquer', 'Sorted-data invariants', 'Logarithmic complexity'],
    nextChallengeId: 'safe-divider'
  },
  {
    id: 'safe-divider',
    title: 'Custom Exceptions for Input Validation',
    difficulty: 'intermediate',
    category: 'error-handling',
    tags: ['exceptions', 'validation'],
    learningObjective: 'Define and raise a custom exception type, and practice catching specific exception types rather than a bare `except`.',
    problemStatement: 'Define a custom exception class `InvalidDivisionError(Exception)`. Then write `safe_divide(a, b)` that returns `a / b`, but raises `InvalidDivisionError("division by zero")` if `b == 0`, and raises `InvalidDivisionError("operands must be numeric")` if either argument is not an `int` or `float` (excluding `bool`, since `bool` is technically a subclass of `int` in Python but shouldn’t count here).',
    inputDescription: 'Two arguments `a`, `b` of any type.',
    outputDescription: 'A float, or a raised `InvalidDivisionError` with the specified message.',
    constraints: ['Inputs may be any Python type, including strings, None, lists, or booleans'],
    examples: [
      { input: 'a=10, b=2', output: '5.0' },
      { input: 'a=10, b=0', output: 'raises InvalidDivisionError("division by zero")' },
      { input: 'a=10, b="2"', output: 'raises InvalidDivisionError("operands must be numeric")' }
    ],
    starterCode: `class InvalidDivisionError(Exception):
    pass

def safe_divide(a, b):
    # Your code here
    pass`,
    hints: [
      'A custom exception is just a class that inherits from `Exception` (or a more specific built-in exception).',
      'Use `isinstance(x, bool)` to explicitly exclude booleans, since `isinstance(True, int)` is `True` in Python.',
      'Check the type-validation condition before the zero-division condition.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'normal division', assertionCode: 'assert safe_divide(10, 2) == 5.0' },
      { id: 't2', isExample: true, description: 'division by zero raises', assertionCode: `
try:
    safe_divide(10, 0)
    assert False, "expected InvalidDivisionError"
except InvalidDivisionError as e:
    assert str(e) == "division by zero"
` },
      { id: 't3', isExample: true, description: 'non-numeric raises', assertionCode: `
try:
    safe_divide(10, "2")
    assert False, "expected InvalidDivisionError"
except InvalidDivisionError as e:
    assert str(e) == "operands must be numeric"
` },
      { id: 't4', description: 'boolean operand rejected', assertionCode: `
try:
    safe_divide(True, 2)
    assert False, "expected InvalidDivisionError"
except InvalidDivisionError:
    pass
` },
      { id: 't5', description: 'float operands work', assertionCode: 'assert safe_divide(7.5, 2.5) == 3.0' }
    ],
    referenceSolution: `class InvalidDivisionError(Exception):
    pass

def safe_divide(a, b):
    for operand in (a, b):
        if isinstance(operand, bool) or not isinstance(operand, (int, float)):
            raise InvalidDivisionError("operands must be numeric")
    if b == 0:
        raise InvalidDivisionError("division by zero")
    return a / b`,
    explanation: 'Defining a dedicated exception subclass lets callers catch exactly this failure mode (`except InvalidDivisionError`) without accidentally swallowing unrelated bugs the way a bare `except Exception` would.',
    complexityAnalysis: 'Time: O(1). Space: O(1).',
    relatedConcepts: ['Custom exception classes', 'isinstance() and type hierarchies', 'Specific vs. broad except clauses'],
    nextChallengeId: 'shape-hierarchy'
  },
  {
    id: 'shape-hierarchy',
    title: 'Shape Area Calculator (OOP)',
    difficulty: 'intermediate',
    category: 'oop',
    tags: ['classes', 'inheritance', 'polymorphism'],
    learningObjective: 'Practice an abstract base class with an enforced interface, and polymorphic method dispatch.',
    problemStatement: 'Define an abstract base class `Shape` with an abstract method `area()`. Implement `Rectangle(width, height)` and `Circle(radius)` subclasses. Then write `total_area(shapes)` that returns the sum of `.area()` across a list of mixed shapes, rounded to 2 decimal places.',
    inputDescription: 'A list of `Shape` instances (a mix of `Rectangle` and `Circle`).',
    outputDescription: 'A float: the summed area, rounded to 2 decimal places.',
    constraints: ['Use `math.pi` for circle area calculations', 'Shape must not be directly instantiable'],
    examples: [
      { input: '[Rectangle(3, 4), Circle(2)]', output: '24.57', explanation: '3*4 + pi*2^2 = 12 + 12.566... = 24.57 (rounded)' }
    ],
    starterCode: `from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        # Your code here
        pass

class Circle(Shape):
    def __init__(self, radius):
        # Your code here
        pass

def total_area(shapes):
    # Your code here
    pass`,
    hints: [
      '`ABC` and `@abstractmethod` from the `abc` module prevent `Shape` itself from being instantiated directly — this is Python’s closest equivalent to a C# abstract class.',
      'Each subclass must implement `area()` with a concrete formula to be instantiable at all.',
      '`total_area` should just loop and call `.area()` polymorphically — it never needs to check which concrete type it’s holding.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'mixed shapes total', assertionCode: 'assert total_area([Rectangle(3, 4), Circle(2)]) == 24.57' },
      { id: 't2', description: 'rectangle area alone', assertionCode: 'assert Rectangle(5, 6).area() == 30' },
      { id: 't3', description: 'circle area alone', assertionCode: 'assert round(Circle(1).area(), 4) == 3.1416' },
      { id: 't4', description: 'Shape cannot be instantiated directly', assertionCode: `
try:
    Shape()
    assert False, "Shape should not be directly instantiable"
except TypeError:
    pass
` },
      { id: 't5', description: 'empty list', assertionCode: 'assert total_area([]) == 0' }
    ],
    referenceSolution: `from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

def total_area(shapes):
    return round(sum(shape.area() for shape in shapes), 2)`,
    explanation: '`total_area` never inspects `type(shape)` — calling `.area()` polymorphically and letting each subclass’s own override run is the whole point of the abstract base class: the caller depends only on the `Shape` contract, not on any concrete implementation.',
    complexityAnalysis: 'Time: O(n) for n shapes. Space: O(1) beyond the input list.',
    relatedConcepts: ['Abstract base classes (abc module)', 'Polymorphism', 'Inheritance'],
    nextChallengeId: 'log-analyzer'
  },
  {
    id: 'log-analyzer',
    title: 'Application Log Analyzer',
    difficulty: 'intermediate',
    category: 'real-world',
    tags: ['strings', 'parsing', 'real-world'],
    learningObjective: 'Practice parsing structured text lines and aggregating operational metrics — a realistic log-analysis task.',
    problemStatement: 'Write `analyze_logs(lines)` that takes a list of log lines in the format `"<LEVEL> <message>"` (e.g. `"ERROR Connection timeout"`) and returns a dict with the count of lines per level (`INFO`, `WARNING`, `ERROR`), plus a key `"error_messages"` listing every ERROR line’s message text (without the level prefix), in order.',
    inputDescription: 'A list of strings, each starting with a level keyword followed by a space and a message.',
    outputDescription: 'A dict: `{"INFO": int, "WARNING": int, "ERROR": int, "error_messages": list[str]}`. Levels not present in the input should still appear with count 0.',
    constraints: ['0 <= len(lines) <= 100,000', 'Every line starts with one of INFO, WARNING, ERROR'],
    examples: [
      {
        input: '["INFO Server started", "ERROR Connection timeout", "WARNING High memory usage", "ERROR Disk full"]',
        output: '{"INFO": 1, "WARNING": 1, "ERROR": 2, "error_messages": ["Connection timeout", "Disk full"]}'
      }
    ],
    starterCode: `def analyze_logs(lines):
    # Your code here
    pass`,
    hints: [
      'Initialize the counts dict with all three levels at 0 up front, so a level with zero occurrences still appears in the output.',
      '`line.split(" ", 1)` splits only on the FIRST space, giving you the level and the rest of the message in one call.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'mixed levels', assertionCode: 'assert analyze_logs(["INFO Server started", "ERROR Connection timeout", "WARNING High memory usage", "ERROR Disk full"]) == {"INFO": 1, "WARNING": 1, "ERROR": 2, "error_messages": ["Connection timeout", "Disk full"]}' },
      { id: 't2', description: 'empty input', assertionCode: 'assert analyze_logs([]) == {"INFO": 0, "WARNING": 0, "ERROR": 0, "error_messages": []}' },
      { id: 't3', description: 'only info lines', assertionCode: 'assert analyze_logs(["INFO a", "INFO b"]) == {"INFO": 2, "WARNING": 0, "ERROR": 0, "error_messages": []}' }
    ],
    referenceSolution: `def analyze_logs(lines):
    counts = {"INFO": 0, "WARNING": 0, "ERROR": 0}
    error_messages = []
    for line in lines:
        level, message = line.split(" ", 1)
        counts[level] += 1
        if level == "ERROR":
            error_messages.append(message)
    counts["error_messages"] = error_messages
    return counts`,
    explanation: 'Pre-seeding `counts` with every expected level at 0 avoids a `KeyError` on first occurrence and guarantees the output always reports all three levels, even when some never appear — a common requirement for operational dashboards where a missing key is easy to misinterpret as "no data".',
    complexityAnalysis: 'Time: O(n) where n is the number of log lines. Space: O(e) where e is the number of error lines.',
    relatedConcepts: ['str.split(sep, maxsplit)', 'Dict aggregation patterns', 'Log/text parsing']
  },

  // ============================== ADVANCED ==============================
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'advanced',
    category: 'dsa',
    tags: ['design', 'hash-map', 'ordered-dict'],
    learningObjective: 'Design a data structure with O(1) get/put by combining a hash map with an ordering mechanism — a very common real interview and real-world caching problem.',
    problemStatement: 'Implement an `LRUCache(capacity)` class with `get(key)` (returns the value, or -1 if absent, and marks the key as most-recently-used) and `put(key, value)` (inserts/updates a key, evicting the least-recently-used entry if the cache is over capacity).',
    inputDescription: 'A sequence of `get`/`put` calls against an `LRUCache` instance with a fixed integer `capacity`.',
    outputDescription: '`get()` returns an integer (the value, or -1).',
    constraints: ['1 <= capacity <= 10,000', 'Keys and values are integers'],
    examples: [
      { input: 'capacity=2; put(1,1); put(2,2); get(1); put(3,3) [evicts 2]; get(2)', output: 'get(1) -> 1, get(2) -> -1' }
    ],
    starterCode: `class LRUCache:
    def __init__(self, capacity):
        # Your code here
        pass

    def get(self, key):
        # Your code here
        pass

    def put(self, key, value):
        # Your code here
        pass`,
    hints: [
      'Python’s `collections.OrderedDict` supports `move_to_end()` and pops from either end in O(1) — exactly the ordering primitive an LRU cache needs.',
      'On `get`, if the key exists, move it to the end (marking it most-recently-used) before returning its value.',
      'On `put`, if adding a new key pushes you over capacity, pop the item from the FRONT (`popitem(last=False)`) — that’s the least-recently-used one.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'basic eviction sequence', assertionCode: `
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
assert cache.get(1) == 1
cache.put(3, 3)  # evicts key 2 (least recently used)
assert cache.get(2) == -1
` },
      { id: 't2', description: 'get refreshes recency', assertionCode: `
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
cache.get(1)      # 1 is now most recently used
cache.put(3, 3)   # evicts 2, not 1
assert cache.get(1) == 1
assert cache.get(2) == -1
assert cache.get(3) == 3
` },
      { id: 't3', description: 'updating an existing key', assertionCode: `
cache = LRUCache(2)
cache.put(1, 1)
cache.put(1, 10)
assert cache.get(1) == 10
` },
      { id: 't4', description: 'missing key returns -1', assertionCode: 'assert LRUCache(1).get(99) == -1' }
    ],
    referenceSolution: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
    explanation: '`OrderedDict` maintains insertion order and exposes O(1) `move_to_end()` and `popitem()` from either end — this is the standard-library primitive that makes an LRU cache a ~15-line implementation instead of needing a hand-rolled doubly-linked list plus hash map.',
    complexityAnalysis: 'Time: O(1) for both `get` and `put`. Space: O(capacity).',
    relatedConcepts: ['collections.OrderedDict', 'Cache eviction policies', 'Amortized O(1) data structures'],
    nextChallengeId: 'merge-intervals'
  },
  {
    id: 'merge-intervals',
    title: 'Merge Overlapping Intervals',
    difficulty: 'advanced',
    category: 'dsa',
    tags: ['sorting', 'greedy', 'intervals'],
    learningObjective: 'Practice the sort-then-sweep pattern for interval problems.',
    problemStatement: 'Write `merge_intervals(intervals)` that takes a list of `[start, end]` pairs and merges all overlapping intervals, returning the merged list sorted by start.',
    inputDescription: 'A list of `[start, end]` two-element lists, where start <= end. Not necessarily sorted or non-overlapping.',
    outputDescription: 'A list of merged, non-overlapping `[start, end]` intervals, sorted by start.',
    constraints: ['0 <= len(intervals) <= 10,000'],
    examples: [
      { input: '[[1, 3], [2, 6], [8, 10], [15, 18]]', output: '[[1, 6], [8, 10], [15, 18]]', explanation: '[1,3] and [2,6] overlap and merge into [1,6].' },
      { input: '[[1, 4], [4, 5]]', output: '[[1, 5]]', explanation: 'Touching endpoints (4 == 4) count as overlapping.' }
    ],
    starterCode: `def merge_intervals(intervals):
    # Your code here
    pass`,
    hints: [
      'Sort the intervals by start value first — this turns "find all overlaps" into a single linear sweep.',
      'Walk through the sorted list, keeping a "current merged interval". If the next interval’s start is <= the current interval’s end, extend the current interval; otherwise, close it out and start a new one.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'classic overlap case', assertionCode: 'assert merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]' },
      { id: 't2', isExample: true, description: 'touching endpoints merge', assertionCode: 'assert merge_intervals([[1, 4], [4, 5]]) == [[1, 5]]' },
      { id: 't3', description: 'no overlaps', assertionCode: 'assert merge_intervals([[1, 2], [3, 4]]) == [[1, 2], [3, 4]]' },
      { id: 't4', description: 'unsorted input', assertionCode: 'assert merge_intervals([[5, 6], [1, 2]]) == [[1, 2], [5, 6]]' },
      { id: 't5', description: 'empty input', assertionCode: 'assert merge_intervals([]) == []' }
    ],
    referenceSolution: `def merge_intervals(intervals):
    if not intervals:
        return []
    sorted_intervals = sorted(intervals, key=lambda iv: iv[0])
    merged = [sorted_intervals[0][:]]
    for start, end in sorted_intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
    explanation: 'Sorting first guarantees that once you move past an interval, no later interval can possibly overlap an EARLIER one you already closed out — that invariant is what makes a single linear sweep sufficient instead of comparing every pair.',
    complexityAnalysis: 'Time: O(n log n), dominated by the sort. Space: O(n) for the sorted copy and result.',
    relatedConcepts: ['Sort-then-sweep pattern', 'Greedy algorithms', 'sorted() with a key function'],
    nextChallengeId: 'longest-unique-substring'
  },
  {
    id: 'longest-unique-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'advanced',
    category: 'dsa',
    tags: ['sliding-window', 'strings', 'two-pointers'],
    learningObjective: 'Recognize and implement the sliding-window pattern for substring problems.',
    problemStatement: 'Write `longest_unique_substring_length(s)` that returns the length of the longest substring of `s` with no repeating characters.',
    inputDescription: 'A string, possibly empty.',
    outputDescription: 'An integer length.',
    constraints: ['0 <= len(s) <= 50,000'],
    examples: [
      { input: '"abcabcbb"', output: '3', explanation: '"abc" is the longest run without a repeat.' },
      { input: '"bbbbb"', output: '1' },
      { input: '"pwwkew"', output: '3', explanation: '"wke" is the longest run without a repeat.' }
    ],
    starterCode: `def longest_unique_substring_length(s):
    # Your code here
    pass`,
    hints: [
      'Keep a sliding window `[left, right]` and a set (or dict) of characters currently inside it.',
      'Expand `right` one character at a time. If that character is already in the window, shrink from `left` until the duplicate is gone.',
      'Track the maximum window size seen at each step.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'classic case', assertionCode: 'assert longest_unique_substring_length("abcabcbb") == 3' },
      { id: 't2', isExample: true, description: 'all repeats', assertionCode: 'assert longest_unique_substring_length("bbbbb") == 1' },
      { id: 't3', isExample: true, description: 'repeat mid-string', assertionCode: 'assert longest_unique_substring_length("pwwkew") == 3' },
      { id: 't4', description: 'empty string', assertionCode: 'assert longest_unique_substring_length("") == 0' },
      { id: 't5', description: 'all unique', assertionCode: 'assert longest_unique_substring_length("abcdef") == 6' }
    ],
    referenceSolution: `def longest_unique_substring_length(s):
    last_seen = {}
    left = 0
    longest = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        longest = max(longest, right - left + 1)
    return longest`,
    explanation: 'Storing each character’s LAST SEEN INDEX (rather than just a membership set) lets `left` jump directly to just past the duplicate in O(1), instead of shrinking the window one character at a time — keeping the whole algorithm O(n) rather than O(n²).',
    complexityAnalysis: 'Time: O(n) — each character is visited by `right` once, and `left` only ever moves forward. Space: O(min(n, alphabet size)) for the `last_seen` dict.',
    relatedConcepts: ['Sliding window', 'Two pointers', 'Amortized linear scans'],
    nextChallengeId: 'coin-change'
  },
  {
    id: 'coin-change',
    title: 'Coin Change (Minimum Coins)',
    difficulty: 'advanced',
    category: 'dsa',
    tags: ['dynamic-programming'],
    learningObjective: 'Practice bottom-up dynamic programming: building a table of subproblem solutions instead of a naive exponential recursion.',
    problemStatement: 'Write `min_coins(coins, amount)` that returns the fewest number of coins (from the given denominations, each usable unlimited times) needed to make exactly `amount`. Return -1 if it’s not possible.',
    inputDescription: '`coins`: a list of positive integer denominations. `amount`: a non-negative integer target.',
    outputDescription: 'An integer, or -1.',
    constraints: ['1 <= len(coins) <= 20', '0 <= amount <= 10,000'],
    examples: [
      { input: 'coins=[1, 2, 5], amount=11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins=[2], amount=3', output: '-1', explanation: 'Odd amount can’t be made from only 2s.' },
      { input: 'coins=[1], amount=0', output: '0' }
    ],
    starterCode: `def min_coins(coins, amount):
    # Your code here
    pass`,
    hints: [
      'Build a list `dp` of size `amount + 1`, where `dp[i]` is the minimum coins needed to make exactly `i`. Initialize with a large "impossible" sentinel value, except `dp[0] = 0`.',
      'For each amount `i` from 1 to `amount`, try every coin `c <= i` and take `dp[i] = min(dp[i], dp[i - c] + 1)`.',
      'If `dp[amount]` is still the sentinel value at the end, return -1.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'classic case', assertionCode: 'assert min_coins([1, 2, 5], 11) == 3' },
      { id: 't2', isExample: true, description: 'impossible amount', assertionCode: 'assert min_coins([2], 3) == -1' },
      { id: 't3', isExample: true, description: 'zero amount', assertionCode: 'assert min_coins([1], 0) == 0' },
      { id: 't4', description: 'single coin denomination', assertionCode: 'assert min_coins([5], 15) == 3' },
      { id: 't5', description: 'unreachable due to no exact denomination', assertionCode: 'assert min_coins([3, 7], 5) == -1' }
    ],
    referenceSolution: `def min_coins(coins, amount):
    INF = float("inf")
    dp = [0] + [INF] * amount
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i and dp[i - c] + 1 < dp[i]:
                dp[i] = dp[i - c] + 1
    return dp[amount] if dp[amount] != INF else -1`,
    explanation: 'This is "bottom-up" DP: `dp[i]` is computed strictly from smaller, already-solved subproblems (`dp[i - c]`), so by the time we reach `dp[amount]` every dependency is already known — avoiding the exponential blowup of a naive recursive solution that re-solves the same sub-amounts repeatedly.',
    complexityAnalysis: 'Time: O(amount × len(coins)). Space: O(amount) for the `dp` table. The naive recursive approach without memoization is exponential.',
    relatedConcepts: ['Dynamic programming', 'Bottom-up tabulation', 'Optimal substructure'],
    nextChallengeId: 'fix-the-bug'
  },
  {
    id: 'fix-the-bug',
    title: 'Debugging Challenge: The Off-By-One Inventory Bug',
    difficulty: 'advanced',
    category: 'debugging',
    tags: ['debugging', 'mutable-defaults'],
    learningObjective: 'Practice recognizing the classic Python "mutable default argument" bug — a footgun that silently shares state across calls.',
    problemStatement: 'The function below is meant to add an item to a NEW inventory list each time it’s called and return that list. It has a bug: calling it multiple times causes items to leak between unrelated calls. Fix `add_item` so each call starts from a fresh, independent list unless the caller explicitly passes one in.',
    inputDescription: 'A string `item`, and an optional list `inventory`.',
    outputDescription: 'A list containing the previous contents of `inventory` (or a fresh list, if none was passed) plus the new item.',
    constraints: ['Do not change the function’s call signature or its observable behavior when a caller DOES pass an explicit list.'],
    examples: [
      { input: 'add_item("sword"); add_item("shield")', output: '["sword"] then ["shield"] — NOT ["sword", "shield"]', explanation: 'Two separate calls with no explicit inventory must not share state.' }
    ],
    starterCode: `# BUGGY — find and fix the issue
def add_item(item, inventory=[]):
    inventory.append(item)
    return inventory`,
    hints: [
      'Python evaluates default argument values exactly ONCE, when the function is defined — not once per call. A mutable default (like `[]`) is therefore the SAME object shared across every call that doesn’t pass its own.',
      'The standard fix: default to `None`, then create a fresh list inside the function body if the caller didn’t provide one.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'two independent calls do not leak state', assertionCode: `
result1 = add_item("sword")
result2 = add_item("shield")
assert result1 == ["sword"]
assert result2 == ["shield"]
` },
      { id: 't2', description: 'explicit inventory still works and is returned', assertionCode: 'assert add_item("potion", ["sword"]) == ["sword", "potion"]' },
      { id: 't3', description: 'explicit empty list works too', assertionCode: 'assert add_item("x", []) == ["x"]' }
    ],
    referenceSolution: `def add_item(item, inventory=None):
    if inventory is None:
        inventory = []
    inventory.append(item)
    return inventory`,
    explanation: 'Because `inventory=[]` is evaluated once at function-definition time, every call that omits the argument was mutating the SAME list object. Defaulting to `None` and constructing a genuinely new list inside the function body is the idiomatic fix — the same discipline as the "mutable default field" pitfall in `@dataclass`.',
    complexityAnalysis: 'Time: O(1) per call (ignoring the append itself). Space: O(1) additional.',
    relatedConcepts: ['Mutable default arguments', 'Function definition-time vs call-time evaluation'],
    nextChallengeId: 'refactor-report'
  },
  {
    id: 'refactor-report',
    title: 'Refactoring Challenge: Untangle the Report Generator',
    difficulty: 'advanced',
    category: 'refactoring',
    tags: ['refactoring', 'readability'],
    learningObjective: 'Practice improving structure and readability of working code WITHOUT changing its observable behavior — a core software-engineering skill distinct from just "making tests pass".',
    problemStatement: 'The function below works correctly but is hard to maintain: deeply nested conditionals, a magic number, and a repeated string-formatting pattern. Refactor `summarize_orders` to be clearer (e.g. early returns, a named constant, a helper function) while producing IDENTICAL output for the same inputs.',
    inputDescription: 'A list of dicts, each with `"amount"` (a number) and `"status"` (a string: "paid", "pending", or "cancelled").',
    outputDescription: 'A string summary in the exact same format the original produces.',
    constraints: ['Output text must match exactly — this is a pure refactor, not a feature change.'],
    examples: [
      {
        input: '[{"amount": 150, "status": "paid"}, {"amount": 40, "status": "pending"}]',
        output: '"2 orders: 1 paid ($150.00), 1 pending, 0 cancelled. High-value paid orders: 1."'
      }
    ],
    starterCode: `# WORKS, BUT HARD TO MAINTAIN — refactor without changing behavior
def summarize_orders(orders):
    paid_count = 0
    paid_total = 0
    pending_count = 0
    cancelled_count = 0
    high_value_paid = 0
    for o in orders:
        if o["status"] == "paid":
            paid_count = paid_count + 1
            paid_total = paid_total + o["amount"]
            if o["amount"] > 100:
                high_value_paid = high_value_paid + 1
        else:
            if o["status"] == "pending":
                pending_count = pending_count + 1
            else:
                if o["status"] == "cancelled":
                    cancelled_count = cancelled_count + 1
    return str(len(orders)) + " orders: " + str(paid_count) + " paid ($" + format(paid_total, ".2f") + "), " + str(pending_count) + " pending, " + str(cancelled_count) + " cancelled. High-value paid orders: " + str(high_value_paid) + "."`,
    hints: [
      'Replace the nested if/else chain with independent `if`/`elif` branches keyed on `o["status"]` — there’s no need to nest once you realize the statuses are mutually exclusive.',
      'Extract the magic number `100` into a named constant like `HIGH_VALUE_THRESHOLD`.',
      'An f-string replaces the long chain of `+` string concatenation and is far easier to read — just make sure the final text matches character-for-character.'
    ],
    testCases: [
      { id: 't1', isExample: true, description: 'matches original output exactly', assertionCode: 'assert summarize_orders([{"amount": 150, "status": "paid"}, {"amount": 40, "status": "pending"}]) == "2 orders: 1 paid ($150.00), 1 pending, 0 cancelled. High-value paid orders: 1."' },
      { id: 't2', description: 'empty list', assertionCode: 'assert summarize_orders([]) == "0 orders: 0 paid ($0.00), 0 pending, 0 cancelled. High-value paid orders: 0."' },
      { id: 't3', description: 'cancelled orders counted', assertionCode: 'assert summarize_orders([{"amount": 10, "status": "cancelled"}]) == "1 orders: 0 paid ($0.00), 0 pending, 1 cancelled. High-value paid orders: 0."' },
      { id: 't4', description: 'exactly at threshold is not high-value', assertionCode: 'assert summarize_orders([{"amount": 100, "status": "paid"}]) == "1 orders: 1 paid ($100.00), 0 pending, 0 cancelled. High-value paid orders: 0."' }
    ],
    referenceSolution: `HIGH_VALUE_THRESHOLD = 100

def summarize_orders(orders):
    paid_count = paid_total = pending_count = cancelled_count = high_value_paid = 0

    for order in orders:
        status = order["status"]
        if status == "paid":
            paid_count += 1
            paid_total += order["amount"]
            if order["amount"] > HIGH_VALUE_THRESHOLD:
                high_value_paid += 1
        elif status == "pending":
            pending_count += 1
        elif status == "cancelled":
            cancelled_count += 1

    return (
        f"{len(orders)} orders: {paid_count} paid (\${paid_total:.2f}), "
        f"{pending_count} pending, {cancelled_count} cancelled. "
        f"High-value paid orders: {high_value_paid}."
    )`,
    explanation: 'Nothing about the LOGIC changed — only its shape. Flattening the nested if/else into sibling `elif` branches removes two levels of indentment without changing which branch runs for which status, and the f-string is byte-for-byte identical output to the original concatenation chain, just far easier to review for correctness.',
    complexityAnalysis: 'Time: O(n) before and after — refactoring preserved the algorithmic complexity, only the code structure changed. Space: O(1) additional.',
    relatedConcepts: ['Code readability', 'Named constants over magic numbers', 'Behavior-preserving refactoring']
  }
];

export const CHALLENGE_CATEGORIES: { id: string; label: string }[] = [
  { id: 'fundamentals', label: 'Fundamentals' },
  { id: 'dsa', label: 'Data Structures & Algorithms' },
  { id: 'oop', label: 'Object-Oriented Programming' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'real-world', label: 'Real-World Scenarios' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'refactoring', label: 'Refactoring' }
];
