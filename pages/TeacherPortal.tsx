
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { UserRole, Student } from '../types';
import { dataService } from '../services/mockData';
import { Users, BookOpen, Send, CheckCircle, RotateCw } from 'lucide-react';

interface TeacherPortalProps {
  onLogout: () => void;
  teacherId: string;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ onLogout, teacherId }) => {
  const teacher = dataService.getTeacherById(teacherId);
  const [selectedGrade, setSelectedGrade] = useState(teacher?.gradeLevels[0] || '');
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'HOMEWORK'>('STUDENTS');
  const [students, setStudents] = useState<Student[]>([]);
  const [refresh, setRefresh] = useState(0);

  // Effect to load students whenever selected grade or refresh changes
  useEffect(() => {
    if (selectedGrade) {
        setStudents(dataService.getStudentsByGrade(selectedGrade));
    }
  }, [selectedGrade, refresh]);

  const handleManualRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  if (!teacher) return <div>Loading...</div>;

  return (
    <Layout role={UserRole.TEACHER} title="بوابة المعلم" onLogout={onLogout} userName={teacher.name}>
      
      {/* Teacher Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
             <h2 className="text-2xl font-bold text-gray-800">أهلاً بك، {teacher.name}</h2>
             <p className="text-gray-500 mt-1">مادة: <span className="font-semibold text-teal-600">{teacher.subject}</span></p>
         </div>
         <div className="flex items-center gap-4">
             <button onClick={handleManualRefresh} className="text-gray-500 hover:text-teal-600 p-2" title="تحديث القائمة">
                <RotateCw size={20} />
             </button>
             <div className="flex gap-2 overflow-x-auto">
                {teacher.gradeLevels.map(grade => (
                    <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            selectedGrade === grade ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {grade}
                    </button>
                ))}
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('STUDENTS')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'STUDENTS' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500'}`}
          >
            <Users size={18} /> طلابي والدرجات
          </button>
          <button 
            onClick={() => setActiveTab('HOMEWORK')}
            className={`pb-3 px-4 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'HOMEWORK' ? 'border-teal-600 text-teal-700' : 'border-transparent text-gray-500'}`}
          >
            <BookOpen size={18} /> الواجبات والإشعارات
          </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 min-h-[400px]">
          {activeTab === 'STUDENTS' ? (
              <StudentsGradebook students={students} subject={teacher.subject} onUpdate={handleManualRefresh} />
          ) : (
              <HomeworkManager grade={selectedGrade} teacherName={teacher.name} subject={teacher.subject} />
          )}
      </div>
    </Layout>
  );
};

const StudentsGradebook = ({ students, subject, onUpdate }: { students: Student[], subject: string, onUpdate: () => void }) => {
    const [grades, setGrades] = useState<Record<string, string>>({});
    const [modified, setModified] = useState<Record<string, boolean>>({});

    // Initialize form with existing grades
    useEffect(() => {
        const initialGrades: Record<string, string> = {};
        students.forEach(s => {
            initialGrades[s.id] = s.grades[subject]?.toString() || '';
        });
        setGrades(initialGrades);
        setModified({});
    }, [students, subject]);

    const handleGradeChange = (studentId: string, val: string) => {
        setGrades(prev => ({...prev, [studentId]: val}));
        setModified(prev => ({...prev, [studentId]: true}));
    };

    const saveGrade = (studentId: string) => {
        const val = grades[studentId];
        if (!val && val !== '0') return;

        const num = parseInt(val);
        if (isNaN(num) || num < 0 || num > 100) {
            alert('الرجاء إدخال درجة صحيحة بين 0 و 100');
            return;
        }

        dataService.updateStudentGrades(studentId, subject, num);
        setModified(prev => ({...prev, [studentId]: false}));
        onUpdate(); // Refresh data from DB
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">رصد وتعديل درجات مادة {subject}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{students.length} طالب</span>
            </div>
            
            {students.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3 border-b">رقم الجلوس</th>
                                <th className="p-3 border-b">اسم الطالب</th>
                                <th className="p-3 border-b text-center">الدرجة المسجلة</th>
                                <th className="p-3 border-b">تعديل الدرجة</th>
                                <th className="p-3 border-b text-center">حفظ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map(student => {
                                const currentVal = grades[student.id] ?? '';
                                const isChanged = modified[student.id];
                                
                                return (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-mono text-teal-700 text-sm">{student.seatNumber}</td>
                                    <td className="p-3 font-medium">{student.name}</td>
                                    <td className="p-3 text-center font-bold text-gray-700">
                                        {student.grades[subject] !== undefined ? student.grades[subject] : <span className="text-gray-300">-</span>}
                                    </td>
                                    <td className="p-3">
                                        <input 
                                            type="number" 
                                            className={`w-24 p-2 border rounded text-center outline-none transition-all ${
                                                isChanged ? 'border-teal-500 ring-1 ring-teal-200 bg-teal-50' : 'border-gray-300'
                                            }`}
                                            placeholder="الدرجة"
                                            value={currentVal}
                                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="p-3 text-center">
                                        {isChanged && (
                                            <button 
                                                onClick={() => saveGrade(student.id)}
                                                className="text-white bg-teal-600 hover:bg-teal-700 p-2 rounded-lg shadow-sm transition-all flex items-center gap-1 mx-auto text-xs"
                                                title="حفظ التعديل"
                                            >
                                                <CheckCircle size={14} /> حفظ
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-400 py-8 bg-gray-50 rounded-lg border border-dashed">
                    لا يوجد طلاب مسجلين في هذا الصف حتى الآن
                </p>
            )}
        </div>
    );
};

const HomeworkManager = ({ grade, teacherName, subject }: { grade: string, teacherName: string, subject: string }) => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');

    const sendHomework = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !details) return;
        
        dataService.addNotification({
            id: Math.random().toString(36).substr(2, 9),
            title: `واجب: ${title} (${subject})`,
            message: details,
            date: new Date().toISOString().split('T')[0],
            type: 'HOMEWORK',
            targetId: grade,
            sender: teacherName
        });

        setTitle('');
        setDetails('');
        alert('تم إرسال الواجب للطلاب وأولياء الأمور');
    };

    return (
        <div className="max-w-2xl">
            <h3 className="font-bold text-lg text-gray-800 mb-2">إرسال واجب جديد لـ {grade}</h3>
            <p className="text-sm text-gray-500 mb-6">سيصل هذا الإشعار للطلاب وأولياء الأمور فوراً.</p>

            <form onSubmit={sendHomework} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الواجب</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="مثال: حل تمارين صفحة ٤٥"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل الواجب</label>
                    <textarea 
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={4}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="اكتب تعليمات الواجب هنا..."
                    ></textarea>
                </div>
                <button 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
                >
                    <Send size={18} /> إرسال الواجب
                </button>
            </form>
        </div>
    );
};
