var Promise = require('bluebird'),

	fs = Promise.promisifyAll(require('fs')),
	glob = Promise.promisify(require('glob')),
	spritesmith = Promise.promisify(require('spritesmith')),

	_ = require('lodash'),

	minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
	alias: {
		n: 'name',
		o: 'output',
		t: 'template',
		v: 'verbose'
	},

	default: {
		output: 'output'
	}
});

if (!argv.name || !argv.template || !argv._)
{
	console.log('Usage: node spritesheet [options] [globs]');
	console.log('       node spritesheet -n Example -t templates/cpp/template.h -t templates/cpp/template.cpp example/*.png');
	console.log('');
	console.log('Options:');
	console.log('  -n, --name      spritesheet name (used in templates)');
	console.log('  -o, --output    output file path name (no extension, defaults to "output")');
	console.log('  -t, --template  template file to process (you may specify several)');
	console.log('  -v, --verbose   verbose output');
	return;
}

var name = argv.name,
	outputName = argv.output,
	templateFileNames = argv.template,
	globs = argv._,
	verbose = !!argv.verbose,

	spritesheetFileName = outputName + '.png';

// ensure that the templates are an array, even if there's just one template
if (Object.prototype.toString.call(templateFileNames) !== '[object Array]')
{
	templateFileNames = [ templateFileNames ];
}

Promise
	// go through all globs and collect their results
	.all(globs.map(function(v) {
		if (verbose) console.log('Globbing:', v);
		return glob(v);
	}))

	// go through the results of the globs and flatten them, preventing duplicates
	.then(function(filesArr) {
		var files = [];

		// filesArr is an array of arrays of files, one array per glob
		filesArr.forEach(function(arr) {
			arr.forEach(function(file) {
				if (files.indexOf(file) === -1)
				{
					files.push(file);
				}
			});
		});

		if (verbose) console.log('Processing files:', files);

		return files;
	})

	.then(function(files) {
		if (verbose) console.log('Creating spritesheet...');

		var promises = [
			// feed the flattened list of files through spritesmith
			spritesmith({ src: files })
		];

		// read each template's contents
		templateFileNames.forEach(function(v) {
			if (verbose) console.log('Loading template:', v);
			promises.push(fs.readFileAsync(v, 'utf8'));
		});

		return Promise.all(promises);
	})

	.then(function(args) {
		if (verbose) console.log('Saving spritesheet and processed template(s)...');

		var result = args[0],
			coords = result.coordinates,
			props = result.properties,

			templates = args.slice(1),
			sprites = [];

		for (k in coords)
		{
			if (coords.hasOwnProperty(k))
			{
				var v = coords[k];
				sprites.push({
					fileName: k,
					x: v.x,
					y: v.y,
					w: v.width,
					h: v.height
				});
			}
		}

		var templateData = {
			sprites: sprites,
			props: props,
			fileName: spritesheetFileName,
			name: name
		};

		if (verbose) console.log('Writing spritesheet:', spritesheetFileName);

		var promises = [
			// write the spritesheet image itself
			fs.writeFileAsync(spritesheetFileName, result.image, 'binary'),
		];

		// write the processed templates
		templates.forEach(function(v, idx) {
			var t = _.template(v),
				output = t(templateData),
				fileName = templateFileNames[idx],
				periodIdx = fileName.indexOf('.');

			if (periodIdx !== -1)
			{
				fileName = fileName.substr(periodIdx);
			}

			var templateFileName = outputName + fileName;

			if (verbose) console.log('Writing template:', templateFileName);

			promises.push(fs.writeFileAsync(templateFileName, output, 'utf8'));
		});

		return Promise.all(promises);
	})

	.then(function() {
		if (verbose) console.log('All done!');
	})

	.catch(function(err) {
		console.error('Oops, something went wrong!');
		console.error(err);
	});
