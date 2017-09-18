---
license: 'public-domain'
---
# Test 2: Import

When working with Angular and Angular CLI, you ended up quickly with a lot of folders as the application grows. The default behavior of CLI generates a folder with at least the class, css, html and test component file.

If you don't have the habit to work with this amount of file, this can make the maintainability difficult. It is kinds of `callback hell` but for folder and files, in my opinion :).

For some time, I was digging more into Vue.js and saw `Single File Components`.
![Single File Components](https://vuejs.org/images/vue-component.png)

One file containing:
- your template between the `template` tags
- your JavaScript, between the `script` tags, that controls the components
- your CSS between the `style` tags

I liked keeping it all in one place. So let's try to do the same with Angular using Angular CLI.

For reference, I’m using Angular 4.3.3, [Angular-CLI 1.3.1](https://github.com/angular/angular-cli/releases/tag/v1.3.1)


## Project setup

If you didn’t yet install Angular-CLI, please follow the installation guide [here](https://github.com/angular/angular-cli#installation).

Go ahead and create a new Angular-CLI project using `ng new single-file-component`.

We got fresh a project structure

![](http://i.imgur.com/P4922ZP.png)

## Path to inline

By default, Angular CLI is not configured to **inline** the template and the style of the component, it creates the HTML and CSS file.
Therefore, we have to use `templateUrl` and `styleUrls` to reference the corresponding file(s) to the component.

```ts
// app.component.ts
@Component({
  selector: 'app-root',
  // Relative path to the template file
  templateUrl: './app.component.html',
  // Relative path to the style file
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
```

Let's inline the template and the CSS by using the inline version `templateUrl` and `styleUrls`.

### templateUrl -> template

We substitute `templateUrl` by the inline option `template` and we copied the `app.component.html` content between the `template string`.

![](http://i.imgur.com/qi9vVT2.png)

### styleUrls -> styles

Let us do the same for the `styleUrls`, we change it to `styles`. Then, refactor the inline style in HTML template to a CSS class (`.center-text`). Note: that `styles`is waiting for an array of string like `styleUrls` with the array of the path.

![](http://i.imgur.com/kgZt5VF.png)


Congrats, you can now remove the `app.component.html` and `app.component.css`



As explained above, the Angular CLI is not configured to inline the template and CSS automatically. Doing manually the inlining can time consuming if we have to do it every time by yourself. Therefore, let's update the the `angular.cli.json` aka `Angular CLI Config Schema` to perform this task for us.

## angular.cli.json customization

By default, the `angular.cli.json` looks like:
```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "project": {
    "name": "single-file-component"
  },
  "apps": [
    {
      "root": "src",
      "outDir": "dist",
      "assets": [
        "assets",
        "favicon.ico"
      ],
      "index": "index.html",
      "main": "main.ts",
      "polyfills": "polyfills.ts",
      "test": "test.ts",
      "tsconfig": "tsconfig.app.json",
      "testTsconfig": "tsconfig.spec.json",
      "prefix": "app",
      "styles": [
        "styles.css"
      ],
      "scripts": [],
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    }
  ],
  "e2e": {
    "protractor": {
      "config": "./protractor.conf.js"
    }
  },
  "lint": [
    {
      "project": "src/tsconfig.app.json",
      "exclude": "**/node_modules/**"
    },
    {
      "project": "src/tsconfig.spec.json",
      "exclude": "**/node_modules/**"
    },
    {
      "project": "e2e/tsconfig.e2e.json",
      "exclude": "**/node_modules/**"
    }
  ],
  "test": {
    "karma": {
      "config": "./karma.conf.js"
    }
  },
  "defaults": {
    "styleExt": "css",
    "component": {}
  }
}
```

For your task, we will update the defaultsoption ( at the end) that specifies the default values when the CLI generates files.

We will update thecomponentsoptions for generating a component by adding:
- `inlineStyle` : `true'
- `inlineTemplate` : `true'

Your  `defaults` option in `angular.cli.json` should look like :
```json
"defaults": {
    "styleExt": "css",
    "component": {
      "inlineStyle":true,
      "inlineTemplate":true
    }
}
```
From now, generating a new component will inline the style and template for you.

They are several other options available, I invite you to check them out [here](https://github.com/angular/angular-cli/wiki/angular-cli)

This was a single file component in Angular. You can find the full source code [here](https://github.com/b-barry/angular-single-file-component).

Thanks for reading :)



