const fs = require('fs');
const path = require('path');

// Fix 1: student-service.ts - rename 'module' to 'mod'
const ssPath = path.join(__dirname, '..', 'src', 'lib', 'services', 'student-service.ts');
let ss = fs.readFileSync(ssPath, 'utf8');
ss = ss.replace(/const module = /g, 'const mod = ');
ss = ss.replace(/if \(!module\)/g, 'if (!mod)');
ss = ss.replace(/return module;/g, 'return mod;');
ss = ss.replace(/module\.id/g, 'mod.id');
ss = ss.replace(/module\.requiredSectionCount/g, 'mod.requiredSectionCount');
ss = ss.replace(/module\.minimumReadSeconds/g, 'mod.minimumReadSeconds');
ss = ss.replace(/module\.sections/g, 'mod.sections');
ss = ss.replace(/module\.content/g, 'mod.content');
ss = ss.replace(/module\.title/g, 'mod.title');
ss = ss.replace(/module\.topic/g, 'mod.topic');
ss = ss.replace(/module\.description/g, 'mod.description');
ss = ss.replace(/module\.learningObjectives/g, 'mod.learningObjectives');
ss = ss.replace(/module\.estimatedMinutes/g, 'mod.estimatedMinutes');
ss = ss.replace(/module\.isPrerequisite/g, 'mod.isPrerequisite');
ss = ss.replace(/module\.readProgress/g, 'mod.readProgress');
ss = ss.replace(/module\.readSectionCount/g, 'mod.readSectionCount');
ss = ss.replace(/module\.reflectionText/g, 'mod.reflectionText');
ss = ss.replace(/module\.progress/g, 'mod.progress');
fs.writeFileSync(ssPath, ss);
console.log('Fixed student-service.ts: module -> mod');

// Fix 2: auth-service.ts - replace any with unknown
const asPath = path.join(__dirname, '..', 'src', 'lib', 'services', 'auth-service.ts');
if (fs.existsSync(asPath)) {
  let as = fs.readFileSync(asPath, 'utf8');
  as = as.replace(/: any/g, ': unknown');
  fs.writeFileSync(asPath, as);
  console.log('Fixed auth-service.ts: any -> unknown');
}

console.log('Done!');
