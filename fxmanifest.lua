fx_version 'cerulean'
games {'gta5', 'rdr3'}

author '5scripts.com'
description 'High performance Redis wrapper for FiveM & RedM.'
version '1.0.2'

lua54 'yes'
node_version '22'

server_scripts {
    --- Optional for version checking, recommended to leave.
    '@5s_lib/init.lua',
    'versionCheck.lua',

    --- Don't remove this, it's required!
    'dist/**.js',

    --- Benchmark files
    --- Add following line: `set redis_benchmarkJs 1` or `set redis_benchmarkLua 1` to your server.cfg in order to run benchmarks.
    --- You can set the amount of iterations using `set redis_benchmarkIterations 10000`.
    'lib.lua',
    'benchmark.lua',
}

dependencies {
    -- Node 22
    '/server:12913',
}
