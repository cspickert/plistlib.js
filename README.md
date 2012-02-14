# plistlib.js

An experimental port of [Python's plistlib module][plistlib] to JavaScript. Not fully tested and probably full of bugs, so use at your own risk!

## Quick start

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
		aDate: new Date("October 26, 1987 13:14:00")
	};
	
	var xml = PlistLib.writePlist(obj);
	console.log(xml);

## Features

* Convert JavaScript objects to [XML property lists][plist].

## Known issues

* Currently write-only (no ability to parse XML yet).
* Does not properly escape strings (`_escapeAndEncode` is unimplemented)
* Does not support binary data (the `<data>` tag).

[plistlib]: http://docs.python.org/dev/library/plistlib.html
[plist]: http://en.wikipedia.org/wiki/Property_list
