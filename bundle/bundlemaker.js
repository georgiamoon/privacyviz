var pvc = {name: 'privacy technology concern'};
var rtsc = {name: 'rights concern'};
var iss = {name: 'issues'};


var groups = { 
    PRIVTECH_CONCERN1: pvc,
    PRIVTECH_CONCERN2: pvc,
    PRIVTECH_CONCERN3: pvc,
    PRIVTECH_CONCERN4: pvc,
    PRIVTECH_CONCERN5: pvc,
    PRIVTECH_CONCERN6: pvc,
    PRIVTECH_CONCERN7: pvc,
    RTS_CONCERN1: rtsc,
    RTS_CONCERN2: rtsc,
    RTS_CONCERN3: rtsc,
    RTS_CONCERN4: rtsc,
    ISSUE1: iss,
    ISSUE2: iss,
    ISSUE3: iss,
    ISSUE4: iss,
    ISSUE5: iss,
    ISSUE6: iss,
    ISSUE7: iss
};
 

// csv data structure -> issue node format
var makeIssueNode = function(issue, group) {
    return {name: issue, type: group };
};

var getIssues = function(person) {
    var keys = Object.keys(groups);
    var issues = [];
    keys.forEach(function (key) { 
        if (person[key]) { 
            issues.push( makeIssueNode(person[key], groups[key]) ); 
        } 
    });
    return issues;
};

// csv datastructure -> name string
var pname = function(data) {
    return data.ACTOR; 
};

var ptype = function(data) {
    return data.ACTOR_TYPE;
};

var makeChild = function(parent, child) {
    parent.children = parent.children || [];
    parent.children.push(child);
    child.parent = parent;
}

var personId = 1;

// csv data structure -> person node format
var makePersonNode = function(data, parentNode) {
    
    var node = {name: pname(data), type: ptype(data), key: ++personId};
    node.issues = getIssues(data);
    makeChild(parentNode, node);
    return node;
};


// returns the array of issues for that person

// people: the csv data, presumably an array of arrays
function parse(people) { 
    
    var proot = {name:"all people"};

    // issue root
    var root = {name:"all issues", key: 0, children:[pvc, rtsc, iss]};

    // node objects that form sources and targets, made up of people and issues
    var nodes = {};
    
    // list of links for bundle layout, output
    var links = [];
        
    
    for (var i = 0; i < people.length; i++) {
        var personNode = makePersonNode(people[i], proot);
        //nodes[personNode.name] = personNode;
        
        var issues = personNode.issues;    
        for (var k = 0; k < issues.length - 1; k++) {
            for (var j = k + 1; j < issues.length; j++) {
                var source = issues[k];
                var target = issues[j];
               
                if (source.name != target.name) {
                    if (!nodes[source.name]) {
                        nodes[source.name] = source;
                        makeChild(source.type, source);
                    }
                    if (!nodes[target.name]) {
                        nodes[target.name] = target;
                        makeChild(target.type, target);
                    }
                    links.push({'source':  nodes[source.name], 'target':  nodes[target.name], 'ptype':personNode.type });                        
                }
            }
         } 
                
    }
      
    return {'links': links, 'root': root};    
}

