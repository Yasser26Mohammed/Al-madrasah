
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { UserRole, Student, Notification } from '../types';
import { dataService } from '../services/mockData';
import { User, Star, Bell, Calendar, Book } from 'lucide-react';

interface ParentPortalProps {
  onLogout: () => void;
  parentId: string;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ onLogout, parentId }) => {
  const parent = dataService.getParentById(parentId);
  const children = dataService.getStudentsByParent(parentId);
  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?.id || '');
  const selectedChild = children.find(c => c.id === selectedChildId);
  const notifications = dataService.getNotificationsForParent(parentId);

  if (!parent) return <div>Loading...</div>;

  return (
    <Layout role={UserRole.PARENT} title="بوابة ولي الأمر" onLogout={onLogout} userName={parent.name}>
      
      {/* Welcome Banner */}
      <div className="bg-orange-500 text-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold">مرحباً بك، {parent.name}</h2>
        <p className="opacity-90 mt-1">يمكنك متابعة أداء أبنائك والتواصل مع المدرسة من هنا</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Right Column: Children List & Notifications */}
        <div className="space-y-8">
            {/* Children Selector */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="text-orange-500" /> الأبناء
                </h3>
                <div className="space-y-3">
                    {children.map(child => (
                        <button
                            key={child.id}
                            onClick={() => setSelectedChildId(child.id)}
                            className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                                selectedChildId === child.id 
                                ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                                selectedChildId === child.id ? 'bg-orange-200 text-orange-700' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {child.name.charAt(0)}
                            </div>
                            <div className="mr-3 text-right">
                                <p className="font-bold text-gray-800">{child.name}</p>
                                <p className="text-xs text-gray-500">{child.gradeLevel}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications Feed */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Bell className="text-orange-500" /> آخر الإشعارات
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {notifications.length > 0 ? notifications.map(notif => (
                        <div key={notif.id} className={`p-3 rounded-lg border text-sm ${
                            notif.type === 'HOMEWORK' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'
                        }`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold ${notif.type === 'HOMEWORK' ? 'text-blue-700' : 'text-gray-800'}`}>
                                    {notif.title}
                                </span>
                                <span className="text-xs text-gray-400">{notif.date}</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{notif.message}</p>
                            <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                <span>من: {notif.sender}</span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 py-4">لا توجد إشعارات جديدة</p>
                    )}
                </div>
            </div>
        </div>

        {/* Left Column: Selected Child Details */}
        <div className="lg:col-span-2 space-y-8">
            {selectedChild ? (
                <>
                    {/* Grades Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <Star className="text-yellow-500" /> 
                                درجات الطالب: {selectedChild.name}
                            </h3>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                {selectedChild.gradeLevel}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(selectedChild.grades).map(([subject, score]) => (
                                <div key={subject} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Book size={20} />
                                        </div>
                                        <span className="font-semibold text-gray-700">{subject}</span>
                                    </div>
                                    <div className={`font-bold text-lg ${
                                        score >= 90 ? 'text-green-600' : 
                                        score >= 75 ? 'text-blue-600' : 
                                        score >= 50 ? 'text-orange-600' : 'text-red-600'
                                    }`}>
                                        {score}%
                                    </div>
                                </div>
                            ))}
                            {Object.keys(selectedChild.grades).length === 0 && (
                                <div className="col-span-2 text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                                    لم يتم رصد درجات لهذا الطالب بعد
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Schedule Summary (Mock) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                         <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Calendar className="text-teal-500" /> 
                            الجدول الدراسي اليوم
                        </h3>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {['الرياضيات', 'لغتي', 'القرآن الكريم', 'راحة', 'العلوم', 'التربية الفنية'].map((subject, idx) => (
                                <div key={idx} className="flex-shrink-0 w-24 text-center">
                                    <div className="bg-teal-50 text-teal-700 p-3 rounded-lg mb-2 font-bold text-sm h-20 flex items-center justify-center">
                                        {subject}
                                    </div>
                                    <span className="text-xs text-gray-500">الحصة {idx + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed">
                    الرجاء اختيار طالب لعرض التفاصيل
                </div>
            )}
        </div>

      </div>
    </Layout>
  );
};
