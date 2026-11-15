import { getDisplayId } from './displayId';

export const LEGACY_STATUS_MAP = {
  'Submitted': 'Application Received',
  'Pending': 'Application Received',
  'Under Review': 'Application Under Review',
  'Processed': 'Application Processed',
  'Paid Students': 'Fees Paid',
  'CAS / I-20 Requested': 'CAS Requested',
  'CAS / I-20 Issued': 'CAS Issued',
  'Visa Processing': 'Application Under Review',
  'Visa Approved': 'Visa Received',
  'Visa Pending': 'Application Under Review',
  'Enrolled / Closed': 'Student Enrolled & Closed',
  'Rejected / Closed': 'Rejected & Closed',
  'Withdrawn / Closed': 'Withdrawn & Closed',
};

export function normalizeAppStatus(rawStatus) {
  if (!rawStatus) return 'Application Received';
  return LEGACY_STATUS_MAP[rawStatus] || rawStatus;
}

export function mapListApplication(app) {
  const normalizedStatus = normalizeAppStatus(app.status || app.secondaryStatus);
  return {
    ...app,
    id: app.id || app._id,
    camsId: app.camsId || getDisplayId(app),
    studentName: app.studentName || app.student?.name || 'N/A',
    passportNo: app.passportNo || app.student?.passportNo || 'N/A',
    email: app.email || app.student?.email || '',
    phone: app.phone || app.student?.phone || '',
    universityName: app.universityName || app.university?.name || 'N/A',
    courseName: app.courseName || app.course?.title || 'N/A',
    secondaryStatus: normalizedStatus,
    status: normalizedStatus,
    dateAdded: app.dateAdded || (app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''),
    commissionStatus: app.commissionStatus || 'Unclaimed',
    paymentStatus: app.paymentStatus || 'Pending'
  };
}
