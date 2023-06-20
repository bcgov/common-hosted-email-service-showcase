
# CHES Showcase [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) [![img](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

![Tests](https://github.com/bcgov/common-hosted-email-service-showcase/workflows/Tests/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/3d1538f768e99d86e8c6/maintainability)](https://codeclimate.com/github/bcgov/common-hosted-email-service-showcase/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3d1538f768e99d86e8c6/test_coverage)](https://codeclimate.com/github/bcgov/common-hosted-email-service-showcase/test_coverage)

A showcase application for the Common Hosted Email Service (CHES).

## Directory Structure

    .github/                   - PR and Issue templates, GH Actions configuration
    app/                       - Application Root
    ├── frontend/              - Frontend Root
    │   ├── src/               - Vue.js frontend web application
    │   └── tests/             - Vue.js frontend web application tests
    ├── src/                   - Node.js backend web application
    └── tests/                 - Node.js backend web application tests
    charts/                    - Helm charts for CI/CD pipeline
    CODE-OF-CONDUCT.md         - Code of Conduct
    COMPLIANCE.yaml            - BCGov PIA/STRA compliance status
    CONTRIBUTING.md            - Contributing Guidelines
    Dockerfile                 - for building app in deployments
    LICENSE                    - License

## Documentation

* [Application Readme](app/README.md)
* [Frontend Readme](app/frontend/README.md)

## Quick Start Dev Guide

You can quickly run this application in production mode after cloning with the following commands (assuming you have already set up local configuration as well). Refer to the [Application Readme](app/README.md) and [Frontend Readme](app/frontend/README.md) for more details.

    cd app
    npm run all:install
    npm run all:build
    npm run serve

## Getting Help or Reporting an Issue

To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/common-hosted-email-service-showcase/issues).

## How to Contribute

If you would like to contribute, please see our [contributing](CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

    Copyright 2020 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
