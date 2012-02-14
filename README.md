# plistlib.js

An experimental port of [Python's plistlib module][plistlib] to JavaScript. Not fully tested and probably full of bugs, so use at your own risk!

## Features

* Convert JavaScript objects to [XML property lists][plist].

## Known issues

* String escaping is very basic (`_escapeAndEncode`)
* Currently write-only (no ability to parse XML yet).
* Does not support binary data (the `<data>` tag).

## Example

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

Here's what you should get as output:

	<?xml version="1.0" encoding="UTF-8"?>
	<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
	<plist version="1.0">
	<dict>
		<key>anInt</key>
		<integer>728</integer>
		<key>aString</key>
		<string>Doodah</string>
		<key>aList</key>
		<array>
			<string>A</string>
			<string>B</string>
			<integer>12</integer>
			<real>32.1</real>
			<array>
				<integer>1</integer>
				<integer>2</integer>
				<integer>3</integer>
			</array>
		</array>
		<key>aFloat</key>
		<real>0.1</real>
		<key>aDict</key>
		<dict>
			<key>anotherString</key>
			<string>&lt;hello &amp; hi there!&gt;</string>
			<key>aUnicodeValue</key>
			<string>Mässig, Maß</string>
			<key>aTrueValue</key>
			<true/>
			<key>aFalseValue</key>
			<false/>
		</dict>
		<key>aDate</key>
		<date>1987-10-26T18:14:00Z</date>
	</dict>
	</plist>

[plistlib]: http://docs.python.org/dev/library/plistlib.html
[plist]: http://en.wikipedia.org/wiki/Property_list
