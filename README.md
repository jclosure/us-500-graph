# US-500-Graph Reference Application

This application is an implementation of the exercises prescribed by the [WayBlazer Neo4j Learning Exercises](https://docs.google.com/document/d/1rN9z8liOBWJKLCeNZUyEUJE5_QUVUsiJUsbZ_1MPx3Q/edit) document.



## Build
To build the library from source, clone the project from github

	git@github.com:jclosure/us-500-graph.git

The source code uses the module style of node (require and module.exports) to
organize dependencies. To install all dependencies and build the library, run `npm install` in the root of the project.
	
	cd us-500-graph
	npm install

## Usage

	In your shell set the NEO4J_URL variable appropriately for your system.
	
	Example:
	
      Linux:
      
      	export NEO4J_URL=http://neo4j:admin@localhost:7474
      	
      Windows:
      
      	set NEO4J_URL=http://neo4j:admin@localhost:7474
    
    Run the app:
    
    	node app.js
    	
    Navigate to:
    
    	http://localhost:3000
      
      

## Test

To test the library, install the project dependencies once:

    npm install

Then run the tests with grunt:

    grunt

## Documentation
	
## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Credits

Joel Holder

## License

US-500-Graph is licensed under

  * The MIT License
    http://opensource.org/licenses/MIT
