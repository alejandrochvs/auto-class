const xlsx = require('node-xlsx').default;

const workSheetsFromFile = xlsx.parse(`${__dirname}/interfaces.xlsx`);
const path = require('path');
const fs = require('fs');
const buildUrl = path.join(__dirname, 'build');
if (!fs.existsSync(buildUrl)) {
	fs.mkdirSync(buildUrl);
	fs.mkdirSync(path.join(buildUrl, 'java'));
	fs.mkdirSync(path.join(buildUrl, 'dotNet'));
}
workSheetsFromFile[0].data.forEach((_data, i) => {
	if (i === 0) return;
	let obj = {
		'interface': _data[0],
		'nameSpace': _data[1],
		'proceso': _data[2],
		'modulo': _data[3],
		'configurationScenario': _data[4],
		'wsdl': _data[5],
		'tipoInterfaz': _data[6],
		'flujo': _data[7]
	};
	if (obj.nameSpace) {
		obj.nameSpace = obj.nameSpace.split(':');
		obj.nameSpace.forEach((_splitted, i) => {
			if (i === 0) {
				obj.nameSpace[i] = _splitted.charAt(0).toLowerCase() + _splitted.slice(1);
			} else {
				obj.nameSpace[i] = _splitted.charAt(0).toUpperCase() + _splitted.slice(1);
			}
		});
		obj.nameSpace = obj.nameSpace.join(':');
	}
	const splitted = obj.nameSpace ? obj.nameSpace.split(':') : '';
	let javaPath = path.join(buildUrl, 'java');
	let dotNetPath = path.join(buildUrl, 'dotNet');
	if (splitted) {
		splitted.forEach((_splitted) => {
			javaPath = path.join(javaPath, _splitted);
			dotNetPath = path.join(dotNetPath, _splitted);
			if (!fs.existsSync(javaPath)) {
				fs.mkdirSync(javaPath);
			}
			if (!fs.existsSync(dotNetPath)) {
				fs.mkdirSync(dotNetPath);
			}
		});
		if (obj.interface && obj.interface !== '?') {
			obj.interface = obj.interface.split('_');
			obj.interface.forEach((_splitted, i) => {
				if (i === 0) {
					obj.interface[i] = _splitted.charAt(0).toLowerCase() + _splitted.slice(1);
				} else {
					obj.interface[i] = _splitted.charAt(0).toUpperCase() + _splitted.slice(1);
				}
			});
			obj.interface = obj.interface.join('');
			let text =
				`
				package com.${splitted.join('.')};
				public class ${obj.interface} {}`;
			let dotNetText = `
			namespace com.${splitted.join('.')}{
	            public class ${obj.interface} {}
            }
			`;
			fs.writeFileSync(path.join(javaPath, obj.interface + '.java'), text);
			fs.writeFileSync(path.join(dotNetPath, obj.interface + '.cs'), dotNetText);
			console.log(text);
		}
	}
});