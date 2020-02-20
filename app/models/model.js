'use strict';

var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;


var AppConfig = new Schema({
	appTitle: String,
	headerTitle: String,
	appTagline: String,
	helpContact1: String,
	helpContact2: String,
	officeC1: String,
	officeC2: String,
	officeEmail: String,
	hrContact1: String,
	hrContact2: String,
	hrContactEmail: String,
	createdAt: Number,
	headerTotalJob: String,
	Address: String,
	appleAppLink: String,
	androidAppLink: String,
	googleLink: String,
	facebookLink: String,
	instaLink: String,
	linkedinLink: String,
	whatsAppinLink: String,
});


var OurTeam = new Schema({
	fullname: String,
	position: String,
	mobile: Number,
	email: String,
	photo: String,
	fblink: String,
	twitterlink: String,
	linkedinlink: String,
});

var AdminUsers = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	isAdmin: {type: Boolean, default: true},
	createdAt: Number,
	isActive: {type: Boolean, default: true},
});

var Inquiry = new Schema({
	type: String,
	name: String,
	email: String,
	contact: String,
	subject: String,
	message: String,
	createdAt: Number,
	isRead: {type: Boolean, default: false},
	status: {type: Boolean, default: false},
});

var CandidateRegister = new Schema({
	name: String,
	email: String,
	password: String,
	image: String,
	resume: String,
	mobile: Number,
	wpContact: Number,
	gender: String,
	city: String,
	currentLocation: String,
	birthDate: String,
	qualification: String,
	department: String,
	areaOfInterest: [],
	expectedSalary: String,
	experience: String,
	jobId: String,
	createdAt: Number,
	status: {type: Boolean, default: false},
});

var TrackUniqueContact = new Schema({
	jobId: String,
	contact: String,
	platform: String,
	createdAt: Number,
	status: {type: Boolean, default: false},
});

var JobsBazaar = new Schema({
	jobTitle: String,
	notes: String,
	image: String,
	attachments: [],
	jobWorkType: String,
	qualification: String,
	candidateType: Number,
	jobPosition: String,
	workProfile: String,
	department: [],
	cexpRequired: String,
	salaryType: String,
	salary: String,
	jobCity: String,
	jobLocation: String,
	jobTiming: String,
	facility: String,
	jobCategory: String,
	userId: String,
	numbersOfCandidatesRequired: Number,
	interviewDateFrom: Date,
	interviewDateTo: Date,
	requiredDoc: [],
	createdAt: Number,
	updatedAt: Number,
	totalView: Number,
	createdBy: String,
	status: {type: Number, default: 1}
});

JobsBazaar.index({
	status: true,
});

JobsBazaar.index({
	jobCity: true,
});

JobsBazaar.index({
	createdAt: -1,
});

mongoose.model('Inquiry', Inquiry);
mongoose.model('JobsBazaar', JobsBazaar);
mongoose.model('CandidateRegister', CandidateRegister);
mongoose.model('TrackUniqueContact', TrackUniqueContact);
mongoose.model('AppConfig', AppConfig);
mongoose.model('OurTeam', OurTeam);
mongoose.model('AdminUsers', AdminUsers);



var OurClients = new Schema({
	companyName: String,
	contactPersonName: String,
	email: String,
	password: String,
	contact: Number,
	wpContact: Number,
	city: String,
	address: String,
	companyWebsite: String,
	isActive: {type: Boolean, default: true},
	createdAt: Number
});

mongoose.model('OurClients', OurClients);



var QualificationSchema = new Schema({
	name: String,
	qualifyIn: String,
	status: {type: Boolean, default: false}
});

var AreaOfInterestSchema = new Schema({
	title: String,
	department: String,
	status: {type: Boolean, default: false}
});

var JobLocations = new Schema({
	city: String,
	status: {type: Boolean, default: false}
});

var SiteVisitorSchema = mongoose.Schema({
    session_id: String,
    site_mgmt_id: String,
    ip_address: String,

    user_id: String,
    timestamp: Number,
    user_agent: {},

    country: String,
    region: String,
    areaCode: String,
    countryCode: String,
    latitude: String,
    longitude: String,
    continentCode: String,
});


mongoose.model('Qualifications', QualificationSchema);
mongoose.model('AreaOfInterest', AreaOfInterestSchema);
mongoose.model('JobLocations', JobLocations);
mongoose.model('SiteVisitor', SiteVisitorSchema);


var advertisementSchema = mongoose.Schema({
    title: String,
    subTitle: String,
    description: String,
    contentPosition: String,
    image: String,
    isActive: {type: Boolean, default: false},
    expireOn: Number,
});

mongoose.model('advertisement', advertisementSchema);


var employeeSchema = mongoose.Schema({
    fullname: String,
    email: String,
    address: String,
    contact: String,
    timestamp: Number,
});

mongoose.model('ourEmployee', employeeSchema);


var attendenceSchema = mongoose.Schema({
    userId: String,
    email: String,
    address: String,
    dateYMD: String,
    timestamp: Number,
});

mongoose.model('employeeAttendence', attendenceSchema);