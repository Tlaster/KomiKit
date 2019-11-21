
(async () => {
    const axios = require("axios").default
    const fs = require("fs")
    const cliProgress = require('cli-progress');
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
    const cookie = fs.readFileSync("cookie", 'utf8')
    let days = [...Array(4).keys()].map(it => `Day${it + 1}`)
    let halls = ["w12", "w34", "s12", "s34"]
    bar.start(days.length * halls.length, 0);
    let obj = {}
    for await (const day of days) {
        let dobj = {}
        for await (const hall of halls) {
            const result = await axios.get(`https://webcatalog.circle.ms/Map/GetMapping2?day=${day}&hall=${hall}`, {
                headers: {
                    cookie
                }
            })
            dobj[hall] = result.data
            bar.increment();
        }
        obj[day] = dobj
    }
    
    fs.writeFileSync("./data.json", JSON.stringify(obj));
    bar.stop();

})()