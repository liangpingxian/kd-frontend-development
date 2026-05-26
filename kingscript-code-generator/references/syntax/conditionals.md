## Conditionals

In KingScript, we can use the `if`, `else if`, and `else` keywords to perform conditional checks and control the execution flow of code.

### 1.1 if statement

The `if` statement executes a block of code when a condition is met.

```kingscript
let score = 85;
if (score >= 60) {
    console.log("Pass");
}
```

### 1.2 if-else statement

When the condition is not met, we can use `else` to provide alternative execution logic.

```kingscript
let score = 50;
if (score >= 60) {
    console.log("Pass");
} else {
    console.log("Fail");
}
```

### 1.3 if-else if-else statement

If there are multiple conditions to evaluate, you can use `else if`:

```kingscript
let score = 85;
if (score >= 90) {
    console.log("Excellent");
} else if (score >= 60) {
    console.log("Pass");
} else {
    console.log("Fail");
}
```

### 1.4 Ternary operator

KingScript also supports the ternary operator (`? :`) for simplifying simple conditional checks.

```kingscript
let score = 75;
let result = score >= 60 ? "Pass" : "Fail";
console.log(result);
```

Output:

```
Pass
```

### 1.5 switch statement

The `switch` statement executes different blocks of code based on different values, and is suitable for cases involving multiple conditional checks.

```kingscript
let grade = "B";
switch (grade) {
    case "A":
        console.log("Excellent");
        break;
    case "B":
        console.log("Good");
        break;
    case "C":
        console.log("Pass");
        break;
    default:
        console.log("Fail");
}
```

Output (when `grade` is "B"):

```
Good
```

The `switch` statement is clearer than `if-else` when checking against multiple values, and avoids verbose `if` structures.

---

This is the second chapter of KingScript — Conditionals. Next, we'll learn about [loops](loops.md)!

