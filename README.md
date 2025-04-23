# fivem-redis

FiveM/RedM resource allowing usage of Redis in Lua resources using [ioredis](https://www.npmjs.com/package/ioredis)

## Who are We?

🚀 [5scripts](https://5scripts.com) is a development team specializing in high-quality FiveM scripts and resources. Our passion for creating innovative solutions has made us a trusted name in the FiveM community.

🛒 To explore our complete collection of premium FiveM scripts - [Visit our store](https://5scripts.com)!

## 🔗 Shortcuts

[📥 Download](https://github.com/5scripts-fivem/fivem-redis/releases/latest)

[📞 Discord](https://discord.gg/5scripts)

## Dependencies
Our resource doesn't depend on any external resources, but if you bought one of our resources you get to access the version checking provided by our **5s_lib** supplied with every bought resource.

## 📁 Setup

#### Redis instance
Use cloud services to host your Redis instance, or install it locally using [Redis guide](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) or using [Docker](https://www.docker.com/) using our provided `docker-compose.yml` setup.

#### Configuration setup
Set your Redis server URL in `server.cfg`, like in example below:
```cfg
set redis_url "redis://127.0.0.1:6379"
```

#### Installing the resource
Download the [latest release](https://github.com/5scripts-fivem/fivem-redis/releases/latest) and save it in your `resources` folder as `fivem-redis` (this is important!)

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
-- Delete all stored keys, with their values.
redis.flushAllKeys()

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

-- Try to acquire a lock for a player of source 1
if redis.tryToAcquireLockForPlayer.await('myLock', 1, 5000) then
    print('Acquired lock for a player')
else
    print('Failed to acquire lock for a player')
end

redis.releaseLock.await('myLock')
-- Release the lock for a player of source 1
redis.releaseLockForPlayer.await('myLock', 1)
```

## 💨 Benchmarking
We tested our library in both JavaScript environment, and Lua.
Lua is noticably slower, because of overhead caused by FiveM's events.

10 000 iterations
| Test                     | JavaScript | Lua    |
|--------------------------|------------|--------|
| Setting values           | 343ms      | 3.44s  |
| Retrieving values        | 228ms      | 2.88s  |
| Deleting values          | 193ms      | 2.76s  |
| Incrementing values      | 246ms      | 3.62s  |
| Decrementing values      | 229ms      | 2.34s  |
| Pushing to list          | 249ms      | 3.06s  |
| Retrieving all from list | 14.63s     | 48.46s |
| Popping from list        | 333ms      | 2.36s  |

1 000 000 iterations
| Test                     | JavaScript | Lua     |
|--------------------------|------------|---------|
| Setting values           | 30.70s     | 301.82s |
| Retrieving values        | 29.09s     | 287.60s |
| Deleting values          | 30.62s     | DNF     |
| Incrementing values      | 30.02s     | DNF     |
| Decrementing values      | 30.70s     | DNF     |
| Pushing to list          | 29.61s     | DNF     |
| Retrieving all from list | SKIPPED    | SKIPPED |
| Popping from list        | 26.72s     | DNF     |

Why did Lua not finish the 1 000 000 iterations test?

As said before, FiveM has a major overhead using exports (basically events), and running a lot of operations at once doesn't help it.

Even though Lua didn't finish our tests, it's perfectly fine, fast and reliable in normal use.

## Notice
We provided a `.yarn.installed` file, as a workaround for FiveM's resource `yarn` sometimes being fuzzy with newer npm packages.
