import { formatFee } from './courseFee';
export function mapNotice(notice) {
  return {
    ...notice, id: notice._id, message: notice.content || '', type: notice.category || 'General',
    badge: notice.badge || notice.priority, date: notice.createdAt ? new Date(notice.createdAt).toLocaleDateString('en-GB') : '',
    popup: ['High', 'Urgent'].includes(notice.priority), isNew: false, image: notice.image || ''
  };
}

export function mapCourse(course) {
  return {
    ...course, id: course._id, universityId: course.university?._id,
    university: course.university?.name || '', country: course.university?.country || '',
    level: course.degreeLevel || '', fee: formatFee(course.tuitionFee, course.currency, course.feePeriod),
    intake: (course.intakes || []).map(i => typeof i === 'object' ? i.title : i).filter(Boolean).join(', '),
    gradient: 'from-[#D99A1C] to-[#F5B025]'
  };
}

export function publishedDeadlines(courses, scholarships) {
  const rows = courses.filter(c => c.applicationDeadline || c.deadline).map(c => ({
    id: c._id, university: c.university?.name || '', country: c.university?.country || '',
    courseType: c.degreeLevel || '', deadline: c.applicationDeadline || c.deadline,
    appDeadline: c.applicationDeadline || c.deadline, scholarshipDeadline: 'Not provided'
  }));
  for (const scholarship of scholarships) {
    if (scholarship.deadline) rows.push({
      id: scholarship._id, university: scholarship.university || '', country: scholarship.country || '',
      courseType: scholarship.category || 'Scholarship', deadline: scholarship.deadline,
      appDeadline: 'Not provided', scholarshipDeadline: scholarship.deadline
    });
  }
  return rows.filter(row => !Number.isNaN(new Date(row.deadline).getTime())).map(row => {
    const days = Math.ceil((new Date(row.deadline) - new Date()) / 86400000);
    return { ...row, urgency: days <= 30 ? 'danger' : days <= 60 ? 'warning' : 'success' };
  });
}
