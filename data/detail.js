(async() => {
    const pLimit = require('p-limit');
    const cliProgress = require('cli-progress');
    const limit = pLimit(10);
    const axios = require("axios").default
    const axiosRetry = require('axios-retry');
    const fs = require("fs")
    const jsonPath = require("jsonpath")
    const cookie = fs.readFileSync("cookie", 'utf8')
    
    axiosRetry(axios, { retries: 1000, retryDelay: () => 0 });
    const data = JSON.parse(fs.readFileSync("./data.json"))
    const wids = jsonPath.query(data, "$..wid")

    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);


    bar.start(wids.length, 0);

    const tasks = wids.map(id => {
        limit(async () => {
            try {
                const result = await axios.get(`https://webcatalog-free.circle.ms/Circle/${id}/DetailJson`, {
                    headers: {
                        cookie
                    }
                })
                
                bar.increment();
                return result.data
            } catch (error) {
                console.log(`https://webcatalog-free.circle.ms/Circle/${id}/DetailJson`)
                return {}
            }
        })
    })
    
    // const list = []
    // for await (const task of tasks) {
    //     list.push(await task)
    //     await delay(1000)        
    // }

    const list = await Promise.all(tasks)
    
    fs.writeFileSync("./detail.json", JSON.stringify(list));


})();
