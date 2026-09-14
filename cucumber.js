module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step_definitions/**/*.ts', 'tests/support/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress-bar', 'html:cucumber-report.html'],
    publishQuiet: true
  }
};