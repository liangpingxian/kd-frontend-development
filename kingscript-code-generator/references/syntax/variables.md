## Variables

In KingScript, variables are used to store data and can be accessed and modified in different parts of a program. KingScript inherits from TypeScript, so variable declarations are similar to TypeScript.

### 1.1 Variable declaration

In KingScript, variables can be declared using the `let` or `const` keyword:

```kingscript
let message: string = "Hello, KingScript!";
const amount = new BigDecimal("3.33");  // Always use BigDecimal for financial calculations; avoid the number type to prevent floating-point errors
```

- `let` declares variables that can be reassigned.
- `const` declares variables that cannot be reassigned (constants).

### 1.2 Variable types

KingScript supports several data types, including:

- `string`: textual data
- `number`: integers and floating-point numbers; always use BigDecimal for financial calculations
- `boolean`: `true` or `false`
- `array`: a collection of values of the same type
- `object`: a collection of key-value pairs

Example:

```kingscript
let username: string = "Alice";
let age: number = 30;
let isStudent: boolean = false;
let numbers: number[] = [1, 2, 3, 4, 5];
let user: { name: string; age: number } = { name: "Alice", age: 30 };
```

### 1.3 Variable initialization and modification

Variables declared with `let` can be reassigned, while variables declared with `const` cannot be modified.

```kingscript
let greeting: string = "Hello";
greeting = "Hi there!";  // Allowed

const country: string = "China";
country = "USA";  // Error: const variables cannot be modified
```

### 1.4 Hello, World!

We can use a variable to store the classic `Hello, World!` text and print it to the console:

```kingscript
let message: string = "Hello, World!";
console.log(message);
```

Output:

```
Hello, World!
```

---

This is the first chapter of KingScript — Variables. Next, we'll learn about [conditionals](conditionals.md)!