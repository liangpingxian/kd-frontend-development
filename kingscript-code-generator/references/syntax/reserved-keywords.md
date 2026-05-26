## Overview
`KingScript` is based on `TypeScript` syntax. The reserved keywords are as follows:

### 1. JavaScript reserved keywords

| Reserved keyword | Description |
|-----------|-----|
| `break`     |	Used to terminate a loop or `switch` statement. |
| `case`      |		Used in a `switch` statement to specify a conditional branch. |
| `catch`     |		Used in a `try...catch` statement to catch exceptions. |
| `class`     |		Used to define a class. (Introduced in ES6) |
| `const`     |		Used to declare a constant; its value cannot be changed once assigned. |
| `continue`  |		Used to skip the remainder of the current loop iteration and continue with the next. |
| `debugger`  |		Used to set a breakpoint in code, pausing execution during debugging. |
| `default`   |		Used in a `switch` statement to specify the default branch. |
| `delete`    |		Used to delete a property of an object. |
| `do`        |		Used in a `do...while` loop; executes the loop body first, then checks the condition. |
| `else`      |		Used in an `if...else` statement to specify the code block to execute when the condition is not met. |
| `enum`      |		Used to define an enumeration type. (Introduced in ES6) |
| `export`    |		Used to export modules, functions, classes, etc., so they can be used in other modules. (Introduced in ES6) |
| `extends`   |		Used in a class declaration to specify the parent class to inherit from. (Introduced in ES6) |
| `false`     |		A boolean value representing false. |
| `finally`   |		Used in a `try...finally` statement to specify a code block that will execute regardless of whether an exception occurs. |
| `for`       |		Used in a `for` loop to repeatedly execute a code block. |
| `function`  |		Used to declare a function. |
| `if`        |		Used for conditional checks, executing different code blocks based on the condition. |
| `implements` |		Used in a class declaration to specify the interface a class implements. |
| `import`    |		Used to import modules, functions, classes, etc. (Introduced in ES6) |
| `in`        |		Used in a `for...in` loop to iterate over the enumerable properties of an object. |
| `instanceof` |		Used to check whether an object is an instance of a particular class. |
| `interface` |		Used to define an interface, declaring the structure of an object. |
| `let`       |		Used to declare a block-scoped variable. (Introduced in ES6) |
| `new`       |		Used to create an instance of an object. |
| `null`      |		Represents a null value. |
| `package`   |		Used to declare the package information of a module. |
| `private`   |		Used in classes to declare private members. |
| `protected` |		Used in classes to declare protected members. |
| `public`    |		Used in classes to declare public members. |
| `return`    |		Used to return a value from a function. |
| `static`    |		Used in classes to declare static members. |
| `super`     |		Used to access the constructor and methods of the parent class. |
| `switch`    |		Used in a `switch` statement to perform multi-way conditional checks. |
| `this`      |		Used to refer to the instance of the current object. |
| `throw`     |		Used to throw an exception. |
| `true`      |		A boolean value representing true. |
| `try`       |		Used in a `try...catch` statement to attempt to execute a code block. |
| `typeof`    |		Used to obtain the type of a variable. |
| `var`       |		Used to declare a variable. (ES5 and earlier) |
| `void`      |		Used to indicate that a function has no return value. |
| `while`     |		Used in a `while` loop to repeatedly execute a code block based on a condition. |
| `with`      |		Used to extend the scope chain. (Not recommended) |
| `yield`     |		Used in a generator function to pause and resume the generator. (Introduced in ES6) |

### 2. TypeScript-specific reserved keywords
| Reserved keyword | Description |
|-------------|----|
| `any`         |  Represents any type. |
| `boolean`     |  Represents the boolean type. |
| `constructor` |  Used to define the constructor in a class. |
| `declare`     | Used to declare global variables, functions, etc. |
| `enum`        |  Used to define an enumeration type. |
| `number`      |  Represents the numeric type. |
| `string`      |  Represents the string type. |
| `symbol`      | Represents the symbol type. (Introduced in ES6) |
| `type`        |  Used to define a type alias. |
| `undefined`   |  Represents the undefined type. |

### 3. Contextual keywords

| Reserved keyword | Description                 |
|-----------|--------------------|
| `abstract`  | Used to declare abstract classes and abstract methods. |
| `as`        | Used for type assertions, asserting a value as a specific type. |
| `async`     | Used to declare an asynchronous function. |
| `await`     | Used to wait for a `Promise` to resolve. |
| `from`      | Used in an `import` statement to specify the path of a module. |
| `get`       | Used to define a `getter` method. |
| `is`        | Used in a type predicate to declare the type returned by a function. |
| `keyof`     | Used to obtain a union type of the keys of a type. |
| `module`    | Used to declare a module. (Replaced by `namespace` in ES6) |
| `namespace` | Used to declare a namespace. |
| `never`     | Represents a type that never occurs. |
| `readonly`  | Used to declare a read-only property. |
| `require`   | Used to import a module. (Replaced by `import` in ES6) |
| `set`       | Used to define a `setter` method. |
| `unique`    | Used to declare a unique type. |
| `unknown`   | Represents an unknown type. |
| `using`     | Used to declare a resource for use. |

### 4. Future reserved keywords
| Reserved keyword | Description        |
|--------------|-----------|
| `abstract`     | An abstract class or method. |
| `byte`         | The byte type. |
| `char`         | The character type. |
| `double`       | The double-precision floating-point type. |
| `final`        | A final class or method. |
| `float`        | The single-precision floating-point type. |
| `goto`         | A jump statement. (Not recommended) |
| `int`          | The integer type. |
| `long`         | The long integer type. |
| `native`       | A native method. |
| `short`        | The short integer type. |
| `synchronized` | A synchronized method. |
| `throws`       | Declares thrown exceptions. |
| `transient`    | A transient variable. |
| `volatile`     | A volatile variable. |

### 5. KingScript-specific keywords

| Reserved keyword | Description      |
|-------|---------|
| `$`     | Global reserved keyword |
