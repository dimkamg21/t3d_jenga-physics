export default class EventEmitter {
    constructor() {
        this.callbacks = {};
        this.callbacks.base = {};
    }

    on(names, callback) {
        if (!names || !callback) {
            console.warn('wrong names or callback');
            return false;
        }

        const resolvedNames = this.resolveNames(names);

        resolvedNames.forEach(name => {
            const { value, namespace } = this.resolveName(name);

            if (!this.callbacks[namespace]) {
                this.callbacks[namespace] = {};
            }

            if (!this.callbacks[namespace][value]) {
                this.callbacks[namespace][value] = [];
            }

            this.callbacks[namespace][value].push(callback);
        });

        return this;
    }

    off(names) {
        if (!names) {
            console.warn('wrong names');
            return false;
        }

        const resolvedNames = this.resolveNames(names);

        resolvedNames.forEach(name => {
            const { value, namespace } = this.resolveName(name);

            if (namespace !== 'base' && value === '') {
                delete this.callbacks[namespace];
            } else {
                if (namespace === 'base') {
                    Object.keys(this.callbacks).forEach(ns => {
                        if (this.callbacks[ns][value]) {
                            delete this.callbacks[ns][value];

                            if (Object.keys(this.callbacks[ns]).length === 0) {
                                delete this.callbacks[ns];
                            }
                        }
                    });
                } else if (this.callbacks[namespace][value]) {
                    delete this.callbacks[namespace][value];

                    if (Object.keys(this.callbacks[namespace]).length === 0) {
                        delete this.callbacks[namespace];
                    }
                }
            }
        });

        return this;
    }

    trigger(name, args = []) {
        if (!name) {
            console.warn('wrong name');
            return false;
        }

        let finalResult;
        const resolvedName = this.resolveName(this.resolveNames(name)[0]);

        const { value, namespace } = resolvedName;

        if (namespace === 'base') {
            Object.keys(this.callbacks).forEach(ns => {
                if (this.callbacks[ns][value]) {
                    this.callbacks[ns][value].forEach(callback => {
                        const result = callback.apply(this, args);
                        if (finalResult === undefined) {
                            finalResult = result;
                        }
                    });
                }
            });
        } else if (this.callbacks[namespace][value]) {
            this.callbacks[namespace][value].forEach(callback => {
                const result = callback.apply(this, args);
                if (finalResult === undefined) {
                    finalResult = result;
                }
            });
        } else {
            console.warn('wrong name');
            return false;
        }

        return finalResult;
    }

    resolveNames(names) {
        return names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
                    .replace(/[,/]+/g, ' ')
                    .split(' ');
    }

    resolveName(name) {
        const [value, namespace = 'base'] = name.split('.');

        return { original: name, value, namespace };
    }
}
