if GetConvar('redis_benchmarkLua', '0') ~= '1' then
    return
end

warn('Benchmarking is enabled, you can turn it off in fivem-redis/benchmark.lua')
local iterations = GetConvarInt('redis_benchmarkIterations', 10000)
beginClock, endClock = 0, 0

function printResults(title)
    local endClock = os.clock()
    local elapsed = endClock - beginClock

    local metric = "s"
    if elapsed < 1 then
        elapsed = elapsed * 1000
        metric = "ms"
    end
    if elapsed < 1 then
        elapsed = elapsed * 1000
        metric = "μs"
    end
    if elapsed < 1 then
        elapsed = elapsed * 1000
        metric = "ns"
    end

    print('--- '..title..' finish ---')
    print('^4' .. title .. "^0 benchmark finished in ^5" .. string.format("%.2f", elapsed) .. " " .. metric .. "^0.")
    print("======")
end

local benchmarks = {
    [1] = {
        label = 'Setting values',
        fun = function(i)
            redis.set.await('benchmark:' .. i, i)
        end
    },
    [2] = {
        label = 'Retrieving values',
        fun = function(i)
            redis.get.await('benchmark:' .. i)
        end
    },
    [3] = {
        label = 'Deleting values',
        fun = function(i)
            redis.delete.await('benchmark:' .. i)
        end
    },
    [4] = {
        label = 'Incrementing values',
        fun = function(i)
            redis.increment.await('benchmarkn:' .. i)
        end
    },
    [5] = {
        label = 'Decrementing values',
        fun = function(i)
            redis.decrement.await('benchmarkn:' .. i)
        end
    },
    [6] = {
        label = 'Pushing to list',
        fun = function(i)
            redis.pushToList.await('benchmarkl', i)
        end
    },
    [7] = {
        label = 'Retrieving all from list',
        fun = function(i)
            redis.getList.await('benchmarkl')
        end
    },
    [8] = {
        label = 'Popping from list',
        fun = function(i)
            redis.popFromList('benchmarkl')
        end
    }
}

redis.onReady(function()
    -- Let's wait for everything to be ready.
    Wait(1000)

    warn('Benchmarking is enabled, you can turn it off in fivem-redis/benchmark.lua')
    -- Flushing all keys before
    redis.flushAllKeys()

    print('======')
    print('Starting the benchmark with ' .. iterations .. ' iterations.')
    print('======')
    for index=1, #benchmarks do
        local data = benchmarks[index]
        if data.label:find('all from list') and iterations > 100000 then
            warn('Skipping the '..data.label..' benchmark. Too long to finish.')
            goto skip
        end
        local fun = data.fun
        local label = data.label
        print('======')
        print('Starting the ^4' .. label .. '^0 benchmark.')

        beginClock = os.clock()
        for i = 1, iterations do
            fun(i)
        end
        printResults(label)

        ::skip::
    end

    print(' ')
    print(' ')
    print(' ')
    print('======')
    print('Benchmarking finished.')
    print('======')
end)
