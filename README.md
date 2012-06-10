Simplistic module loader. Right now it simply replaces series of HTML tags:

	<script src="static/js/myscript.js" type="text/javascript">

with one-liner:

	use('myscript');
	
It was intendet to help organize countless JS libraries and plugins, while maintaining clean DOM and scripts visible and debuggable in FireBug.

Portions (i.e. script loading) code borrowed from [RequireJS](http://requirejs.org/) project.