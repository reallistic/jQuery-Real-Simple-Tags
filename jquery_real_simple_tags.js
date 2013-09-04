// JavaScript Document
(function($) {
	function split( val ) {
	  return val.split( /,\s*/ );
	}
	function extractLast( term ) {
	  return split( term ).pop();
	}
	
	Array.prototype.charCount = function(){
		if(this.length === 0) return 0;
		return this.join(",").length-(this.length-1);
	}
	
	Array.prototype.remove = function(val){
		this.splice(this.indexOf(val),1);
	}
	
	$.jSimpleTags = function(input, options){
		var _ = this;
		_.rBSP=0;
		_.rBSPINT=null;
		_.$input = $(input); // target input jquery element
		_.input = input; // target input dom element
		_.$input.data("jSimpleTags", _); // target frame jquery element

		_.namespace = 'jSimpleTags';
		_.selectedTags = new Array();
		_.availableTags = new Array();
		_.selectedTagDivs = new Array();
		_.init = function (){
			//hide input?
			_.options = $.extend({},$.jSimpleTags.defaultOptions, options);
			_.$input.addClass("jst_input").wrap('<div class="jst_cont"/>');
			_.$cont = _.$input.parent();
			if(_.options.restrictTags){
				_.$vnf = $('<div class="jst_vnf">'+_.options.valueNotFoundText+'</div>').appendTo(_.$cont);
				_.$vnf.hide();
			}
			initializeInputWidth();
			_.$input.on( 'keydown.'+_.namespace, handleKeyPress);
			if(_.options.autocomplete){
				_.options.autoCompleteOptions = $.extend({},$.jSimpleTags.autoCompleteDefaultOptions(_.options.availableTags), options.autoCompleteOptions);
				_.$input.autocomplete(_.options.autoCompleteOptions);
			}
			var tag =null;
			while(tag = _.options.selectedTags.pop()){
				_.addTag(tag);
			}
			tag=null;
			while(tag = _.options.selectedTags.pop()){
				_.av(tag);
			}
		}
		
		function handleKeyPress( event ) {
			if( _.$vnf && _.$vnf.css("display") == "block"){
				_.$vnf.hide(_.options.valueNotFoundEffect,_.options.valueNotFoundSpeed );
			}
			if(_.options.backspaceCanRemove && event.keyCode !== $.ui.keyCode.BACKSPACE){
				if(_.rBSPINT != null)
					clearTimeout(_.rBSPINT);
				_.rBSP=0;
			}
			var inp = String.fromCharCode(event.keyCode);
			if(/[a-zA-Z0-9-_ ]/.test(inp) && _.selectedTags.charCount() + this.value.length >= _.options.tagsMaxChars){
				event.preventDefault();			
				return;
			}
			if (_.options.autocomplete && event.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {		  
				event.preventDefault();
			}
			else if (!_.options.autocomplete && event.keyCode === $.ui.keyCode.TAB) {		  
				event.preventDefault();
				if( _.options.restrictTags){
					addRestricted(this.value);
				}
				else{
					addNonRestricted(this.value);
				}
			}
			else if (_.options.autocomplete && event.keyCode === $.ui.keyCode.ENTER && $( this ).data( "ui-autocomplete" ).menu.active ) {		  
				event.preventDefault();
				//skip below
			}
			else if(event.keyCode === $.ui.keyCode.COMMA || event.keyCode === $.ui.keyCode.ENTER){
				event.preventDefault();
				if( _.options.restrictTags){
					addRestricted(this.value);
				}
				else{
					addNonRestricted(this.value);
				}
			}
			else if(!_.options.allowSpaces && event.keyCode === $.ui.keyCode.SPACE){
				event.preventDefault();
				if( _.options.restrictTags){
					addRestricted(this.value);
				}
				else{
					addNonRestricted(this.value);
				}
			}
			else if(_.options.backspaceCanRemove && event.keyCode === $.ui.keyCode.BACKSPACE){
				checkDelete();
			}
			
		}
		function  initializeInputWidth(){
			_.$input.attr("maxlength",_.options.tagsMaxChars);
			var testw = $('<input id="jst_testinput" size="'+_.options.tagsMaxChars+'" value="" type="text" />').appendTo(document.body).width();
			$("#jst_testinput").remove();
			var iw = _.$input.width();
			_.inputInitWidth = (iw>testw ? iw:testw);
			_.$input.width(_.inputInitWidth);
		}
		function fixInputWidth(){
			_.tagsWidth = 0;
			_.$cont.find(".jst_selectTags").each(function(){
				_.tagsWidth += $(this).outerWidth(true);
			});
			_.$input.width(_.inputInitWidth - _.tagsWidth);
			_.$input.attr("maxlength",_.options.tagsMaxChars-(_.selectedTags.charCount()+(5*_.selectedTags.length)));
			_.$vnf.css("left", _.tagsWidth + "px");
			
		}
		_.addTag = function ( term ){
			_.selectedTags.push(term);
			_.$input.val("");
			$div = $("<div class=\"jst_selectTags\">"+term+"&nbsp;</div>");
			$('<a href="#">x</a>').on('click.'+_.namespace,function(){_.removeTag($div)}).appendTo($div);
			$div.insertBefore(_.$input);
			_.selectedTagDivs.push($div);
			fixInputWidth();
			_.options.onAddTag.call(term);
		}
		_.removeTag = function (obj){
			_.selectedTagDivs.remove($div);
			obj.remove("a");
			var tag = obj.text();
			obj.remove();
			_.selectedTags.remove(tag);
			fixInputWidth();
			_.options.onRemoveTag.call(tag);
		}
		_.destroy = function (){
			_.$input.insertBefore(_.$cont);
			_.$cont.remove();
			if(_.options.autocomplete){
				_.$input.data( "ui-autocomplete" ).destroy();
			}
			if(_.rBSPINT != null)
				clearTimeout(_.rBSPINT);
			while($div = _.selectedTagDivs.pop()){
				$div.remove();
			}
			_.selectedTags = new Array();
			_.options = {};
		}
		
		function addRestricted(term){
			var terms = split( term );
			var nv = terms.pop();
			nv = nv.trim();
			var found = new String("||").concat(_.options.availableTags.join("||"))
				.concat("||").toLowerCase().indexOf(new String("||").concat(nv.toLowerCase()).concat("||"));
			console.log("found: "+ found + " while looking for: " + nv);
			if(found !== -1){
				found = _.options.availableTags.join("||").toLowerCase().substring(0,found+nv.length).split("||").length-1;
				_.addTag(_.options.availableTags[found]);
			}
			else{
				console.log("vnf showing with effect " + _.options.valueNotFoundEffect + " and speed " +_.options.valueNotFoundSpeed);
				_.$vnf.show(_.options.valueNotFoundEffect,_.options.valueNotFoundSpeed);
				_.options.onTagNotFound.call(nv);
			}
		}
		
		function addNonRestricted(term){
			var terms = split( term );
			var nv = terms.pop();
			nv = nv.trim();
			_.addTag(nv);
		}
		
		function checkDelete(){
			if(_.rBSPINT != null)
				clearTimeout(_.rBSPINT);
			if(_.$input.val() =="" && _.rBSP <1 && _.selectedTags.length >0){
				_.rBSP++;
				_.rBSPINT=setTimeout(function(){
					_.rBSP=0;
				},_.options.backspaceRemoveSpeed);
			}
			else if(_.$input.val() =="" && _.rBSP ==1 && _.selectedTags.length >0){
				_.rBSP=0;
				_.removeTag($(".jst_selectTags").last());
			}
			else if(_.rBSP >0 && _.selectedTags.length <=0){
				_.rBSP=0;
			}
		}
		console.log("initiate " + _.namespace);
		_.init();
	};
	
	$.jSimpleTags.autoCompleteDefaultOptions = function(tags){
		return {
			minLength: 0,
			source: function( request, response ) {
				// delegate back to autocomplete, but extract the last term
				response( $.ui.autocomplete.filter(tags, request.term ) );
			},
			focus: function() {
				// prevent value inserted on focus
				return false;
			},
			select: function( event, ui ) {
				this.value = "";
				$(this).data("jSimpleTags").addTag(ui.item.value);
				return false;
			}
		}
	}
	$.jSimpleTags.defaultOptions = {
		autocomplete: false,
		restrictTags: false,
		backspaceCanRemove: true,
		backspaceRemoveSpeed: 2000,
		tagsMaxChars: 60,
		selectedTags: new Array(),
		onAddTag: function() {},
		onRemoveTag: function() {},
		onTagNotFound: function() {},
		valueNotFoundtext: "Value Not Found",
		valueNotFoundSpeed: 500,
		valueNotFoundEffect: "drop",
		autoCompleteOptions: {},
		allowSpaces: true,
		valueNotFoundText: "Value not found",
		availableTags:[]
	};
	$.fn.jSimpleTags = function(options){
		return this.each(function(){
			(new $.jSimpleTags(this, options));
		});
	};
	
	$.fn.getjSimpleTags = function(){
		return this.data("jSimpleTags");
	};
})(jQuery);