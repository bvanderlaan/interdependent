# Interdependent

Interdependent is a command line tool for scanning a Node.js project and produce a count of how many internal dependencies each module in the project has.

## Why Internal Dependencies?

Its good to check how many things your project depends on externally; that is how many third party packages does your project depend on and in turn how many packages do they depend on and so forth; however, what about how many of your own modules internal to your project does each of your modules depend on?

If your working on a legacy web service or application written in Node you might be looking at a lot of internal modules; ones for services, controllers, middle-ware, helpers, etc. Being legacy I mean that you have little to no tests and are looking at the daunting task of adding tests.

If you are to add proper unit tests you'll need to mock these dependencies out. But how conformable are you mocking a module not yet under test?

For me I like to find the bottom of my dependance tree, those internal modules which do not depend on any other internal module. These lower level modules are easier to test as they either require no mocking or I only have to mock third party or built in modules which I'll trust are already under test or at least stable and/or documented enough to make me feel conformable mocking their behaviour. Once I have my low level modules under test I'll feel better mocking them when testing the next level up until my entire project is under test.

**Note**: I'm a fan of Unit testing but to get good test coverage with reasonable comfort that regression defects will be caught early integration tests are a must. Automated tests come in layers: Start with many unit tests, followed by a number of integration tests, ending with some system tests.

Interdependent is a command line tool that lets me scan my entire project and identify all modules who have little to no internal dependencies so I can find where to start adding tests.

## Tests

The Interdependent tool comes with a suite of unit tests. To run them simply run `npm test`. You will get a test report (XML) and a LCov code coverage HTML report ontop of the terminal output.


## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/bvanderlaan/interdependent). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](https://contributor-covenant.org/) code of conduct.

## License

The tool is available as open source under the terms of the [ISC License](https://choosealicense.com/licenses/isc/).