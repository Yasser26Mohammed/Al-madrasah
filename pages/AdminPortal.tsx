
import React, { useState } from 'react';
import { GRADE_LEVELS, Student, Notification, UserRole, SUBJECTS, DAYS_OF_WEEK } from '../types';
import { dataService } from '../services/mockData';
import { Layout } from '../components/Layout';
import { BookOpen, Users, Calendar, Megaphone, Plus, Trash2, Save, ChevronDown, ChevronLeft, FileText } from 'lucide-react';

interface AdminPortalProps {
  onLogout: () => void;
}

type Tab = 'STUDENTS' | 'BOOKS' | 'SCHEDULE' | 'NEWS';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('STUDENTS');
  const [selectedGrade, setSelectedGrade] = useState(GRADE_LEVELS[0]);
  
  const [refreshKey, setRefreshKey] = useState(0);
  const forceRefresh = () => setRefreshKey(prev => prev + 1);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'STUDENTS': return <StudentsManager />;
      case 'BOOKS': return <BooksManager selectedGrade={selectedGrade} onChangeGrade={setSelectedGrade} refresh={refreshKey} onUpdate={forceRefresh} />;
      case 'SCHEDULE': return <ScheduleManager selectedGrade={selectedGrade} onChangeGrade={setSelectedGrade} />;
      case 'NEWS': return <NewsManager onUpdate={forceRefresh} refresh={refreshKey} />;
      default: return null;
    }
  };

  return (
    <Layout role={UserRole.ADMIN} title="لوحة تحكم الإدارة" onLogout={onLogout} userName="المدير العام">
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <TabButton active={activeTab === 'STUDENTS'} onClick={() => setActiveTab('STUDENTS')} icon={<Users />} label="الطلاب" color="blue" />
        <TabButton active={activeTab === 'BOOKS'} onClick={() => setActiveTab('BOOKS')} icon={<BookOpen />} label="الكتب الدراسية" color="emerald" />
        <TabButton active={activeTab === 'SCHEDULE'} onClick={() => setActiveTab('SCHEDULE')} icon={<Calendar />} label="الجدول الدراسي" color="purple" />
        <TabButton active={activeTab === 'NEWS'} onClick={() => setActiveTab('NEWS')} icon={<Megaphone />} label="الأخبار والإشعارات" color="orange" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
        {renderTabContent()}
      </div>
    </Layout>
  );
};

// --- Sub Components ---

