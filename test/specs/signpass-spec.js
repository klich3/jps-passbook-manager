'use strict';
const fs = require('fs-extra');
const _ = require('lodash');
const assert = require('assert');
const path = require('path');
const program = require(path.resolve(__dirname, '../../lib/program'))();
const SignPass = require(path.resolve(__dirname, '../../lib/signpass'));
var signpass;
var tmpdir = path.resolve(__dirname, '../../data/passes');
fs.existsSync(tmpdir);

var certFilename = path.resolve(__dirname, '../../certificates/pass-cert.pem');
var keyFilename = path.resolve(__dirname, '../../certificates/pass-key.pem');

var wwdrFilename = path.resolve(__dirname, '../../certificates/wwdr-authority.pem');


const TEST_PASS_P12 = path.resolve(__dirname, '../../certificates/pass.io.passbookmanager.p12');
var certPass = 'fred';
const TEST_PASS_TYPE_IDENTIFIER = 'pass.io.passbookmanager';
const TEST_PASSPHRASE = 'fred';

var passFilename = path.resolve(__dirname, '../../data/pass-jonniespratley.json');
var rawpassFilename = path.resolve(__dirname, '../../data/passes/pass-jonniespratley.raw');
var pkpassFilename = path.resolve(__dirname, '../../data/passes/pass-jonniespratley.pkpass');
var outputFilename = path.resolve(__dirname, '../temp/passes/');
var files = null;


var options = {
	passFilename: rawpassFilename,
	cert: certFilename,
	passphrase: certPass,
	key: keyFilename,
	wwdr: wwdrFilename,
	outputFilename: tmpdir,
	compress: true
};

var passes = [];

describe('SignPass', function(done) {


	it('should be defined', function(done) {
		assert(SignPass);
		done();
	});

	xit('should return PassTypeId object', function(done) {
		options = SignPass.createPassTypeId('pass.passbook-manager.io', {});
		assert(options);
		done();
	});

	it('createPems() - should create -cert.pem and -key.pem files from a .p12 certficate.', function(done) {

		SignPass.createPems(
			TEST_PASS_TYPE_IDENTIFIER,
			TEST_PASS_P12,
			TEST_PASSPHRASE,
			function(err, resp) {

				console.log(resp);
				options = resp;
				assert(fs.existsSync(options.key));
				assert(fs.existsSync(options.cert));
				done();
			});
	});



	it('should create SignPass instance', function(done) {
		signpass = new SignPass(options);
		assert(signpass);
		done();
	});


	it('sign() - all passes - should create .zip and .pkpass for all passes', function(done) {
		var _done = _.after(passes.length, function() {
			done();
		});

		program.db.find({
			docType: 'pass'
		}).then(function(resp) {
			passes = resp;

			// TODO: Sign each pass with cert.
			_.forEach(passes, function(pass) {
				console.log('creating pass', pass.filename);
				//set .raw folder
				options.passFilename = pass.filename;

				signpass = new SignPass(options);
				signpass.sign(function(err, resp) {
					assert(resp);
					//assert(fs.existsSync(resp.zip));
					assert(fs.existsSync(resp.pkpass));
					_done(resp);
				});


			});
		});

	});

	xit('sign_pass() - should create .zip and .pkpass files', function(done) {
		signpass.sign(function(err, resp) {
			files = resp;
			assert(resp);
			assert(fs.existsSync(files.zip));
			assert(fs.existsSync(files.pkpass));
			done();
		});
	});

});
