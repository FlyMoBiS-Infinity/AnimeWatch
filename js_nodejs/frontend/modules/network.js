/**
 * @TODO replace req to floor up xhr and feth in req
 * @_ if xhr catch make feth req if feth catch make xhr req in repeat
 * @_ feth no cors req
 */
const sendRequest = (url, options) => {
    return new Promise((resolve, reject) => {
        const res = new XMLHttpRequest;
        res.onload = () => { resolve(res.response) };
        res.onerror = reject;
        res.onabort = reject;
        res.timeout = options.timeout;
        res.ontimeout = reject;
        res.open(options.method, url, true);
        res.send();
    });
};

const module = {
    req: {
        //  o - options ; q - query;
        xhr: function (url, o, q) {
            if (typeof q == 'string') { url = url + '?' + q }
            else if (typeof q == 'object') {
                const querys = Object.entries(q)
                q = ''
                querys.forEach((query) => {
                    q += `${query[0]}=${query[1]}&`;
                });
                url += '?' + q;
            }
            console.log(url);
            const options = { 'method': 'GET', 'timeout': 20000, 'repeatwait': 1000, 'repeat': 2 };
            if (typeof o == 'object') {
                for (const [key, value] of Object.entries(options)) {
                    if (typeof o[key] != typeof value) { continue };
                    options[key] = o[key];
                };
            };
            /**
            * @TODO catch promise dont repeat more than 1; make the func for all repeats
            */
            return new Promise((resolve, reject) => {
                sendRequest(url, options).then(resolve, (err) => {
                    console.log(err)
                    if (options.repeat < 1) { reject(); return; };
                    options.repeat -= 1;
                    /**
                    * @TODO remake reject func
                    */
                    setTimeout(() => {
                        this.xhr(url, options, q).then(resolve, (err) => {
                            console.log(err)
                            if (options.repeat < 1) { reject(); return; };
                            options.repeat -= 1;
                            setTimeout(() => {
                                this.xhr(url, options, q).then(resolve, reject);
                            }, options.repeatwait);
                        });
                    }, options.repeatwait);
                });
            });
        },
    },
};

export default module;