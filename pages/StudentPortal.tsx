
import React from 'react';
import { Layout } from '../components/Layout';
import { UserRole } from '../types';
import { dataService } from '../services/mockData';
import { BookOpen, Star, Calendar, Clock, CheckCircle, FileText, Download } from 'lucide-react';

interface StudentPortalProps {
  onLogout: () => void;
  studentId: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onLogout, studentId }) => {
  const student = dataService.getStudentById(studentId);
  
  if (!student) return <div>جاري التحميل...</div>;
  
  const notifications = dataService.getNotificationsForStudent(student.gradeLevel);
  const schedule = dataService.getSchedule(student.gradeLevel);
  const books = dataService.getBooksByGrade(student.gradeLevel);
  const homeworks = notifications.filter(n => n.type === 'HOMEWORK');

  return (
    <Layout role={UserRole.STUDENT} title="بوابة الطالب" onLogout={onLogout} userName={student.name}>
        
        {/* Student Header */}
        <div className="bg-gradient-to-l from-blue-600 to-blue-500 text-white p-6 rounded-2xl shadow-lg mb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">أهلاً بك، {student.name}</h2>
                    <p className="opacity-90 mt-1 text-blue-100">الصف: {student.gradeLevel} | رقم الجلوس: {student.seatNumber}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <Star className="text-yellow-300 w-8 h-8" fill="currentColor" />
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Grades & Homework */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Textbooks Section (New) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BookOpen className="text-blue-600" /> الكتب الدراسية
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {books.length > 0 ? books.map(book => (
                            <div key={book.id} className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-blue-50/50 border-blue-100">
                                <div className="p-3 bg-white rounded-lg text-red-500 shadow-sm">
                                    <FileText size={24} />
                                </div>
                                <div className="mr-3 flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{book.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{book.fileName}</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 p-2">
                                    <Download size={20} />
                                </button>
                            </div>
                        )) : (
                            <p className="col-span-2 text-center text-gray-400 py-6 bg-gray-50 rounded border border-dashed">
                                لم يتم رفع كتب دراسية لهذا الصف بعد
                            </p>
                        )}
                    </div>
                </div>

                {/* Grades Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Star className="text-yellow-500" /> كشف الدرجات
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(student.grades).map(([subject, score]) => (
                            <div key={subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
                                        <BookOpen size={18} />
                                    </div>
                                    <span className="font-bold text-gray-700">{subject}</span>
                                </div>
                                <div className={`font-bold text-xl ${
                                    score >= 90 ? 'text-green-600' : 
                                    score >= 75 ? 'text-blue-600' : 
                                    score >= 50 ? 'text-orange-600' : 'text-red-600'
                                }`}>
                                    {score}%
                                </div>
                            </div>
                        ))}
                         {Object.keys(student.grades).length === 0 && (
                            <p className="col-span-2 text-center text-gray-400 py-4">لم يتم رصد درجات حتى الآن</p>
                         )}
                    </div>
                </div>

                {/* Weekly Schedule */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                     <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-blue-500" /> الجدول الدراسي
                    </h3>
                    <table className="w-full min-w-[600px] text-sm">
                        <thead>
                            <tr className="bg-blue-50 text-blue-800">
                                <th className="p-3 text-right rounded-r-lg">اليوم</th>
                                {Array.from({length: 6}).map((_, i) => (
                                    <th key={i} className="p-3 text-center">الحصة {i+1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schedule.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="p-3 font-bold text-gray-700">{item.day}</td>
                                    {item.periods.map((p, pIdx) => (
                                        <td key={pIdx} className="p-3 text-center text-gray-600">
                                            {p === '---' ? '-' : p}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Column: Homework & Notifications */}
            <div className="space-y-6">
                 {/* Homework Widget */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock className="text-red-500" /> الواجبات المنزلية
                    </h3>
                    <div className="space-y-3">
                        {homeworks.length > 0 ? homeworks.map(hw => (
                             <div key={hw.id} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-red-800 text-sm">{hw.title}</span>
                                    <span className="text-xs text-red-400">{hw.date}</span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">{hw.message}</p>
                             </div>
                        )) : (
                            <div className="text-center py-6 text-gray-400 flex flex-col items-center">
                                <CheckCircle size={32} className="mb-2 opacity-50" />
                                <p>لا يوجد واجبات حالياً</p>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* General Notifications */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">تنبيهات وإشعارات</h3>
                    <div className="space-y-4">
                        {notifications.filter(n => n.type !== 'HOMEWORK').map(notif => (
                            <div key={notif.id} className="pb-3 border-b border-gray-50 last:border-0">
                                <h4 className="text-sm font-bold text-gray-800">{notif.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                            </div>
                        ))}
                         {notifications.filter(n => n.type !== 'HOMEWORK').length === 0 && (
                            <p className="text-center text-gray-400 text-sm">لا توجد إشعارات</p>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    </Layout>
  );
};
