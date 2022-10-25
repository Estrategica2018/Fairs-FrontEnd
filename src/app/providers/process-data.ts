export function processData(obj) {

    if (typeof obj == 'object' && obj.length > 0) {
        for (let item of obj) {
            item = processData(item);
        }
    }
    else if (typeof obj == 'object') {

        if (obj.resources && typeof obj.resources == 'string') {
            try {
                obj.resources = JSON.parse(obj.resources);
            } catch (e) {
                console.log(e);
                console.log(obj.resources);
                console.log(obj);
            }
        }
        if (obj.social_media && typeof obj.social_media == 'string') {
            try {
                obj.social_media = JSON.parse(obj.social_media);
            } catch (e) {
                console.log(e);
                console.log(obj.social_media);
                console.log(obj);
            }
        }
        let objItem = null;
        for (let key of Object.keys(obj)) {
            if (key.indexOf('__') < 0 && obj[key]) {
                processData(obj[key]);
            }
        }

    }
    return obj;
}

export function processDataToString(obj) {

    if (typeof obj == 'object' && obj.length > 0) {
        for (let item of obj) {
            item = processDataToString(item);
        }
    }
    else if (typeof obj == 'object') {

        if (obj.resources && obj.resources.scenes) {
            for (let scenes of obj.resources.scenes) {
                for (let banner of scenes.banners) {
                    if (banner.__agendaCatalog) {
                        banner.__agendaCatalog = {};
                    }
                }
            }
        }

        if (obj.resources && typeof obj.resources == 'object') {
            obj.resources = JSON.stringify(obj.resources);
        }
        if (obj.social_media && typeof obj.social_media == 'object') {
            obj.social_media = JSON.stringify(obj.social_media);
        }

        let objItem = null;
        for (let key of Object.keys(obj)) {
            if (obj[key]) {
                processDataToString(obj[key]);
            }
        }

    }
    return obj;
}

export function clone(obj) {

    if (typeof obj == 'object' && obj.length > 0) {
        let list = [];
        for (let item of obj) {
            list.push(clone(item));
        }
        return list;
    }
    else if (typeof obj == 'object') {
        let objNew = Object.assign({}, obj);
        for (let key of Object.keys(obj)) {
            if (obj[key]) {
                objNew[key] = clone(obj[key]);
            }
        }

        return objNew;
    }
    else {
        return obj;
    }
}