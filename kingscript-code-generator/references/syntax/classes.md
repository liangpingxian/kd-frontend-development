## Classes

In KingScript, a class is a data structure used to define a blueprint for objects. It lets us create object instances that share the same properties and methods. KingScript inherits from TypeScript, so its class syntax is similar to TypeScript.

### 1.1 Class declaration

Use the `class` keyword to declare a class:

```kingscript
class Person {
    // Class body
}
```

### 1.2 Class properties and methods
A class can contain properties (variables) and methods (functions). They can be instance members.
```kingscript
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): void {
        console.log(`Hello, my name is ${this.name}`);
    }
}
```
- `constructor` is the class's constructor, used to initialize a newly created object.
- Instance methods use the `this` keyword to access instance properties.

> KingScript does not support the use of static variables.

### 1.3 Instantiating a class
Use the `new` keyword to create an instance of a class:
```kingscript
let person = new Person("Kingdee", 31);
person.greet(); // Output: Hello, my name is Kindee
```

### 1.4 Inheritance
KingScript supports class inheritance. Use the `extends` keyword to create a subclass:
```kingscript
class Animal {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    move(): void {
        console.log(`${this.name} is moving`);
    }
}

class Dog extends Animal {
    bark(): void {
        console.log(`${this.name} is barking`);
    }
}

let dog = new Dog("Buddy");
dog.move();  // Output: Buddy is moving
dog.bark(); // Output: Buddy is barking

```

### 1.5 Access control
KingScript provides access control modifiers to restrict the visibility of class members:
- `public`: the default; can be accessed anywhere.
- `private`: can only be accessed inside the class where it is declared.
- `protected`: can be accessed inside the declaring class and its subclasses.
```kingscript
class Person {
    private name: string;

    protected sayHello(): void {
        console.log("Hello");
    }

    public getName(): string {
        return this.name;
    }
}

let person = new Person();
person.getName(); // Allowed
person.sayHello(); // Error: protected methods cannot be accessed outside the class
```

### 1.6 Common use cases for classes
- Defining the behavior and properties of objects
- Implementing inheritance and polymorphism
- Providing code reusability
- Conveniently managing different components in complex systems

Through classes, we can better organize the structure of our code and improve a program's maintainability and extensibility.

Next we'll learn about [interfaces](interfaces.md).
