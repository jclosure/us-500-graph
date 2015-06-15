
function asGraphJSON (cypherResult) {

  //- reference: http://graphalchemist.github.io/Alchemy/#/docs
  var jsonObj = cypherResult.data.reduce(function(accum, result) {

    // graphJSON node exemplar
    //- {
    //-   "caption": "Children of the Corn III: Urban Harvest",
    //-   "type": "movie",
    //-   "id": 626470
    //- }

    var defaultTypeLabel = 'name';

    result.graph.nodes.forEach(function(node) {
      //debugger;
      accum.nodes.push({
        id: node.id - 0,
        type: node.labels[0],
        caption: (node.properties[defaultTypeLabel] ||  
                  node.properties[Object.keys(node.properties)[0]] || 
                  node.id) + ''
      });
    });

    // graphJSON edge exemplar
    //- {
    //-   "source": 314003,
    //-   "target": 595702,
    //-   "caption": "NOMINATED"
    //- }

    result.graph.relationships.forEach(function(rel) {
      accum.edges.push({
        source: rel.startNode - 0,
        target: rel.endNode - 0,
        caption: rel.type
      });
    });

    return accum;

  }, {
    nodes: [],
    edges: [] 
  });

  return jsonObj;
}


function harvestCredentials(url){
  result = {
    url: url
  };
  var input = url;
  var regex = /\/\/.+:.+@/;
  var matches = regex.exec(input);
  if (matches && matches[0]) {
    result.user = matches[0].split(':')[0].substring(2);
    result.pass = matches[0].split(':')[1].slice(0,-1);
    result.url = url.replace(matches[0],"//");
  }
  return result;
}
