function getStampedLettersPostage(weight) {
    var postage = 0.55;
    postage += 0.15 * (Math.ceil(weight) - 1);

    if (postage > 1.00) {
        postage = 1.00;
    }

    return postage;
}

function getMeteredLettersPostage(weight) {
    var postage = 0.50;
    postage += 0.15 * (Math.ceil(weight) - 1);

    if (postage > 0.95) {
        postage = 0.95;
    }

    return postage;
}

function getLargeEnvelopesPostage(weight) {
    var postage = 1.00;
    postage += 0.15 * (Math.ceil(weight) - 1);

    if (postage > 2.80) {
        postage = 2.80;
    }

    return postage;
}

function getPackageRetailPostage(weight) {
    var postage;
    switch (Math.ceil(weight)) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            postage = 3.66;
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            postage = 4.39;
            break;
        case 9:
        case 10:
        case 11:
        case 12:
            postage = 5.19;
            break;
        default:
            postage = 5.71;
            break;
    }

    return postage;
}

function getPostage(weight, type) {
    var postage;
    switch (type) {
        case 'Letters (Stamped)':
            postage = getStampedLettersPostage(weight);
            break;
        case 'Letters (Metered)':
            postage = getMeteredLettersPostage(weight);
            break;
        case 'Large Envelopes (Flats)':
            postage = getLargeEnvelopesPostage(weight);
            break;
        default:
            postage = getPackageRetailPostage(weight);
            break;
    }

    return postage;
}

function calculateRate(req, res) {
    var weight = req.query.weight;
    var type = req.query.type;

    var postage = getPostage(weight, type);

    var results = {weight: weight, type: type, postage: postage.toFixed(2)};
    res.render('results', results);
}

module.exports = {calculateRate: calculateRate};