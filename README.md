# CBAC
Context based access control API

## Setup Develop Environment
1. Clone this repository.
2. Make sure you have Node.js 17+ installed.
3. Run command to install dependencies:
   ```shell
      yarn
    ```
4. Make sure you have Redis 6+ installed.
5. Run command to start the server:
   ```shell
    yarn start
   ```

## API
### 1. Validate
```
POST /access-control/validate

Content-Type: application/json

[
    {
        "access": "a:b:c",
        "context":{
            "clientSide": {
                "roles": ["M", "C"]
            },
            "serverSide":{}
        }
    },
    {
        "access": "b"
    }
]
```

```
HTTP/1.1 200 OK
Content-Length: 11
Content-Type: application/json; charset=utf-8
Date: Wed, 23 Feb 2022 07:08:31 GMT
Keep-Alive: timeout=58
Vary: Origin, Accept-Encoding
X-Response-Time: 2ms

[
  false,
  true
]
```

### 2. Set global validators
```
POST /access-control/global

Content-Type: application/json

[
    {
        "alias": "rbac",
        "claim": {
            "content": "../validators/rbac.js"
        }
    },
    {
        "alias": "allow",
        "claim": {
            "userDefined": true,
            "content": "return true"
        }
    },
    {
        "alias": "deny",
        "claim": {
            "userDefined": true,
            "content": "return true"
        }
    }
]
```

```
HTTP/1.1 200 OK
Content-Length: 11
Content-Type: application/json; charset=utf-8
Date: Wed, 23 Feb 2022 07:16:27 GMT
Keep-Alive: timeout=58
Vary: Origin, Accept-Encoding
X-Response-Time: 13ms

{
  "ok": true
}
```

### 3. Get global validators
```
GET http://localhost:4242/access-control/global
```

```
HTTP/1.1 200 OK
Content-Length: 203
Content-Type: application/json; charset=utf-8
Date: Wed, 23 Feb 2022 07:19:54 GMT
Keep-Alive: timeout=58
Vary: Origin, Accept-Encoding
X-Response-Time: 1ms

[
  {
    "alias": "rbac",
    "claim": {
      "content": "../validators/rbac.js"
    }
  },
  {
    "alias": "allow",
    "claim": {
      "userDefined": true,
      "content": "return true"
    }
  },
  {
    "alias": "deny",
    "claim": {
      "userDefined": true,
      "content": "return true"
    }
  }
]
```

### 4. Save Access Validators
```
POST http://localhost:4242/access-control/access/a:b:c
Content-Type: application/json

[
    {
        "alias": "rbac"
    },
    {
        "claim": {
            "userDefined": true,
            "content": "return true"
        }
    },
    {
        "alias": "deny",
        "claim": {
            "userDefined": true,
            "content": "return false"
        }
    }
]
```

```
HTTP/1.1 200 OK
Content-Length: 61
Content-Type: application/json; charset=utf-8
Date: Wed, 23 Feb 2022 07:25:50 GMT
Keep-Alive: timeout=58
Vary: Origin, Accept-Encoding
X-Response-Time: 1ms

{
  "ok": true,
  "data": [
    "rbac",
    "6215e17e3865af7eebae0d6c",
    "deny"
  ]
}
```

### 5. Save Access Validator Props
```
POST http://localhost:4242/access-control/access/a:b:c/rbac/props
Content-Type: application/json

{
    "roles": ["A", "B"]
}
```

```
HTTP/1.1 200 OK
Content-Length: 11
Content-Type: application/json; charset=utf-8
Date: Wed, 23 Feb 2022 07:55:49 GMT
Keep-Alive: timeout=58
Vary: Origin, Accept-Encoding
X-Response-Time: 1ms

{
  "ok": true
}
```

### 6. Get Access Validators
```
GET http://localhost:4242/access-control/access/a:b:c
```

```
HTTP/1.1 200 OK
Content-Length: 42
Content-Type: application/json; charset=utf-8
Date: Wed, 23 Feb 2022 07:58:23 GMT
Keep-Alive: timeout=58
Vary: Origin, Accept-Encoding
X-Response-Time: 1ms

[
  "rbac",
  "6215e17e3865af7eebae0d6c",
  "deny"
]
```

### 7. Get Access Validator Props
```
GET http://localhost:4242/access-control/access/a:b:c/rbac/props
```

```
HTTP/1.1 200 OK
Content-Length: 19
Content-Type: application/json; charset=utf-8
Date: Wed, 23 Feb 2022 08:01:47 GMT
Keep-Alive: timeout=58
Vary: Origin, Accept-Encoding
X-Response-Time: 1ms

{
  "roles": [
    "A",
    "B"
  ]
}
```

### 8. Check is an alias exists
```
GET http://localhost:4242/access-control/alias/exists?alias=rbac
```

```
HTTP/1.1 200 OK
Content-Length: 11
Content-Type: application/json; charset=utf-8
Date: Wed, 23 Feb 2022 08:04:23 GMT
Keep-Alive: timeout=58
Vary: Origin, Accept-Encoding
X-Response-Time: 0ms

{
  "ok": true
}
```

### 9. Get all accesses' info
```http request
GET http://localhost:4242/access-control/access
```
