
const createInstancesManager = () => {
    let instances = {};
    return {

        getInstance: (key) => instances[key],
        setInstance: (key, value) => {
            instances[key] = value;
            return instances[key]
        }
    }
};

const appInstances = createInstancesManager();

export {appInstances}