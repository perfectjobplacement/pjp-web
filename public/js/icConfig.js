var globalObj = {};


globalObj.categoryArray = [{
	key: '1',
	name: 'Post Graduation'
},{
	key: '2',
	name: 'Under Graduates'
},{
	key: '3',
	name: 'BE'
},{
	key: '4',
	name: 'DIPLOMA'
},{
	key: '5',
	name: 'ITI'
},{
	key: '6',
	name: 'Other'
}];

globalObj.requiredDocuments = [
	'Any Id Proof',
	'Adhar Card',
	'Pan Card',
	'Driving Licence',
	'Voter Id',
	'Passport Size Photo (2)'
];

globalObj.categoryObject = {
    '1': 'Post Graduation',
    '2': 'Under Graduates',
    '3': 'BE / ME',
    '4': 'DIPLOMA',
    '5': 'ITI',
    '6': 'Other'
};

globalObj.candidateMinExp = {
    '1': 'Fresher',
    '2': '6 Month To 1 Year',
    '3': '1 To 2 Year',
    '4': '3 To 5 Year',
    '5': '5 Year +'
};

globalObj.candidateGenderType = {
    '1': 'Male',
    '2': 'Female',
    '3': 'Both'
};

globalObj.whPerDay = {
    '1': '4 Hours',
    '2': '6 Hours',
    '3': '8 Hours',
    '4': '10 Hours',
    '5': '12 Hours'
};

globalObj.jobCategory = {
    '1': 'Industrial',
    '2': 'Computer',
    '3': 'Account',
    '4': 'Sales & Marcketing',
    '5': 'Back Office',
    '6': 'Others',
};

globalObj.jobWorkType = {
    '1': 'Full Time',
    '2': 'Part Time',
    '3': 'Both'
};

globalObj.dpFormat = 'dd-MM-yyyy';

globalObj.multiSelect = function(array, key) {
	if (array.indexOf(key) == -1) {
		array.push(key);
	} else {
		array.splice(array.indexOf(key), 1);
	}
}


















/**
 * Not valid file extention
 */
var getUnsupportedFileExtension = function() {
    return ['php', 'js', 'css', 'asp', 'rb', 'htaccess', 'htpasswd', 'html'];
}


/**
 * Sorting (By key)
 */
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


/**
 * Convert To <BR>
 */
var convertToBR = function(value) {
    if (value && (typeof value) == 'string') {
        return value.replace(/\n/g, "<br />");
    }
    return '';
}


/**
 * Track Visitor
 */
var trackVisitor = function() {
    try {
        $.ajax({
            type: "POST",
            url: window.location.origin + "/api/site/user-visitor",
            data: {
                user_id: ''
            }
        }).done(function(msg) {});
    } catch (err) {
        console.log("err >>>>", err);
    }
}

// Track Visitor
trackVisitor();


/**
 * Unique id
 */
var getUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}