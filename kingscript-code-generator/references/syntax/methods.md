## Methods

In KingScript, methods allow us to encapsulate reusable code logic and perform flexible operations through parameters and return values.

### 1. Defining a method

Methods are declared with the `function` keyword, followed by the method name and parameter list.

#### 1.1 Regular methods

```kingscript
function greet(name: string): string {
    return `Hello, ${name}!`;
}

console.log(greet("KingScript"));  // Output: Hello, KingScript!
```

#### 1.2 Default parameters
KingScript allows specifying default values for method parameters. If the parameter is not provided when calling the method, the default value will be used.

```kingscript
function greet(name: string = "Guest"): string {
    return `Hello, ${name}!`;
}

console.log(greet());       // Output: Hello, Guest!
console.log(greet("Kingdee"));  // Output: Hello, Kingdee!
```

#### 1.3 Variadic parameters
A method can also accept an indefinite number of parameters, which are packaged into an array.
```kingscript
function sum(...numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
}

console.log(sum(1, 2, 3, 4));  // Output: 10
```

### 2. Method overloading
In KingScript, we can also define parameters that allow multiple types.
```kingscript
// Overload 1
function padLeft(padding: number, input: string): string {
    return " ".repeat(padding) + input;
}
// Overload 2
function padLeft(padding: string, input: string): string {
    return padding + input;
}
// The two overloaded methods above can be merged into a single method
function padLeft(padding: number | string, input: string): string {
    if (typeof padding === "number") {
      return " ".repeat(padding) + input;
    }
    return padding + input;
}
```

### 3. Arrow functions
KingScript supports arrow function syntax, which makes defining anonymous methods more concise.
```kingscript
const multiply = (a: number, b: number): number => a * b;

console.log(multiply(5, 3));  // Output: 15
```

### 4. Conclusion
Methods are a key component for achieving code reuse and logic encapsulation. By mastering features such as method definition, overloading, and arrow functions,
you can organize code effectively and improve development efficiency.

Next, we'll learn about [classes](classes.md)!