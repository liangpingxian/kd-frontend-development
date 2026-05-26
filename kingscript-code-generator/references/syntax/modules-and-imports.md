## Modules and Imports

The Cosmic platform uses KingScript to wrap its Java SDK API. The wrapped SDK is called the Script SDK API, and the APIs are grouped into packages by functional category, called script modules (similar to npm modules).

### 1 Common script modules
- @cosmic/bos-script: The script engine module, which defines basic types and global variables.
- @cosmic/bos-util: A common utility module that provides json, http, and more.
- @cosmic/bos-core: The Cosmic platform's core functionality module, including id, db, orm, mq, algo, log, etc.
- @cosmic/bos-framework: The application framework module, including plugins, controls, events, and more.

The SDK also has internal modules whose names contain `-internal-`; they are for platform use only and must not be used in secondary development. Examples include @cosmic/bos-internal-jdk and @cosmic/bos-internal-sdk; execution is restricted and will throw an interrupt exception.

### 2 Module naming conventions
The Kingdee Cloud Cosmic Script Development Platform automatically generates script paths according to the following rule:
```
@Product/Cloud-ISV/Application/ScriptPluginCode.ts
```
Developers can use this path to quickly locate a script in the code resource files.

### 3 Importing modules
We can import common Java types in a script — for example, ArrayList — but note that the imported types currently do not support generics.

```kingscript
import { ArrayList } from '@cosmic/bos-script/java/util'

let list = new ArrayList();
list.add("hello");
```