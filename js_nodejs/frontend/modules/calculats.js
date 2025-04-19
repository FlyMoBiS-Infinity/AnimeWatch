export const calculateHalfedRange = (crntN, NfN, minN, maxN) => {
    let strt = Math.min(Math.max(minN, crntN - Math.floor(NfN / 2)), maxN - NfN);
    let end = Math.min(Math.max(strt + NfN, strt), maxN)
    return [strt, end];
};

export const getQuerysFromString = (text) => {
    const query = {};
    text.split('?').forEach((v) => {
        const ands = v.split('&');
        if (ands.length < 2) {
            const variable = v.split('=');
            if (variable.length !== 2 || variable[0].length < 1 || variable[1].length < 1) { return; };
            query[variable[0]] = variable[1];
        };
        ands.forEach((v2) => {
            const variable = v2.split('=');
            if (variable.length !== 2 || variable[0].length < 1 || variable[1].length < 1) { return; };
            query[variable[0]] = variable[1];
        });
    });
    return query;
};