fx_version 'cerulean'
games {'gta5', 'rdr3'}

author '5scripts.com'
description 'High performance Redis wrapper for FiveM & RedM.'
version '1.0.0'

lua54 'yes'
node_version '22'

server_scripts {
    --- Optional for version checking, recommended to leave.
    '@5s_lib/init.lua',
    'versionCheck.lua',

    --- Don't remove this, it's required!
    'dist/**.js',

    --- Benchmark files
    -- 'lib.lua',
    -- 'benchmark.lua',
}

dependencies {
    -- Node 22
    '/server:12913',
}