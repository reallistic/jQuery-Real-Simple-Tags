<div>
<h1>Usage:</h1>
    <div>
    <pre>$("input.tags").jSimpleTags();</pre> 
    </div>
    <h2>Options</h2>
    <div>
    <pre>
    autocomplete: false, //use jQuery ui autocomplete (Requires jQuery-ui)
    restrictTags: false, //only allow specified tags (Requires availableTags)
    backspaceCanRemove: true, //Allow the backspace key to remove tags
    backspaceRemoveSpeed: 2000, //speed in ms to wait for secoond backspace key press before removing tag
    tagsMaxChars: 60, //maximum allowed characters for all tags (0 is infinite)
    tagsMax: 0, //maximum allowed tags (0 is infinite)
    selectedTags: [], //array of selected tags on initiate
    onAddTag: function() {}, //callback
    onRemoveTag: function() {}, //callback
    onTagNotFound: function() {}, //callback
    valueNotFoundtext: "Value Not Found", //text to display when a tag is not found and they are restricted
    valueNotFoundSpeed: 500, //speed to fade in value not found text
    valueNotFoundEffect: "drop", //jquery ui effect for value not found text show
    autoCompleteOptions: {}, //jquery ui - autocomplete initialization settings.
    allowSpaces: true, //allow spaces in tags. If false space will submit tag
    availableTags:[] //array of tags to select from when using autocomplete=true</pre>
    </div>
    
    <h2>Methods</h2>
    <div>
    <pre>
    var tags = $("#tags").getjSimpleTags(); //get jSimpleTags Object instance
    
    tags.addTag(value); //add tag dynamically
    tags.removeTag($("#tags".find(".jst_selectTags")[0]); //dynamically remove the first tag
    tags.destroy(); //remove widget
    </pre>
    </div>
</div>