const TabButton = ({ active, onClick, icon, label, color }: any) => {
  const activeClasses = active 
    ? `bg-${color}-50 text-${color}-700 border-${color}-200 ring-2 ring-${color}-500 ring-opacity-50` 
    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';
  
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${activeClasses}`}
    >
      <div className={`mb-2 ${active ? '' : 'text-gray-400'}`}>{React.cloneElement(icon, { size: 24 })}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
};

const GradeSelector = ({ selected, onChange }: { selected: string, onChange: (g: string) => void }) => (
  <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
    <span className="font-bold text-gray-700 whitespace-nowrap">اختر الصف:</span>
    {GRADE_LEVELS.map(grade => (
      <button
        key={grade}
        onClick={() => onChange(grade)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          selected === grade ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {grade}
      </button>
    ))}
  </div>
);

const StudentsManager = () => {
  const [openGrade, setOpenGrade] = useState<string | null>(GRADE_LEVELS[0]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">دليل الطلاب (مرتب حسب الصفوف)</h3>
        <div className="text-sm text-gray-500">يتم تحديث القائمة تلقائياً عند تسجيل الطلاب</div>
      </div>
      
      <div className="space-y-4">
        {GRADE_LEVELS.map(grade => {
            const isOpen = openGrade === grade;
            const students = dataService.getStudentsByGrade(grade);
            
            return (
                <div key={grade} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button 
                        onClick={() => setOpenGrade(isOpen ? null : grade)}
                        className={`w-full flex justify-between items-center p-4 font-bold ${isOpen ? 'bg-indigo-50 text-indigo-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                    >
                        <span className="flex items-center gap-2">
                            {grade} 
                            <span className="text-xs bg-white px-2 py-0.5 rounded-full border font-normal text-gray-500">{students.length} طالب</span>
                        </span>
                        {isOpen ? <ChevronDown size={20} /> : <ChevronLeft size={20} />}
                    </button>
                    
                    {isOpen && (
                        <div className="bg-white">
                             <table className="w-full border-collapse">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="py-3 px-4 text-right font-medium">رقم الجلوس</th>
                                        <th className="py-3 px-4 text-right font-medium">اسم الطالب</th>
                                        <th className="py-3 px-4 text-right font-medium">ولي الأمر</th>
                                        <th className="py-3 px-4 text-center font-medium">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {students.map(student => {
                                        const parent = dataService.getParents().find(p => p.id === student.parentId);
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 font-mono text-indigo-600">{student.seatNumber}</td>
                                                <td className="py-3 px-4 font-semibold text-gray-800">{student.name}</td>
                                                <td className="py-3 px-4 text-gray-600">{parent?.name || 'غير مرتبط'}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <button className="text-indigo-600 hover:underline">تعديل البيانات</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-6 text-center text-gray-400 italic">لا يوجد طلاب مسجلين في هذا الصف</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

const BooksManager = ({ selectedGrade, onChangeGrade, refresh, onUpdate }: any) => {
  const books = dataService.getBooksByGrade(selectedGrade);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle || !selectedFile) return;
    
    dataService.addBook({
        id: Math.random().toString(36).substr(2, 9),
        title: newBookTitle,
        gradeLevel: selectedGrade,
        fileName: selectedFile.name,
        dateAdded: new Date().toISOString().split('T')[0]
    });
    
    setNewBookTitle('');
    setSelectedFile(null);
    onUpdate();
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكتاب؟')) {
      dataService.deleteBook(id);
      onUpdate();
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">إدارة الكتب الدراسية</h3>
      <GradeSelector selected={selectedGrade} onChange={onChangeGrade} />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
            <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Plus className="text-emerald-600" size={20} />
                رفع كتاب جديد للصف: {selectedGrade}
            </h4>
            <form onSubmit={handleUpload} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">عنوان الكتاب</label>
                    <input 
                        type="text" 
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder="مثال: كتاب الرياضيات - الفصل الأول"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">ملف الكتاب (PDF)</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm"
                        accept=".pdf"
                        required
                    />
                    <p className="text-xs text-gray-400 mt-1">سيتم حفظ بيانات الكتاب في قاعدة البيانات المحلية.</p>
                </div>
                <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors">
                    رفع وحفظ في قاعدة البيانات
                </button>
            </form>
        </div>

        <div className="space-y-3">
            <h4 className="font-bold text-gray-700 mb-2">الكتب المتوفرة ({books.length})</h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {books.map(book => (
                  <div key={book.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                              <FileText size={24} />
                          </div>
                          <div>
                              <p className="font-semibold text-gray-800">{book.title}</p>
                              <div className="flex gap-2 text-xs text-gray-500">
                                <span>{book.fileName}</span>
                                <span>•</span>
                                <span>{book.dateAdded || '2023-09-01'}</span>
                              </div>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(book.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 size={18} />
                        </button>
                      </div>
                  </div>
              ))}
            </div>
            {books.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                    لا توجد كتب مرفوعة لهذا الصف حالياً
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const ScheduleManager = ({ selectedGrade, onChangeGrade }: any) => {
  const [schedule, setSchedule] = useState(dataService.getSchedule(selectedGrade));

  React.useEffect(() => {
    setSchedule(dataService.getSchedule(selectedGrade));
  }, [selectedGrade]);

  const handleSubjectChange = (dayIndex: number, periodIndex: number, subject: string) => {
     dataService.updateSchedulePeriod(selectedGrade, dayIndex, periodIndex, subject);
     setSchedule([...dataService.getSchedule(selectedGrade)]);
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">تعديل الجدول الدراسي (6 حصص)</h3>
            <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                <Save size={16} />
                <span>يتم الحفظ تلقائياً</span>
            </div>
        </div>
        
        <GradeSelector selected={selectedGrade} onChange={onChangeGrade} />

        <div className="overflow-x-auto border rounded-xl shadow-sm">
            <table className="w-full border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-purple-600 text-white">
                        <th className="p-4 text-right w-32 font-bold">اليوم</th>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <th key={i} className="p-4 text-center border-r border-purple-500 font-medium">الحصة {i + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {schedule.map((daySchedule: any, dayIndex: number) => (
                        <tr key={dayIndex} className="hover:bg-purple-50/30 transition-colors">
                            <td className="p-4 font-bold text-gray-700 bg-gray-50 border-l">{daySchedule.day}</td>
                            {daySchedule.periods.map((period: string, periodIndex: number) => (
                                <td key={periodIndex} className="p-2 border-r border-gray-100">
                                    <select
                                        value={period}
                                        onChange={(e) => handleSubjectChange(dayIndex, periodIndex, e.target.value)}
                                        className="w-full p-2 text-sm border border-transparent focus:border-purple-300 bg-transparent focus:bg-white rounded text-center cursor-pointer outline-none"
                                    >
                                        <option value="---">---</option>
                                        {SUBJECTS.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                        <option value="راحة">راحة ☕</option>
                                    </select>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

const NewsManager = ({ onUpdate, refresh }: any) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<Notification['type']>('GENERAL');
  const [targetId, setTargetId] = useState('');

  const parents = dataService.getParents();

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    dataService.addNotification({
        id: Math.random().toString(36).substr(2, 9),
        title,
        message,
        date: new Date().toISOString().split('T')[0],
        type,
        targetId: type === 'GENERAL' ? undefined : targetId,
        sender: 'الإدارة'
    });

    setTitle('');
    setMessage('');
    onUpdate();
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
        dataService.deleteNotification(id);
        onUpdate();
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold text-gray-800">نشر إشعار جديد</h3>
            <form onSubmit={handlePublish} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإشعار</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="عنوان مختصر..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع الإشعار</label>
                    <select 
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                    >
                        <option value="GENERAL">عام (للمعلمين وأولياء الأمور)</option>
                        <option value="GRADE">خاص بطلاب صف معين</option>
                        <option value="PARENT_SPECIFIC">رسالة خاصة لولي أمر</option>
                    </select>
                </div>

                {type === 'GRADE' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">اختر الصف</label>
                        <select 
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white"
                        >
                             <option value="">اختر...</option>
                            {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                )}

                {type === 'PARENT_SPECIFIC' && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">اختر ولي الأمر</label>
                        <select 
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white"
                        >
                            <option value="">اختر...</option>
                            {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نص الإشعار</label>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="اكتب التفاصيل هنا..."
                    ></textarea>
                </div>

                <button type="submit" className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold transition-colors">
                    نشر الآن
                </button>
            </form>
        </div>

        <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4">سجل الإشعارات</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {dataService.getNotifications().map(notif => (
                    <div key={notif.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow group relative">
                         <button 
                            onClick={() => handleDelete(notif.id)}
                            className="absolute top-4 left-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                            title="حذف الإشعار"
                         >
                            <Trash2 size={18} />
                         </button>

                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 
                            ${notif.type === 'GENERAL' ? 'bg-blue-100 text-blue-600' : 
                              notif.type === 'GRADE' ? 'bg-purple-100 text-purple-600' : 
                              notif.type === 'HOMEWORK' ? 'bg-teal-100 text-teal-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {notif.type === 'HOMEWORK' ? <BookOpen size={20} /> : <Megaphone size={20} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start pl-8">
                                <h4 className="font-bold text-gray-800">{notif.title}</h4>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{notif.date}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                            <div className="mt-2 flex gap-2 items-center">
                                <span className="text-xs font-medium text-gray-500">بواسطة: {notif.sender}</span>
                                <span className="text-gray-300">|</span>
                                <span className={`text-xs px-2 py-0.5 rounded border ${
                                     notif.type === 'GENERAL' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                     notif.type === 'GRADE' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                     notif.type === 'HOMEWORK' ? 'bg-teal-50 text-teal-600 border-teal-100' :
                                     'bg-yellow-50 text-yellow-600 border-yellow-100'
                                }`}>
                                    {notif.type === 'GENERAL' ? 'عام' : 
                                     notif.type === 'HOMEWORK' ? `واجب: ${notif.targetId}` :
                                     notif.type === 'GRADE' ? `خاص بـ ${notif.targetId}` : 
                                     `خاص بولي أمر: ${parents.find(p=>p.id === notif.targetId)?.name || '...'}`}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                 {dataService.getNotifications().length === 0 && (
                    <p className="text-center text-gray-400 py-8">لا توجد إشعارات منشورة</p>
                )}
            </div>
        </div>
    </div>
  );
};
