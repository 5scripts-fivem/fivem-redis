function await(fn, ...)
    local p = promise.new()

    fn(nil, function(result, error) 
        if error then
            p:reject(error)
        end

        p:resolve(result)
    end, ...)

    return Citizen.Await(p)
end

local export = exports['fivem-redis']

redis = setmetatable({}, {
    __newindex = function() 
        warn('Setting values on the redis table is not allowed.')
        return
    end,
    __index = function(self, k) 
        return setmetatable({}, {
            __call = function(_, ...) 
                local args = { ... }
                local lastArg = args[#args]
                if type(lastArg) == "function" and #args > 1 then
                    table.remove(args)
                    Citizen.CreateThreadNow(function() 
                        export[k](nil, lastArg, table.unpack(args))
                    end)
                else
                    -- Fallback for functions like onReady.
                    -- There probably is an easier way to do this, but I'm not sure how.
                    return await(export[k], ...)
                end
             end,
            __index = {
                await = function(...) 
                    return await(export[k], ...)
                end
            }
        })
    end
})

