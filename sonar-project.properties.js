export default {
  'sonar.projectKey': 'CanvasBlockEditor',

  'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
  'sonar.testExecutionReportPaths': 'coverage/test-report.xml',

  'sonar.sources': ['src'].join(','),
  // SonarQube supports limited wildcards (https://docs.sonarqube.org/latest/project-administration/narrowing-the-focus).
  // Exclude test files from analysis.
  'sonar.exclusions': ['**/*.test.*', '**/*.spec.*', '**/*.e2e-spec.*'].join(','),

  'sonar.coverage.exclusions': [].join(','),
};
