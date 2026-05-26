# KingScript Syntax Examples
- Defining a numeric variable
```kingscript
// Define a numeric variable
let age: number = 25;
console.log("Age:", age);
```
- Defining a string variable
```kingscript
// Define a string variable
let name: string = "Alice";
console.log("Name:", name);
```
- Defining an array variable
```kingscript
// Define a numeric array
let numbers: number[] = [1, 2, 3, 4, 5];
console.log("Numbers:", numbers);
// Or define it using generic syntax
let strings: Array<string> = ["Hello", "World"];
console.log("Strings:", strings);
```
- Defining a tuple
```kingscript
// Define a tuple containing a string and a number
let person: [string, number] = ["Bob", 30];
console.log("Person:", person);
```
- Defining an enum
```kingscript
// Define an enum
enum Color {
    Red,
    Green,
    Blue
}
let favoriteColor: Color = Color.Green;
console.log("Favorite Color:", favoriteColor); 
// Output: 1
```
- Defining a boolean variable
```kingscript
// Define a boolean variable
let isActive: boolean = true;
console.log("Is Active:", isActive);
```
- BigDecimal type variable
```kingscript
// Built-in type, a numeric object equivalent to Java's BigDecimal, used for precise numeric calculations; at runtime it is created as a BigDecimal object in the JVM.
let a = new BigDecimal("0.1");
let b = new BigDecimal("0.2");
let c = a.add(b);
```
- BigInt type variable
```kingscript
// BigInt was introduced in ECMAScript 2020 (ES11) to address the precision issues with large integers in JavaScript
let number1 = 12345678912312n;
let number2 = BigInt(12345678912312);
let number3 = BigInt('12345678912312');
// Operations (same type)
let value1 = number1 + number2;
let value2 = number2 * 123n;
```
- Collection type variables
```kingscript
// Built-in types, similar to Java collections, including HashMap, TreeMap, ArrayList, LinkedList, HashSet, TreeSet.
// They need to be imported from @cosmic/bos-script, for example:
import { HashMap } from "@cosmic/bos-script/java/util"
let map = new HashMap()
map.put("key", "value")
```
- fori loop
```kingscript
// Use a fori loop to iterate over an array
let fruits: string[] = ["Apple", "Banana", "Cherry"];
for (let i: number = 0; i < fruits.length; i++) {
    console.log(`Fruit ${i}:`, fruits[i]);
}
```
- for of loop
```kingscript
// Use a for...of loop to iterate over an array
let colors: string[] = ["Red", "Green", "Blue"];
for (const color of colors) {
    console.log("Color:", color);
}
```
- Interface definition
```kingscript
// Define an interface
interface Person {
    name: string;
    age: number;
    isStudent: boolean;
}
// Use the interface to define an object
let alice: Person = {
    name: "Alice",
    age: 20,
    isStudent: true
};
```
- Class definition
```kingscript
// Define a class
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    speak(): void {
        console.log(`${this.name} makes a sound.`);
    }
}
// Use the class
let myAnimal = new Animal("Dog");
myAnimal.speak();
// Output: Dog makes a sound.
```