Prerequisites
-------------
	You need a working CloudFoundry instance, either a local MicroCloud
or a cloudfoundry.com instance. Here a local MicroCloud instance is used and
it is of version 1.2.0. Vmc has to be working (mine was version 0.3.18) and
I used ruby 1.9.3p0.

General
-------
	CloudFoundry doesn't support coffee-script natively, so a node
application called app.js is created which initializes the coffee-script
library and loads the application itself (twitter.coffee).

	The application adapts to CloudFoundry environment by using the
cloudfoundry package.

	Some workarounds are in place like using xhr-polling instead of
sockets as CloudFoundry doesn't yet support sockets. Also as the broadcast
of the tweet isn't done in a normal function, io.sockets is used directly to
get the broadcast to work. This requires the exposing of @io to io so that
it is visible in the method.

First push
----------
	Change into the application directory.

	Ensure that the correct npm modules are in place:
		npm install

	Remember to edit your Twitter credentials into credential.js!

	Connect to the CloudFoundry instance:
		vmc target api.<myinstance>.cloudfoundry.me

	Push the application specifying the correct node-version:
		vmc push --runtime=node06 twitter

	Accept the defaults and then you should be able to test the
application by pointing your browser to:
		http://twitter.<myinstace>.cloudfoundry.me

Updates
-------
	Updates a simpler because the runtime doesn't need to be defined
every time an update is made, so it's simply:
		vmc update twitter

Note
----
	At the moment the node_modules directory contains packages that
aren't used by the Zappa and CoffeeScript version as Zappa includes both
socket.io and express, but the amount of unnecessary diskspace they take is
negligible.
