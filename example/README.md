# Fitness tracker example

This example works for `iOS` devices.

### Setup

Run `yarn clean-ios-start`.

Then run `yarn ios`.

### Usage

Example project has one view with buttons which are used to trigger fitness tracker actions. 

## Troubleshooting

If you encounter `The remote archive doesn't match the expected checksum` or the installed 
package `@kilohealth/rn-fitness-tracker` doesn't update to the new changes:  
1. Run `yarn cache clean --all` to reset the cache of yarn.  
2. And then run `YARN_CHECKSUM_BEHAVIOR=update yarn` to update the checksums.

