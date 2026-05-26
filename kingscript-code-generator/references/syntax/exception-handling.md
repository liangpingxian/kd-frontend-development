## Exception Handling

In KingScript, exception handling is a mechanism used to catch and handle errors or exceptional conditions that occur during program execution.

### 1.1 Catching exceptions

The `try...catch` structure can catch and handle exceptions:

```kingscript
try {
    const invalidJson = "{name: 'John'}"; // Missing double quotes, not valid JSON
    const data = JSON.parse(invalidJson);
    console.log(data.name);
} catch (error) {
    console.log(error); // Outputs Expected property name or '}' in JSON at position 1 (line 1 column 2)
}
```

In the example above, an `Error` exception is thrown and caught for handling.

### 1.2 finally block

The `finally` block specifies code that will be executed regardless of whether an exception is caught:

```kingscript
try {
    const invalidJson = "{\"name\": \"John\"}"; 
    const data = JSON.parse(invalidJson);
    console.log(data.name);
} catch (error : any) {
    console.error("Error occurred:", error.message);
} finally {
    console.log("Will execute no matter what");
}
```

### 1.3 Throwing exceptions

Use the `throw` keyword to throw an exception:

```kingscript
function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error('Divisor cannot be 0');
    }
    return a / b;
}

try {
    const result = divide(10, 0);
    console.log('Result:', result);
} catch (error : any) {
    console.log('Caught exception:', error.message);
}
```

### 1.4 Recommendations for exception handling

Although we've demonstrated how to intercept exceptions and print logs, we strongly recommend:

> Do not intercept exceptions, print logs, and then continue executing code or return null. This makes the product seem stable but actually hides many bugs.

The recommended approaches are:
- Do not intercept exceptions; let them be handled uniformly by the outside.
- Or, intercept the exception and re-throw a more friendly one — for example, an exception message that includes the document number to make troubleshooting easier.

Also, be careful not to include sensitive, private, or confidential information in exception messages.

---

Now that we've learned how to handle exceptions, next we'll learn about [modules and imports](modules-and-imports.md).