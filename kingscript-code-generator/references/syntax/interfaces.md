## Interfaces

In KingScript, an interface is an abstract type used to define the structure of an object. It describes the properties and methods an object should have, but does not provide a concrete implementation.

### 1.1 Interface declaration

Use the `interface` keyword to declare an interface:

```kingscript
interface Person {
    name: string;
    age: number;
}
```

### 1.2 Implementing an interface

A class can implement an interface using the `implements` keyword to ensure it meets the interface's requirements:

```kingscript
class Employee implements Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}
```

### 1.3 Optional properties

Properties in an interface can be optional, indicated using the `?` symbol:

```kingscript
interface Person {
    name: string;
    age?: number; // Optional property
}

let person1: Person = { name: "Alice" };
let person2: Person = { name: "Bob", age: 30 };
```

### 1.4 Function-type interfaces

Interfaces can also define function signatures, so you can call them like a function:

```kingscript
interface GreetFunction {
    (name: string): void;
}

function greet(fn: GreetFunction) {
    fn("Hello, World!");
}
```

### 1.5 Interface inheritance

Interfaces can inherit from other interfaces to extend their functionality:

```kingscript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    bark(): void;
}

let dog: Dog = { name: "Buddy", bark() { console.log("Woof!"); } };
```

### 1.6 Combining interfaces and classes

Interfaces can be used to describe the structure of a class, while the class provides the concrete implementation:

```kingscript
interface Shape {
    area(): number;
}

class Circle implements Shape {
    radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    area(): number {
        return Math.PI * this.radius ** 2;
    }
}
```

### 1.7 Interfaces vs type aliases

Both interfaces and type aliases can be used to define object structures, but they differ in usage scenarios:

- Interfaces are mainly used to describe the structure of a class.
- Type aliases can be used to define aliases for any type.

```kingscript
interface Person {
    name: string;
}

type Point = { x: number; y: number };
```

### 1.8 Hello, Interface!

We can use an interface to define a simple `Person` interface, and create a class that implements it:

```kingscript
interface Person {
    name: string;
    age?: number;
}

class Employee implements Person {
    name: string;
    age?: number;

    constructor(name: string, age?: number) {
        this.name = name;
        this.age = age;
    }
}

let employee: Employee = new Employee("Alice", 30);
console.log(employee); // Outputs { name: "Alice", age: 30 }
```

Output:

```json
{
  "name": "Alice",
  "age": 30
}
```

---

This is the third chapter of KingScript — Interfaces. Next, we'll learn about [exception handling](exception-handling.md)!