const defltOptions = {
    'timeout': 1000,
    'method': 'GET',
    'url': '/api',
};

const normaleObject = (obj, deflt) => {
    if (typeof obj !== 'object' || obj === null) { obj = {}; };
    Object.entries(deflt).forEach((v) => {
        if (typeof obj[v[0]] !== typeof v[1]) { obj[v[0]] = v[1]; };
    });
    return obj;
};

class request {
    constructor(options, body) {
        this['options'] = normaleObject(options, defltOptions);
        if (typeof body !== 'undefined' && typeof body !== 'function') { this['body'] = body; };
    };
    options(v) { this['options'] = normaleObject(v, defltOptions); };
    body(v) { this['body'] = v; };

    sendFetch(body) {
        // if (typeof window.fetch !== 'function' || typeof window.AbortSignal !== 'function') {
        //     return new Promise((a, reject) => { reject() })
        // };
        if (typeof body !== 'undefined' && typeof body !== 'function') { this['body'] = body; };
        return fetch(this['options']['url'], {
            body: body, method: this['options']['method'],
            signal: AbortSignal.timeout(this['options']['timeout']),
        });
    };
    sendXHR(body) {
        if (typeof body !== 'undefined' && typeof body !== 'function') { this['body'] = body; };
        return new Promise((resolve, reject) => {
            const res = new XMLHttpRequest;
            res.timeout = this['options']['timeout'];
            res.onload = resolve;
            res.onerror = reject;
            res.open(this['options']['method'], this['options']['url'], true);
            res.send(body);
        });
    };
    /**
     * @todo make the safe send
     */
    sendSafe(body, repeatN, repeatWait, rejectMode) {
        if (typeof repeatN === 'string') { repeatN = Number(repeatN); }
        else if (typeof repeatN !== 'number') { repeatN = 2; };
        repeatN = Number.parseInt(repeatN);

        if (typeof repeatWait === 'string') { repeatWait = Number(repeatWait); }
        else if (typeof repeatWait !== 'number') { repeatWait = 1000; };
        let mode = '';
        return new Promise((resolve, reject) => {
            mode = 'xhr';
            this.sendXHR(body).then((res) => {
                resolve({ 'response': res, 'mode': mode });
            }, (errXHR) => {
                repeatN -= 1;
                console.log('XHR err - ' + repeatN);
                if (repeatN < 1 && String(rejectMode).toLowerCase() === 'xhr') {
                    reject({ 'error': errXHR, 'mode': mode }); return;
                };
                mode = 'fetch';
                this.sendFetch(body).then((res) => {
                    resolve({ 'response': res, 'mode': mode });
                }, (errFetch) => {
                    console.log('Fetch err - ' + repeatN);
                    if (repeatN < 1) { reject({ 'error': errFetch, 'mode': mode }); return; } else {
                        setTimeout(() => {
                            this.sendSafe(body, repeatN, repeatWait, rejectMode).then(resolve, reject);
                        }, repeatWait);
                    };
                });
            });
        });
    };
};

export default request;