# US-500-Graph Reference Application

This application is an implementation of the exercises prescribed by the [WayBlazer Neo4j Learning Exercises](https://docs.google.com/document/d/1rN9z8liOBWJKLCeNZUyEUJE5_QUVUsiJUsbZ_1MPx3Q/edit).

![alt tag](https://raw.githubusercontent.com/jclosure/us-500-graph/master/public/images/US-500_Reference_App.png)


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

Make sure you set the NEO4J_URL env var before running the tests.  If you do not, no tests will run.

Then run the tests with:

	
    npm test

You can develop with live testing with grunt-watch by running:
    
    grunt watch

## Reference Documentation

####neo4j
- http://assets.neo4j.org/download/Neo4j_CheatSheet_v3.pdf
- http://neo4j.com/graphacademy/
- http://neo4j.com/docs/stable/query-schema-index.html
- http://neo4j.com/docs/stable/query-constraints.html
- http://graphaware.com/neo4j/2014/07/31/cypher-merge-explained.html

####node-neo4j
- https://github.com/thingdom/node-neo4j/blob/master/test/crud._coffee
- https://github.com/Sage/streamlinejs/
- https://github.com/Sage/streamlinejs/blob/master/tutorial/tutorial.md
- https://github.com/Sage/streamlinejs/blob/master/lib/util/flows.md

####jade
- http://jade-lang.com/reference/code/

####emacs jade-mode
- https://github.com/magnars/.emacs.d/blob/master/site-lisp/jade-mode/jade-mode.el
- http://translate.googleusercontent.com/translate_c?depth=1&hl=en&prev=search&rurl=translate.google.com&sl=ja&u=http://www.goodpic.com/mt/archives2/2012/01/emacs_js2-mode_jade-mode.html&usg=ALkJrhi4mRfvCsF11ABdH7nJDGnAU20sVg
- https://libraries.io/emacs/company-web

####superagent
- http://smalljs.org/ajax/superagent/
- http://visionmedia.github.io/superagent/#basic-authentication

####network
- https://developers.google.com/chart/
- http://almende.github.io/chap-links-library/js/network/examples/

####alchemy
- http://graphalchemist.github.io/Alchemy/#/docs
- http://graphalchemist.github.io/Alchemy/#/examples
- https://github.com/graphalchemist/alchemy/

####vis
- http://visjs.org/

####sigmajs
- https://github.com/jclosure/linkurious.js
- http://sigmajs.org/
- https://github.com/jacomyal/sigma.js/wiki/Settings

####popoto
- http://www.popotojs.com/examples/results.html
- http://www.popotojs.com/examples/simple-graph.html

####browserfy
- https://github.com/substack/node-browserify

####online-regex tester
- https://regex101.com/#javascript

#### WindowBase64.btoa()
- https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa

####node-inspector
- https://github.com/node-inspector/node-inspector#configuration

	
## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Credits

Joel Holder (for developing the app)

Ricky Stillwell (for the problems)

RMS (for emacs)
	in which this app was lovingly made.

## License

US-500-Graph is licensed under

  * The MIT License
    http://opensource.org/licenses/MIT
