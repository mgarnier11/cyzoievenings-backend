const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;


function automaticControllerBuiler(router, service) {
    function getParamNames(func) {
        return new Promise(async (resolve, reject) => {
            try {
                var fnStr = func.toString().replace(STRIP_COMMENTS, '');
                var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
                if (result === null)
                    result = [];
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });

    }

    let methods = Object.getOwnPropertyNames(service).filter(function (p) {
        return typeof service[p] === 'function';
    });

    methods.forEach(async method => {
        let args = await getParamNames(service[method]);

        let argsStr = "";

        args.forEach(arg => {
            argsStr = argsStr + '/:' + arg;
        })

        router.get('/' + method + argsStr, async (req, res) => {
            try {
                console.time(method + 'Timer');
                let params = [];

                args.forEach(arg => {
                    params.push(req.params[arg]);
                });

                res.send(await service[method].apply(method, params));

                console.timeEnd(method + 'Timer');
            } catch (error) {
                console.log(error);
                res.send('error');
                console.timeEnd(method + 'Timer');
            }
        });
    });
}

module.exports = automaticControllerBuiler;
