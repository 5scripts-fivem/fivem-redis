# fivem-redis

FiveM/RedM resource allowing usage of Redis in Lua resources using [ioredis](https://www.npmjs.com/package/ioredis)

## 🔗 Shortcuts

[📥 Download](https://github.com/5scripts-fivem/fivem-redis/releases/latest)

[📞 Discord](https://discord.gg/5scripts)

## Dependencies
Our resource doesn't depend on any external resources, but to use our version checking download [5s_lib](https://dummy.url)

Also, to run our resource you will need to have installed newest artifacts (12913 and up) to support Node 22:
[Windows](https://runtime.fivem.net/artifacts/fivem/build_server_windows/master)

[Linux](https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master)

## 📁 Setup

#### Redis instance
Use cloud services to host your Redis instance, or install it locally using [Redis guide](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) or using [Docker](https://www.docker.com/) using our provided `docker-compose.yml` setup.

#### Configuration setup
Set your Redis server URL in `server.cfg`, like in example below:
```cfg
set redis_url "redis://127.0.0.1:6379"
```

#### Installing the resource
Download the [latest release]((https://github.com/5scripts-fivem/fivem-redis/releases/latest)) and save it in your `resources` folder as `fivem-redis` (this is important!)

#### Setting up the resource
Open your terminal in the directory of the resource, and run the following commands:
```sh
npm install
npm run build
```

#### Using the library
In the resource that you would like to use our library, add the following line to `fxmanifest.lua`
```lua
server_script '@fivem-redis/lib.lua'
```

#### Finale

After doing steps above, in your desired resource you can use our library (functions listed below)

## 💻 Functions

Our library has built-in functions for interacting with an Redis server.

We support both **synchronous** and **asynchronous** execution (see below).

#### Synchronous:

```lua
local value = redis.get.await('key')
print(value)
```

#### Asynchronous:

```lua
redis.get('key', function(value) 
    print(value)
end)
```

Here's a breakdown of all the functions (with examples) supported by **`fivem-redis`**.

For clarity, we used synchronous execution in our examples.

#### Handling wrapper status
```lua
local isRedisReady = redis.isReady()

redis.onReady(function() 
    print('Redis is ready for use! 🚀')
end)
```

#### CRUD Operations
```lua
redis.set.await('setKey', 'value')

redis.setTemporary.await('temporaryKey', 'value', 5000 --[[expiration, defaults to 5000ms]])

local value = redis.get.await('setKey')
print('our key', value)

redis.delete.await('setKey')
assert(redis.get.await('setKey') == nil)

redis.increment.await('myCount')
redis.decrement.await('myCount')

redis.pushToList.await('myList', 'value1')
local currentList = redis.getList.await('myList')
print('list after pushing', json.encode(currentList, { indent = true }))
local poppedValue = redis.popFromList('myList')
print('poppedValue', poppedValue)
```

#### Distributed locks
```lua
-- lock expire after 5000ms by default, second parameter is optional
if redis.tryToAcquireLock.await('myLock', 5000) then
    print('Acquired lock')
else
    print('Failed to acquire lock')
end

if redis.tryToAcquireLockForPlayer.await('myLock', 1, 5000) then
    print('Acquired lock for a player')
else
    print('Failed to acquire lock for a player')
end

redis.releaseLock.await('myLock')
redis.releaseLockForPlayer.await('myLock', 1)
```


## Notice
We provided a `.yarn.installed` file, as a workaround for FiveM's resource `yarn` not utilizing the newer version of Node - 22.