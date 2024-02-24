
### Project Initialization 

#### Create project

- Initialize a new Node.js project (if you haven't already): Open a terminal and run the following commands in your project directory (you can create a new directory for your project if you haven't done so).

```console
mkdir my-typescript-app
cd my-typescript-app
npm init -y
```

#### Install TS

- Install TypeScript and ts-node (optional): ts-node is useful for running TypeScript files directly without having to compile them to JavaScript first.

```console
npm install typescript ts-node --save-dev
```

- Create a tsconfig.json file: This file specifies the root files and the compiler options required to compile the project.

```
npx tsc --init
```

#### Code

Create your first TypeScript file: In your project's root directory, create a new file named app.ts (or any other name you prefer).

```ts
// app.ts
console.log('Hello, TypeScript!');
```

```
npx tsc
```

- This command will compile all TypeScript files in your project according to the settings in tsconfig.json. The compiled JavaScript files will by default be output to the same directory.

Run your TypeScript file directly (optional): If you prefer to run your TypeScript file directly without explicitly compiling it to JavaScript, you can use ts-node:

```
npx ts-node app.ts
```

- Scripts in package.json (optional):
For convenience, you can add scripts to your package.json to compile and run your app more easily.

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node .",
    "start:ts": "ts-node app.ts"
  }
}
```


### COMMANDS

```
npx ts-node src/app.ts

npm run start:app
```



```
npx ts-node src/demo-load.ts

npm run start:app
```