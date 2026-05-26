## Loops

In KingScript, loops are used to repeatedly execute a block of code. The main forms are `for` loops and `while` loops.

### 1.1 for loop

A `for` loop is suitable when the number of iterations is known.

```kingscript
for (let i = 0; i < 5; i++) {
    console.log("Current value: " + i);
}
```

### 1.2 Iterating over an array of objects

If you have an array composed of multiple objects and need to filter out those matching a specific condition, you can use `for...of` to iterate:

```kingscript
let users = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 40 },
    { name: "Charlie", age: 25 }
];

for (let user of users) {
    if (user.age > 30) {
        console.log(user.name + " is over 30 years old");
    }
}
```

### 1.3 while loop

A `while` loop is suitable when the number of iterations is unknown and depends on a certain condition.

```kingscript
let count = 0;
while (count < 5) {
    console.log("Current value: " + count);
    count++;
}
```

### 1.4 Exiting a loop

You can use `break` to exit a loop,

```kingscript
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break;  // Exit the loop
    }
    console.log(i);
}
```
or use `continue` to skip the current iteration.

```kingscript
for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
        continue;  // Skip even numbers
    }
    console.log(i);
}
```

---

This is the third chapter of KingScript — Loops. Next, we'll learn about [methods](methods.md)!