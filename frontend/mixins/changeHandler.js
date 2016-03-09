/**
 * Created by gasya on 09.03.16.
 * DigitalOutlooks corporation.
 */

export default function changeHandler(self) {
    let properties = [];
    const cache = {};

    function listener(properties) {

        return function (parameter) {

            let newProperties = properties;

            if (typeof parameter == 'string') {
                newProperties = bindState(parameter, properties);
            }

            if (typeof parameter == 'object') {
                changeValue(parameter, properties);
                return true;
            }

            if (typeof cache[newProperties] == 'function') {
                return cache[newProperties];
            } else {
                const newListener = listener(newProperties);
                cache[newProperties] = newListener;
                return newListener;
            }
        }
    }

    function changeValue(e, properties) {

        const newValue = (e.target.type=="checkbox") ? e.target.checked : (e.target.value || null);
        const newState = Object.assign({}, self.state);
        let root = newState;
        const pLength = properties.length - 1;
        for (let i = 0; i < pLength; i++) {
            root = root[properties[i]];
        }

        root[properties[pLength]] = newValue;

        self.setState(newState);
    }

    function bindState(property, properties) {
        const newProperties = [...properties];
        newProperties.push(property);
        return newProperties;
    }

    return listener(properties);
};

