var assert = require('assert'),
	path = require('path'),
	fs = require('fs-extra'),
	os = require('os'),
	Passbook = require(path.resolve(__dirname, '../../lib/jps-passbook'));

var program = require(path.resolve(__dirname, '../../lib/program.js'))();
var config = program.config.defaults;
var jpsPassbook = new Passbook(program);
var mocks = require(path.resolve(__dirname, '../helpers/mocks'));
var mockDevice = mocks.mockDevice;
var mockPass = mocks.mockPass;
var testPass = mockPass;
var testPassfile = '';
var rawPassFolder = '';
var testPassDir = path.resolve(__dirname, '../../.tmp/');

var passFiles = [];



describe('PassKit', function() {
	it('createPass() - should create each pass type', function(done) {
		mocks.mockPasses.forEach(function(pass) {
			jpsPassbook.createPass(pass, true).then(function(data) {
				console.log('pass created', data);
				passFiles.push(data);
				assert.ok(data._id);
			});
		});
		done();
	});

	it('createPass() - should create a pass .raw and sign into a .pkpass', function(done) {
		console.log(passFiles);
		jpsPassbook.createPass(mockPass, true).then(function(p) {
			assert(fs.existsSync(p.rawFilename));
			done();
		}).catch(function(err) {
			assert.fail(err);
			done();
		});
	});

	it('signPass() - should sign .raw package into a .pkpass', function(done) {
		this.timeout(5000);
		jpsPassbook.signPass(mockPass).then(function(p) {
			assert.ok(p, 'returns pass location');
			//	assert(fs.existsSync(p));
			done();
		}).catch(function(err) {
			assert.fail(err);
			done();
		});
	});

	it('validatePass() - should validate a pass', function(done) {
		jpsPassbook.validatePass(mockPass).then(function(pass) {
			assert.ok(pass, 'returns pass');
			done();
		}).catch(function(err) {
			assert.fail(err);
			done();
		});
	});
});
