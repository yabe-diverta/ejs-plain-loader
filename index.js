const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const ejs = require('ejs');
const { getOptions } = require('loader-utils');
const path = require('path');

module.exports = function (source, map, meta) {
    const callback = this.async();

    const options = Object.assign({
        filename: this.resourcePath,
        doctype: 'html',
        compileDebug: this.debug || false
    }, getOptions(this));

    const compileEjs = async (source, cb) => {
        try {
            const template = ejs.compile(source, options);

            const addDependencies = async dependency => {
                if (!this.getDependencies().includes(dependency)) {
                    this.addDependency(dependency);
                }

                const source = await readFile(dependency, 'utf8');
                const dependencies = getDependencies(source, path.join(dependency, '..'));
                await Promise.all(dependencies.map(addDependencies));

                return Promise.resolve();
            }

            const dependencies = getDependencies(source, path.join(options.filename, '..'));
            await Promise.all(dependencies.map(addDependencies));
            cb(null, template(options.data || {}));
        } catch (error) {
            cb(error);
        }
    }

    compileEjs(source, function (err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result, map, meta);
    });
}

function getDependencies(source, sourcePath) {
    let dependecies = [];
    const dependencyPattern = /<%[_\W]?\s*include((\(['"`](.*)['"`])|(\s+([^\s-]+)\s*[\W_]?%>))/g;

    let matches = dependencyPattern.exec(source);
    while (matches) {
        let fileName = matches[5] || matches[3];
        if (!fileName.endsWith('.ejs')) {
            fileName += '.ejs';
        }

        const filePath = path.join(sourcePath, fileName);

        if (!dependecies.includes(filePath)) {
            dependecies.push(filePath);
        }

        matches = dependencyPattern.exec(source);
    }

    return dependecies;
}