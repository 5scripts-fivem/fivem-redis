import { redisInstance } from "../server";


export function prepareBenchmarks() {
    if (GetConvar('redis_benchmarkJs', '0') != '1') return;

    redisInstance.onReady(() => {
        runBenchmarks(GetConvarInt('redis_benchmarkIterations', 10000));
    })
}

const benchmarks = [
    {
        label: 'Setting values',
        fun: async (iteration: number) => {
            await redisInstance.set(`benchmark:${iteration}`, iteration);
        }
    },
    {
        label: 'Retrieving values',
        fun: async (iteration: number) => {
            await redisInstance.get(`benchmark:${iteration}`);
        }
    },
    {
        label: 'Deleting values',
        fun: async (iteration: number) => {
            await redisInstance.delete(`benchmark:${iteration}`);
        }
    },
    {
        label: 'Incrementing values',
        fun: async (iteration: number) => {
            await redisInstance.increment(`benchmarkn:${iteration}`);
        }
    },
    {
        label: 'Decrementing values',
        fun: async (iteration: number) => {
            await redisInstance.decrement(`benchmarkn:${iteration}`);
        }
    },
    {
        label: 'Pushing to list',
        fun: async (iteration: number) => {
            await redisInstance.pushToList('benchmarkl', iteration);
        }
    },
    {
        label: 'Retrieving all from list',
        fun: async (iteration: number) => {
            await redisInstance.getList('benchmarkl');
        }
    },
    {
        label: 'Popping from list',
        fun: async (iteration: number) => {
            await redisInstance.popFromList('benchmarkl');
        }
    }
]

async function runBenchmarks(iterations: number) {
    await redisInstance.flushAllKeys();

    for(let benchmarkIndex = 0; benchmarkIndex < benchmarks.length; benchmarkIndex++) {
        const benchmarkData = benchmarks[benchmarkIndex];
        if(benchmarkData.label.includes('all from list') && iterations > 100000) {
            console.warn('Skipping ' + benchmarkData.label + ' benchmark. Too long to finish.')
            continue;
        }
        console.log('Starting benchmark ' + benchmarkData.label);
        console.time(benchmarkData.label);
        for(let iteration = 0; iteration < iterations; iteration++) {
            await benchmarkData.fun(iteration);
        }
        console.timeEnd(benchmarkData.label);
    }
}