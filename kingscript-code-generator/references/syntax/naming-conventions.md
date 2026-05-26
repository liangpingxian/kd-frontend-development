# Naming Conventions

## Table of Contents
1. [File naming](#file-naming)
2. [Interface naming](#interface-naming)
3. [Class naming](#class-naming)
4. [Method naming](#method-naming)
5. [Property naming](#property-naming)
---
### 1. File naming
`KingScript` script file naming conventions are similar to `Java`'s. The supported characters are letters, digits, and underscores (digits cannot appear at the beginning), and interfaces start with "I".
A `KingScript` script name cannot exceed **50** characters.
#### Valid names
```kingscript
Person.ts
IAnimal.ts
Dog1.ts
Cat_1.ts
_MyPlugin.ts
```
#### Invalid names
```kingscript
Person 1.ts // Spaces are not allowed
1Cat.ts // Cannot start with a digit
```
#### Recommended names
`KingScript` can be used in a variety of business and functional scenarios such as plugins, operations, and business extension points. Names can combine the document, function, and other context to convey clear business meaning; a good name lets you tell the script's purpose at a glance.
```kingscript
SaveAfterOperator.ts // Plugin executed after a save operation
ChangeOrderStatusBillPlugin.ts // Bill plugin for changing the order status
```
### 2. Interface naming
Interface names are recommended to start with `I` and use UpperCamelCase (first letter capitalized).
```kingscript
interface IAnimal {
  name: string
}
```
### 3. Class naming
Class names are recommended to use UpperCamelCase (first letter capitalized).
```kingscript
class Dog implements IAnimal{
    constructor(){
        this.name = "dog";
    }
}
```
### 4. Method naming
Method names use lowerCamelCase (first letter lowercase).
```kingscript
class Dog implements IAnimal{
    constructor(){
        this.name = "dog";
    }
    getName():string{
        return this.name;
    }
}
```
### 5. Variable naming
Variable names use lowerCamelCase (first letter lowercase).
```kingscript
class Dog implements IAnimal{
    // Class property declaration
    color:string
    constructor(name:string,color:string){
        this.color = color;
    }
    getColor():string{
        return this.color;
    }
    toString():string{
        // Local variable declaration
        let colorPrefix:string = "Dog color is:";
        return colorPrefix + this.color;
    }
}
```