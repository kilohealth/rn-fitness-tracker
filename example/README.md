# Fitness tracker example

This example works for `iOS` devices. This example mainly used for
e2e tests in the CI/CD.

## Setup

1. Run `yarn cache clean --all`
2. Run `yarn clean-ios-start`.
3. Then run `yarn ios`.

## Usage

Example project has one view with buttons which are used to trigger fitness tracker actions.

### Build

To run the test you must first build, with command:  
`npx detox build --configuration ios`

### Running tests

`npx detox test --configuration ios --loglevel warn`

## Troubleshooting

If your package doesn't update you must run `yarn cache clean --all` to reset the cache.

If you encounter `The remote archive doesn't match the expected checksum` or the installed
package `@kilohealth/rn-fitness-tracker` doesn't update to the new changes:

1. Run `yarn cache clean --all` to reset the cache of yarn.
2. And then run `YARN_CHECKSUM_BEHAVIOR=update yarn` to update the checksums.
