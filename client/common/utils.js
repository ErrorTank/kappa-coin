export const wait = delay => new Promise((resolve) => {
    setTimeout(() =>  resolve() ,delay)
}) ;

export const delayLoad = fn => () => new Promise(resolve => {
    setTimeout(() => resolve(fn()), 300)
});
