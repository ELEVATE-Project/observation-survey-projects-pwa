var fs = require('fs');
var path = require('path');

var envFilePath = path.resolve(__dirname, 'src/assets/env/env.js');
var angularJsonPath = path.resolve(__dirname, 'angular.json');

var envFileContent = fs.readFileSync(envFilePath, 'utf8');

var match = envFileContent.match(/hostPath\s*:\s*['"`](.*?)['"`]/);

var baseHref = match ? match[1] : '/';

var angularConfig = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
var projectName = Object.keys(angularConfig.projects)[0];

angularConfig.projects[projectName].architect.build.options.baseHref = baseHref;
angularConfig.projects[projectName].architect.build.options.deployUrl = baseHref;


fs.writeFileSync(angularJsonPath, JSON.stringify(angularConfig, null, 2));
console.log('angular.json baseHref updated successfully.');