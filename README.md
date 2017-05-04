# Application Server

Application server for bleeding edge front-end

## Setup

inside `package.json` add:
```json
{
	"application_server": {
		"web": "0.0.0.0:8000",
		"reload": {
			"host": "0.0.0.0",
			"port": 8010
		}
	}
}
```
