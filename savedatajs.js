// Data Access Tier - logic related to the data access tier

function processInfo( fname, lname, phone, startDate, duration, endDate, specialRequest, gender) {
    const dbString = stringify( fname, lname, phone, startDate, duration, endDate, specialRequest, gender);
    localStorage.setItem( dbString);
}

function stringify( fname, lname, phone, startDate, duration, endDate, specialRequest, gender) {
    const fnameStr = 'fname: ' + fname;
    const lnameStr = 'lname: ' + lname;
    const phoneStr = 'phone: ' + phone;
    const startDateStr = 'startDate: ' + startDate;
    const durationStr = 'duration: ' + duration;
    const endDateStr = 'endDate: ' + endDate;
    const specialRequestStr = 'specialRequest: ' + specialRequest;
    const genderStr = 'gender: ' + gender;
    const dbStr = `{${fnameStr}, ${lnameStr}, ${phoneStr}, ${startDateStr}, ${durationStr}, ${endDateStr}, ${specialRequestStr}, ${genderStr}}`;
    return dbStr;
}

function getStudentsDb() {
    const students = []; // rows: number of students, cols: number of info params
    for (let i = 0; i < localStorage.length; i++) {
        const studentId = localStorage.key(i);
        const studentInfo = localStorage.getItem(studentId);
        const tmpStudent = [];
        tmpStudent[0] = studentId;
        tmpStudent[1] = getFname(studentInfo);
        tmpStudent[2] = getLname(studentInfo);
        tmpStudent[3] = getPhone(studentInfo);
        tmpStudent[4] = getStartDate(studentInfo);
        tmpStudent[5] = getDuration(studentInfo);
        tmpStudent[6] = getEndDate(studentInfo);
        tmpStudent[7] = getSpecialRequest(studentInfo);
        tmpStudent[8] = getGender(studentInfo);
        students[i] = tmpStudent;
    }
    return students;
}

function getFname(studentInfo) {
    const fnameIndex = studentInfo.indexOf('fname') + 7;
    const endFnameIndex = studentInfo.indexOf('lname') - 2;
    return studentInfo.substring(fnameIndex, endFnameIndex);
}

function getLname(studentInfo) {
    const lnameIndex = studentInfo.indexOf('lname') + 7;
    const endLnameIndex = studentInfo.indexOf('phone') - 2;
    return studentInfo.substring(lnameIndex, endLnameIndex);
}

function getPhone(studentInfo) {
    const phoneIndex = studentInfo.indexOf('phone') + 7;
    const endPhoneIndex = studentInfo.indexOf('startDate') - 2;
    return studentInfo.substring(phoneIndex, endPhoneIndex);
}

function getStartDate(studentInfo) {
    const startDateIndex = studentInfo.indexOf('startDate') + 11;
    const endStartDateIndex = studentInfo.indexOf('duration') - 2;
    return studentInfo.substring(startDateIndex, endStartDateIndex);
}

function getDuration(studentInfo) {
    const durationIndex = studentInfo.indexOf('duration') + 10;
    const endDurationIndex = studentInfo.indexOf('endDate') - 2;
    return studentInfo.substring(durationIndex, endDurationIndex);
}

function getEndDate(studentInfo) {
    const endDateIndex = studentInfo.indexOf('endDate') + 9;
    const endEndDateIndex = studentInfo.indexOf('specialRequest') - 2;
    return studentInfo.substring(endDateIndex, endEndDateIndex);
}

function getSpecialRequest(studentInfo) {
    const specialRequestIndex = studentInfo.indexOf('specialRequest') + 16;
    const endSpecialRequestIndex = studentInfo.indexOf('gender') - 2;
    return studentInfo.substring(specialRequestIndex, endSpecialRequestIndex);
}

function getGender(studentInfo) {
    const genderIndex = studentInfo.indexOf('gender') + 8;
    const endGenderIndex = studentInfo.indexOf('}') - 1;
    return studentInfo.substring(genderIndex, endGenderIndex);
}