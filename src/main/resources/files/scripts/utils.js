let createElement = function (type, props) {
    const $e = document.createElement(type);

    for (const prop in props) {
        $e.setAttribute(prop, props[prop]);
    }

    return $e;
};