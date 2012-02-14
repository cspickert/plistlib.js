var PlistLib = (function ()
{
	var lib = {};
	
	lib.writePlist = function (rootObject) {
		var writer = new PlistWriter();
		writer.writeln("<plist version=\"1.0\">");
		writer.writeValue(rootObject);
		writer.writeln("</plist>");
		return writer.file.output;
	};
	
	function AssertException(message)
	{
		this.message = message;
		
		this.toString = function () {
			return 'AssertException: ' + this.message;
		};
	}
	
	function assert(exp, message)
	{
		if (!exp) {
			throw new AssertException(message);
		}
	}
	
	function subclass(constructor, superConstructor)
	{
		// Source: http://www.golimojo.com/etc/js-subclass.html
	
		function surrogateConstructor()
		{
		}
	
		surrogateConstructor.prototype = superConstructor.prototype;
	
		var prototypeObject = new surrogateConstructor();
		prototypeObject.constructor = constructor;
	
		constructor.prototype = prototypeObject;
	}
	
	function ISODateString(d)
	{
		// Source: http://webcloud.se/log/JavaScript-and-ISO-8601/
		
		function pad(n){
			return n < 10 ? '0' + n : n;
		}
		return d.getUTCFullYear()+'-'
		+ pad(d.getUTCMonth()+1)+'-'
		+ pad(d.getUTCDate())+'T'
		+ pad(d.getUTCHours())+':'
		+ pad(d.getUTCMinutes())+':'
		+ pad(d.getUTCSeconds())+'Z'
	}
	
	function DummyFile ()
	{
		this.output = "";
	
		this.write = function (s) {
			this.output += s;
		};
		
		this.read = function () {
			return this.output;
		};
	}
	
	function DumbXMLWriter (file, indentLevel, indent)
	{
		this.file = file || new DummyFile();
		this.indentLevel = indentLevel || 0;
		this.indent = indent || "\t";
		this.stack = new Array();
		
		this.beginElement = function (element) {
			this.stack[this.stack.length] = element;
			this.writeln("<" + element + ">");
			this.indentLevel += 1;
		};
		
		this.endElement = function (element) {
			assert(this.indentLevel > 0);
			assert(this.stack.pop() === element);
			this.indentLevel -= 1;
			this.writeln("</" + element + ">");
		};
		
		this.simpleElement = function (element, value) {
			if (value) {
				value = _escapeAndEncode(value);
				this.writeln("<" + element + ">" + value + "</" + element + ">");
			} else {
				this.writeln("<" + element + "/>");
			}
		};
		
		this.writeln = function (line) {
			if (line) {
				for (var i = 0; i < this.indentLevel; i++) {
					line = this.indent + line;
				}
				this.file.write(line + "\n");
			}
		};
		
		function _escapeAndEncode (str) {
			return str;
		}
	}
	
	var PLISTHEADER = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">'
		].join("\n");
	
	function PlistWriter (file, indentLevel, indent, writeHeader)
	{
		DumbXMLWriter.call(this, file, indentLevel, indent);
		this.file.write(PLISTHEADER + "\n");
		
		this.writeValue = function (value) {
			switch(typeof(value)) {
				case "string":
					this.simpleElement("string", value);
					break;
				
				case "boolean":
					if (value) {
						this.simpleElement("true");
					} else {
						this.simpleElement("false");
					}
					break;
				
				case "number":
					if (value % 1 === 0) {
						this.simpleElement("integer", "" + value);
					} else {
						this.simpleElement("real", "" + value);
					}
					break;
				
				case "object":
					// case date:
					if (value instanceof Date) {
						this.simpleElement("date", ISODateString(value));
					}
					// case array:
					else if (value instanceof Array) {
						this.writeArray(value);
					}
					// case dict:
					else {
						this.writeDict(value);
					}
					break;
				
				/*
				case "data":
					?????
					break;
				*/
				
				default:
					assert(false, "Unsupported type: " + typeof(value));
					break;
			}
		};
		
		this.writeData = function (data) {
			// ????
		};
		
		this.writeDict = function (d) {
			this.beginElement("dict");
			var items = new Array();
			for (property in d) {
				items[items.length] = {key: property, value: d[property]};
			}
			items.sort(function (item1, item2) {
				return item1.key <= item2.key;
			});
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				assert(typeof(item.key) === "string")
				this.simpleElement("key", item.key);
				this.writeValue(item.value);
			}
			this.endElement("dict");
		};
		
		this.writeArray = function (array) {
			this.beginElement("array");
			for (var i = 0; i < array.length; i++) {
				this.writeValue(array[i]);
			}
			this.endElement("array");
		};
	}
	
	subclass(PlistWriter, DumbXMLWriter);
	
	return lib;
})();

var pl = {
	aString: "Doodah",
	aList: ["A", "B", 12, 32.1, [1, 2, 3]],
	aFloat: 0.1,
	anInt: 728,
	aDict: {
		anotherString: "<hello & hi there!>",
		aUnicodeValue: 'M\xe4ssig, Ma\xdf',
		aTrueValue: true,
		aFalseValue: false
	},
	/*someData: ???, */
	/*someMoreData: ???, */
	aDate: new Date("October 26, 1987 13:14:00")
};

var xml = PlistLib.writePlist(pl);
console.log(xml);
