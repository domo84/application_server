# Application Server

Application server for bleeding edge front-end

## Setup

Add `application_server` to `devDependencies`, not do dependencies.

Create the following structure:
```
src/es2017
src/images
src/html
src/scss

src/es2017/index.js (corresponds to 'main' in package.json)
src/html/index.html
src/scss/main.scss
```

inside `package.json` add:
```json
{
	"application_server": {
		"reload": {
			"room": "admin",
			"host": "0.0.0.0",
			"port": 8010
		}
	}
}
```
