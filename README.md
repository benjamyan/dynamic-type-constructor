A ts function that takes a string and returns a concatenation of the interfaces and types associated with the matches inside of the string. Its hyper expensive, unnecessary, but a fun experiment with Typescript. It checks longest strings first, but it can be modified to check shorter by reversing our integer assignments.

1. Initializes and checks for the string length; if its greater than zero, proceed
2. Sets two axis - one at the beginning (x1) one at the end (x2)
3. Recursively reduces `x2` by 1 integer on every pass, and compares the string from `x1` to `x2` against the given type(s)
4. If there is a match, its added to the stack and the length of the match (`Len`) is replaced with a nullish char. `x2` is reduced by `Len`, `x1` is reset to 1
5. Continues until `x2` has reached the beginning of the string
6. Leftover strings between nullish chars are then tested for matches where `x1` and `x2` are relative to the beginning and end of a string between nullish chars
7. when `x1` has reached the length of the given string, checking is stopped and the type stack is concatenated and turned into a Union type
